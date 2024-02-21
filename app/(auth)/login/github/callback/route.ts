// Import necessary modules and utilities
import { cookies } from 'next/headers';
import { github, lucia } from '@/lib/auth';
import { db } from '@/lib/db';
import { OAuth2RequestError } from 'arctic';

// The main handler for GET requests to this route
export async function GET(request: Request): Promise<Response> {
  // Parse the request URL to extract query parameters
  const url = new URL(request.url);
  const code = url.searchParams.get('code'); // The authorization code from GitHub
  const state = url.searchParams.get('state'); // The state parameter for CSRF protection
  
  // Retrieve the stored state from cookies for validation
  const storedState =
    cookies().get('github_oauth_state')?.value ?? null;

  // Validate the presence and correctness of 'code', 'state', and 'storedState'
  if (!code || !state || !storedState || state !== storedState) {
    // Respond with 400 Bad Request if validation fails
    return new Response(null, {
      status: 400,
    });
  }

  try {
    // Exchange the authorization code for tokens using the custom 'github' utility
    const tokens = await github.validateAuthorizationCode(code);
    // Fetch the GitHub user's profile using the access token
    const githubUserResponse = await fetch(
      'https://api.github.com/user',
      {
        headers: {
          Authorization: `Bearer ${tokens.accessToken}`,
        },
      }
    );

    // Parse the GitHub user's data
    const githubUser: GitHubUser = await githubUserResponse.json();

    // Check if a user associated with the GitHub profile already exists in the database
    const existingUser = await db.user.findUnique({
      where: {
        githubId: githubUser.id,
      },
    });

    // If the user exists, create a new session and set a session cookie
    if (existingUser) {
      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(
        sessionCookie.name,
        sessionCookie.value,
        sessionCookie.attributes
      );
      // Redirect the user to the homepage after successful authentication
      return new Response(null, {
        status: 302,
        headers: {
          Location: '/',
        },
      });
    }

    // If the user does not exist, create a new user record in the database
    const user = await db.user.create({
      data: {
        githubId: githubUser.id,
        username: githubUser.login,
      },
    });

    // Create a session for the new user and set a session cookie
    const session = await lucia.createSession(user.id, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(
      sessionCookie.name,
      sessionCookie.value,
      sessionCookie.attributes
    );
    // Redirect the new user to the homepage
    return new Response(null, {
      status: 302,
      headers: {
        Location: '/',
      },
    });
  } catch (error) {
    // Handle OAuth2 specific errors with a 400 Bad Request response
    if (error instanceof OAuth2RequestError) {
      return new Response(null, {
        status: 400,
      });
    }

    // For any other errors, respond with 500 Internal Server Error
    return new Response(null, {
      status: 500,
    });
  }
}

// Define the structure of the GitHub user data expected in the response
interface GitHubUser {
  id: number;
  login: string;
}
