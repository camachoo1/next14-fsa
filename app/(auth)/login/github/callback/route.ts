import { lucia } from "@/lib/auth/auth";
import { github } from "@/lib/auth/github";
import { db } from '@/lib/db/db';
import { OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

interface GitHubUser {
  id: number;
  login: string;
  name: string;
  email: string;
  accessToken: string;
}

export async function GET(request: NextRequest): Promise<NextResponse> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("github_oauth_state")?.value ?? null;

  if (!code || !state || !storedState || state !== storedState) {
    return new NextResponse(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);

    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
        "User-Agent": "lucia",
      },
    });

    const githubUser: GitHubUser = await githubUserResponse.json();

    const emailsResponse = await fetch("https://api.github.com/user/emails", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });

    const emails = await emailsResponse.json();
    const primaryEmail = emails.find((email: any) => email.primary) ?? null;
    if (!primaryEmail) {
      return new NextResponse("No primary email address", {
        status: 400,
      });
    }

    return await db.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email: primaryEmail.email },
      });

      if (!existingUser) {
        const newUser = await db.user.create({
          data: {
            email: primaryEmail.email,
            username: githubUser.login,
            name: githubUser.name,
          },
        });

        await db.oAuthAccount.create({
          data: {
            providerId: "github",
            providerUserId: `${githubUser.id}`,
            accessToken: tokens.accessToken,
            userId: newUser.id,
          },
        });

        const session = await lucia.createSession(newUser.id, {});
        const sessionCookie = lucia.createSessionCookie(session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
        return new NextResponse(null, {
          status: 302,
          headers: {
            Location: "/",
          },
        });
      } else {
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
        return new NextResponse(null, {
          status: 302,
          headers: {
            Location: "/",
          },
        });
      }
    });
  } catch (err: any) {
    if (err instanceof OAuth2RequestError) {
      return new NextResponse(null, {
        status: 400,
      });
    }

    return new NextResponse(null, {
      status: 500,
    });
  }
}
