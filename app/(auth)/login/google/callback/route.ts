import { lucia } from "@/lib/auth/auth";
import { google } from "@/lib/auth/google";
import { db } from "@/lib/db/db";
import { NextRequest, NextResponse } from "next/server";
import { parseCookies } from "oslo/cookie";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";

interface GoogleUser {
  id: string;
  email: string;
  name: string;
  given_name: string;
}

export async function GET(req: NextRequest): Promise<NextResponse> {
  const url = new URL(req.url);
  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

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
    const googleUserResponse = await fetch(
      "https://www.googleapis.com/oauth2/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      },
    );

    const googleUser: GoogleUser = await googleUserResponse.json();
    console.log({ googleUser });

    return await db.$transaction(async (tx) => {
      const existingUser = await tx.user.findUnique({
        where: { email: googleUser.email },
      });

      if (!existingUser) {
        const newUser = await tx.user.create({
          data: {
            email: googleUser.email,
            username: googleUser.given_name,
            name: googleUser.name,
          },
        });

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
            providerId: "google",
            providerUserId: `${googleUser.id}`,
            userId: existingUser.id,
            accessToken: tokens.accessToken,
            refreshToken: tokens.refreshToken,
            expiresAt: tokens.accessTokenExpiresAt,
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
