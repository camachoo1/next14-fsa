import { lucia } from "@/lib/auth/auth";
import { google } from "@/lib/auth/google";
import { db } from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";

interface GoogleUser {
  id: string;
  email: string;
  name: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  // Retrieve OAuth state and code verifier stored in cookies for validation.
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier = cookies().get("code_verifier")?.value ?? null;

  if (
    !code ||
    !state ||
    !storedState ||
    state !== storedState ||
    !storedCodeVerifier
  ) {
    return new NextResponse(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(
      code,
      storedCodeVerifier,
    );

    // Fetch the user's profile information from Google using the access token.
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const googleUser: GoogleUser = await googleUserResponse.json();

    // Handle user registration or login in a database transaction.
    return await db.$transaction(async (tx) => {
      // Check if a user with the given email already exists.
      const existingUser = await tx.user.findUnique({
        where: { email: googleUser.email },
      });

      // Create a new user if not existing; otherwise, update their account.
      if (!existingUser) {
        const newUser = await tx.user.create({
          data: {
            email: googleUser.email,
            name: googleUser.name,
          },
        });

        // Create OAuth account linkage.
        await tx.oAuthAccount.create({
          data: {
            providerId: "google",
            providerUserId: `${googleUser.id}`,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.accessTokenExpiresAt,
            userId: newUser.id,
          },
        });

        // Create and set a session cookie for the new user.
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
        // Existing user login path, similar to registration but using existingUser data.
        await tx.oAuthAccount.create({
          data: {
            providerId: "google",
            providerUserId: `${googleUser.id}`,
            userId: existingUser.id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.accessTokenExpiresAt,
          },
        });
        // Create a session for the existing user
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
