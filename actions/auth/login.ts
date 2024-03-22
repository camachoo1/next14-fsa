"use server";

import { LoginSchema, RegisterSchema } from "@/app/types";
import { z } from "zod";
import * as argon from "argon2";

export const login = async (values: z.infer<typeof LoginSchema>) => {
  try {
    const vals = LoginSchema.parse(values);
    return console.log({ vals });
  } catch (err: any) {
    return {
      error: err?.message,
    };
  }
};

export const register = async (values: z.infer<typeof RegisterSchema>) => {};
