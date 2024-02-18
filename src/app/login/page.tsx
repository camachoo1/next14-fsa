import { redirect } from 'next/navigation';
import { lucia, validateRequest } from '../../../lib/auth';
import { ActionResult, Form } from '../../../lib/form';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { prisma } from '../../../lib/prisma';
import { DatabaseUser } from 'lucia';
import { Argon2id } from 'oslo/password';

export default async function Page() {
  const { user } = await validateRequest();

  if (user) {
    return redirect('/');
  }
  return (
    <>
      <h1>Sign In</h1>
      <Form action={login}>
        <label htmlFor='username'>Username</label>
        <input name='username' id='username' className='outline' />
        <br />
        <label htmlFor='password'>Password</label>
        <input type='password' name='password' id='password' className='outline'/>
        <br />
        <button className='rounded outline'>Continue</button>
      </Form>
      <Link href='/signup'>Create an account</Link>
    </>
  );
}

async function login(
  _: any,
  formData: FormData
): Promise<ActionResult> {
  'use server';
  const username = formData.get('username');

  if (
    typeof username !== 'string' ||
    username.length < 3 ||
    username.length > 31 ||
    !/^[a-z0-9_-]+$/.test(username)
  ) {
    return {
      error: 'Invalid username',
    };
  }
  const password = formData.get('password');
  if (
    typeof password !== 'string' ||
    password.length < 6 ||
    password.length > 255
  ) {
    return {
      error: 'Invalid password',
    };
  }

  const existingUser = prisma.user.findUnique({
    where: { username },
  }) as unknown as DatabaseUser;

  if (!existingUser) {
    return {
      error: 'Incorrect username or password',
    };
  }

  const validPassword = await new Argon2id().verify(
    existingUser.attributes.password!,
    password
  );

  if (!validPassword) {
    return {
      error: 'Invalid username or password',
    };
  }

  const session = await lucia.createSession(existingUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes
  );

  return redirect('/');
}
