"use server";

import { lucia } from "@/lib/auth/auth";
import { db } from "@/lib/db/db";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Argon2id } from "oslo/password";

interface ActionResult {
  error: string | null;
}

const login = async (_: any, formData: FormData): Promise<ActionResult> => {
  const email = formData.get("email");
  if (typeof email !== "string") {
    return {
      error:
        "There was an issue with your login attempt. If you originally signed up with a social account, please use that method to log in. Otherwise, please check your credentials and try again.",
    };
  }

  const password = formData.get("password");
  if (typeof password !== "string") {
    return {
      error:
        "There was an issue with your login attempt. If you originally signed up with a social account, please use that method to log in. Otherwise, please check your credentials and try again.",
    };
  }
  const argon = new Argon2id();

  try {
    const existingUser = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (existingUser && !existingUser.hashedPassword) {
      const oAuthAccounts = await db.oAuthAccount.findMany({
        where: { userId: existingUser.id },
      });
      if (oAuthAccounts.length > 0) {
        return {
          error:
            "There was an issue with your login attempt. If you originally signed up with a social account, please use that method to log in. Otherwise, please check your credentials and try again.",
        };
      }
    }

    const dummy = process.env.DUMMY_PASSWORD as string;
    const dummyHash = await argon.hash(dummy);
    const validPassword =
      existingUser && existingUser.hashedPassword
        ? await argon.verify(existingUser.hashedPassword, password)
        : await argon.verify(dummyHash, password);

    if (!validPassword || !existingUser) {
      return {
        error:
          "There was an issue with your login attempt. If you originally signed up with a social account, please use that method to log in. Otherwise, please check your credentials and try again.",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return redirect("/");
  } catch (err: any) {
    return {
      error: err.message || "An error occurred",
    };
  }
};

export default login;
