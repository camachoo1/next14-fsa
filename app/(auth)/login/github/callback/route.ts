import { cookies } from 'next/headers';
import { github } from '@/lib/auth';
import { db } from '@/lib/db';
import { lucia } from '@/lib/auth';
import { OAuth2RequestError } from 'arctic';

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const storedState =
    cookies().get('github_oauth_state')?.value ?? null;
  
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400
    })
  }

  try {
    const tokens = await github.validateAuthorizationCode(code)
    const githubUserResponse = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`
      }
    })

    const githubUser: GitHubUser = await githubUserResponse.json()

    const existingUser = await db.user.findUnique({
      where: {
        githubId: githubUser.id
      }
    })

    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {})
      const sessionCookie = lucia.createSessionCookie(session.id)
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/'
        }
      })
    }

    const user = await db.user.create({
      data: {
        githubId: githubUser.id,
        username: githubUser.login,
      }
    })
    console.log(user)
    const session = await lucia.createSession(user.id, {})
    const sessionCookie = lucia.createSessionCookie(session.id)
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/'
      }
    })
  } catch (error) {
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400
      })
    }

    return new Response(null, {
      status: 500
    })
  }
}


interface GitHubUser {
  id: number,
  login: string,
}