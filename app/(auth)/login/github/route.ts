import { generateState } from 'arctic';
import { cookies } from 'next/headers';
import { github } from '@/lib/auth'; 

// Define an asynchronous GET function to handle incoming GET requests to this route
export async function GET(): Promise<Response> {
  // Generate a random 'state' string to mitigate CSRF attacks during the OAuth flow
  const state = generateState();

  // Use the 'github' utility to create a GitHub OAuth authorization URL, passing the generated state
  const url = await github.createAuthorizationURL(state);

  // Set a cookie named 'github_oauth_state' with the generated state value
  cookies().set('github_oauth_state', state, {
    path: '/', // Cookie is accessible for the entire domain
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production for HTTPS only
    httpOnly: true, // Cookie cannot be accessed through client-side scripts, enhancing security
    maxAge: 60 * 10,
    sameSite: 'lax', // Lax SameSite policy to allow the cookie to be sent in top-level navigations
  });

  // Redirect the user's browser to the GitHub OAuth authorization URL to initiate the login flow
  return Response.redirect(url);
}
