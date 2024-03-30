"use server";

import { LoginSchema, RegisterSchema } from "@/app/types";
import { z } from "zod";
import * as argon from "argon2";
import { db } from "@/lib/db/db";
import { lucia, validateRequest } from "@/lib/auth/auth";
import { cookies } from "next/headers";
import { redirect } from 'next/navigation';

export const login = async (values: z.infer<typeof LoginSchema>) => {
  try {
    LoginSchema.parse(values);

    const existingUser = await db.user.findUnique({
      where: { email: values.email },
    });
    if (!existingUser) {
      return {
        error:
          "There was an issue with your login attempt. If you originally signed up with a social account, please use that method to log in. Otherwise, please check your credentials and try again.",
      };
    }

    if (!existingUser.hashedPassword) {
      return {
        error:
          "There was an issue with your login attempt. If you originally signed up with a social account, please use that method to log in. Otherwise, please check your credentials and try again.",
      };
    }

    const validPassword = await argon.verify(
      existingUser.hashedPassword,
      values.password,
    );

    if (!validPassword) {
      return {
        error: "Invalid username or password",
      };
    }

    const session = await lucia.createSession(existingUser.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes,
    );
    return {
      success: "Login successful",
    };
  } catch (err: any) {
    return {
      error: err?.message,
    };
  }
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {
  const hashedPassword = await argon.hash(values.password)
  
  try {
    const existingUser = await db.user.findUnique({ where: { email: values.email } })
    
    if (existingUser) {
      return {
        error:
          "There was an issue with your login attempt. If you originally signed up with a social account, please use that method to log in. Otherwise, please check your credentials and try again."
      };
    }
    
    const newUser = await db.user.create({
      data: {
        name: values.name,
        email: values.email,
        hashedPassword
      }
    })

    const session = await lucia.createSession(newUser.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)

    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    return {
      success: true,
      redirect: '/'
    }
  } catch (err) {
    console.error(err)
    return {
      error: 'Oops... Seems there was an error'
    }
  }
};

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
