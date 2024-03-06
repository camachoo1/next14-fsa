import { github } from "@/lib/auth/github";
import { generateState } from "arctic";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(): Promise<NextResponse> {
  const state = generateState();
  const url = await github.createAuthorizationURL(state, {
    scopes: ["read:user", "user:email"],
  });

  cookies().set("github_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    sameSite: "lax",
  });

  return NextResponse.redirect(url);
}
