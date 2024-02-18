import { z } from 'zod';

export const RegisterSchema = z
  .object({
    username: z
      .string()
      .min(2, { message: 'Username must be at least 2 characters' })
      .max(15, {
        message: 'Username cannot be longer than 15 characters',
      }),
    email: z.string().email({ message: 'Not a valid email' }),
    password: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters long',
      })
      .max(15, {
        message: 'Password cannot be longer than 15 characters',
      }),
    confirmPassword: z
      .string()
      .min(6, {
        message: 'Password must be at least 6 characters long',
      })
      .max(15, {
        message: 'Password cannot be longer than 15 characters',
      }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });
