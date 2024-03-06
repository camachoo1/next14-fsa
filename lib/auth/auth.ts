import { PrismaAdapter } from "@lucia-auth/adapter-prisma";
import { Lucia, User, Session } from "lucia";
import { db } from '../db/db';
import { cache } from "react";
import { cookies } from "next/headers";
import { User as DBUser } from "@prisma/client";

const adapter = new PrismaAdapter(db.session, db.user);

export const lucia = new Lucia(adapter, {
  getUserAttributes: (attributes) => {
    return {
      name: attributes.name,
      email: attributes.email,
    };
  },
  sessionCookie: {
    name: "session",
    expires: false,
    attributes: {
      secure: process.env.NODE_ENV === "production",
    },
  },
});

export const validateRequest = cache(
  async (): Promise<
    { user: User; session: Session } | { user: null; session: null }
  > => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null;

    if (!sessionId) {
      return {
        user: null,
        session: null,
      };
    }

    const result = await lucia.validateSession(sessionId);

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id);
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }

      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie();
        cookies().set(
          sessionCookie.name,
          sessionCookie.value,
          sessionCookie.attributes,
        );
      }
    } catch {}
    return result;
  },
);

interface DatabaseUserAttributes extends DBUser {
  email: string;
  name: string;
}

// IMPORTANT!
declare module "lucia" {
  interface Register {
    Lucia: typeof lucia;
    DatabaseUserAttributes: DBUser;
  }
}
