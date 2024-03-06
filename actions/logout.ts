"use server";

import { validateRequest, lucia } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function logout(): Promise<ActionResult> {
  const { session } = await validateRequest();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/");
}

interface ActionResult {
  error: string | null;
}
