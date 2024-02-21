import { lucia, validateRequest } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import Navbar from './_components/logo/Navbar';

export default async function Home() {
  const { user } = await validateRequest();

  // if (!user) {
  //   return redirect('/login');
  // }

  return (
    <Navbar />
  );
}

async function logout(): Promise<ActionResult> {
  'use server';
  const { session } = await validateRequest();

  if (!session) {
    return {
      error: 'Unauthorized',
    };
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );
  return redirect('/login');
}

interface ActionResult {
  error: string | null;
}
