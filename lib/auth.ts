import { PrismaAdapter } from '@lucia-auth/adapter-prisma';
import { prisma } from './prisma';
import { Lucia, TimeSpan } from 'lucia';
import { webcrypto } from 'node:crypto';
import { cache } from 'react';
import { cookies } from 'next/headers';

import type { Session, User } from 'lucia'

// globalThis.crypto = webcrypto as Crypto


const adapter = new PrismaAdapter(prisma.session, prisma.user)

export const lucia = new Lucia(adapter, {
  sessionCookie: {
    name: 'session',
    expires: false,
    attributes: {
      secure: true,
      sameSite: 'strict',
      domain: 'localhost:3000'
    }
  },
  sessionExpiresIn: new TimeSpan(30, 'd'),
  getUserAttributes: (attributes) => {
    return {
      username: attributes.username
    }
  },
})

export const validateRequest = cache(
  async (): Promise<{ user: User, session: Session } | { user: null, session: null }> => {
    const sessionId = cookies().get(lucia.sessionCookieName)?.value ?? null

    if (!sessionId) {
      return {
        user: null,
        session: null
      }
    }

    const result = await lucia.validateSession(sessionId)

    try {
      if (result.session && result.session.fresh) {
        const sessionCookie = lucia.createSessionCookie(result.session.id)
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
      }

      if (!result.session) {
        const sessionCookie = lucia.createBlankSessionCookie()
        cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
      }
    } catch { }
    return result
  }
)


declare module 'lucia' {
  interface Register {
    Lucia: typeof lucia;
    DatabaseSessionAttributes: DatabaseSessionAttributes;
    DatabaseUserAttributes: DatabaseUserAttributes
  }
}

interface DatabaseSessionAttributes { }
interface DatabaseUserAttributes {
  username: string,
  password: string | null
}