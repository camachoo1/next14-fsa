'use server';

import { z } from 'zod';
import { RegisterSchema } from '../types/zod.types';
import { Argon2id } from 'oslo/password';
import { generateId } from 'lucia';
import { prisma } from '../lib/prisma';
import { lucia } from '../lib/auth';
import { cookies } from 'next/headers';
import { convertToDateTime } from '../utils/convertToDateTime';

export const register = async (
  values: z.infer<typeof RegisterSchema>
) => {
  console.log(values);

  const hashedPassword = await new Argon2id().hash(values.password);
  const userId = generateId(15);

  try {
    await prisma.user.create({
      data: {
        id: userId,
        username: values.username,
        email: values.email,
        hashedPassword,
      },
      select: {
        id: true,
        username: true,
      },
    });

    const session = await lucia.createSession(userId, {
      expiresAt: convertToDateTime(),
    });

    const sessionCookie = lucia.createSessionCookie(session.id);

    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );

    return {
      success: true,
      data: {
        userId,
      },
    };
  } catch (error: any) {
    return {
      error: error?.message,
    };
  }
};
