"use server";

import { lucia } from "@/lib/auth/auth";
import { db } from "@/lib/db/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

interface ActionResult {
  error: string | null;
}

const register = async (_: any, formData: FormData): Promise<ActionResult> => {
  const email = formData.get("email");
  const name = formData.get("name");
  const password = formData.get("password");
  if (
    typeof email !== "string" ||
    typeof name !== "string" ||
    typeof password !== "string"
  ) {
    return {
      error: "Please ensure all fields are correctly filled out",
    };
  }

  const argon = new Argon2id();
  const hashedPassword = await argon.hash(password);

  try {
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return {
        error: "An account with this email already exists.",
      };
    }

    const newUser = await db.user.create({
      data: {
        email,
        hashedPassword,
        name,
      },
    });

    const session = await lucia.createSession(newUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (err: any) {
    console.error("Registration error", err);
    return {
      error: "An error occurred during registration. Please try again",
    };
  }
};

export default register;
