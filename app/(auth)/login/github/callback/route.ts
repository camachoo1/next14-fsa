import { lucia } from "@/lib/auth/auth";
import { github } from "@/lib/auth/github";
import { db } from '@/lib/db/db';
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GitHubUser {
  id: number;
  name: string;
  email: string;
  accessToken: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  // Retrieve the 'state' stored in cookies to prevent CSRF attacks
  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new NextResponse(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    // Fetch the GitHub user's profile using the access token
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "User-Agent": "lucia",
      },
    });

    const githubUser: GitHubUser = await githubUserResponse.json();

    // Fetch the GitHub user's emails
    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const emails = await emailsResponse.json();

    // Find the primary email
    const primaryEmail = emails.find((email: any) => email.primary) ?? null;
    if (!primaryEmail) {
      // If no primary email is found, return a 400 Bad Request response
      return new NextResponse("No primary email address", {
        status: 400,
      });
    }

    // Handle user registration or login in a database transaction
    return await db.$transaction(async (tx) => {
      // Check if the user already exists in the database
      const existingUser = await tx.user.findUnique({
        where: { email: primaryEmail.email },
      });

      // If the user doesn't exist, create a new user and OAuth account
      if (!existingUser) {
        const newUser = await tx.user.create({
          data: {
            email: primaryEmail.email,
            name: githubUser.name,
          },
        });

        await tx.oAuthAccount.create({
          data: {
            providerId: "github",
            providerUserId: `${githubUser.id}`,
            accessToken: tokens.accessToken,
            userId: newUser.id,
          },
        });

        // Create a session for the new user
        const session = await lucia.createSession(newUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );

        // Redirect the user to the homepage
        return new NextResponse(null, {
          status: 302,
          headers: {
            Location: "/",
          },
        });
      } else {
        // If the user exists, update their OAuth account and create a session
        await tx.oAuthAccount.create({
          data: {
            providerId: "github",
            providerUserId: `${githubUser.id}`,
            accessToken: tokens.accessToken,
            userId: existingUser.id,
          },
        });

        const session = await lucia.createSession(existingUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );

        // Redirect the user to the homepage
        return new NextResponse(null, {
          status: 302,
          headers: {
            Location: "/",
          },
        });
      }
    });
  } catch (err: any) {
    // Handle OAuth2 request errors specifically
    if (err instanceof OAuth2RequestError) {
      return new NextResponse(null, {
        status: 400,
      });
    }

    // Handle other errors with a 500 Internal Server Error response
    return new NextResponse(null, {
      status: 500,
    });
  }
}
