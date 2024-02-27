import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { db } from './db';
import { Lucia, User, Session } from 'lucia';
import { cache } from 'react';
import { cookies } from 'next/headers';
import { GitHub } from 'arctic';
import { User as DBUser,Cart } from '@prisma/client';

interface DatabaseUserAttributes extends DBUser {
  readonly username: string;
  readonly githubId: number;
  readonly cart?: Cart | null;
}

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username,
      githubId: attributes.githubId,
      cart: attributes.cart
    };
  },
  sessionCookie: {
    // this sets cookies with super long expiration
    // since Next.js doesn't allow Lucia to extend cookie expiration when rendering pages
    name: 'session',
    expires: false,
    attributes: {
      // set to `true` when using HTTPS
      secure: process.env.NODE_ENV === 'production',
    },
  },
});

export const github = new GitHub(
  process.env.GITHUB_CLIENT_ID!,
  process.env.GITHUB_CLIENT_SECRET!
);

// IMPORTANT!
declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: Omit<DatabaseUserAttributes, 'id'>;
  }
}

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId =
      cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(
          result.session.id
        );
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }

      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes
        );
      }
    } catch {}
    return result;
  }
);
