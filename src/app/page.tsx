import { redirect } from 'next/navigation'
import { lucia, validateRequest } from '../../lib/auth'
import { cookies } from 'next/headers'



export default async function Page() {
  const { user } = await validateRequest()
  
  if (!user) {
    return redirect('/login')
  }

  return (
    <>
      <h1>Hi, {user.username}</h1>
      <p>Your user ID is {user.id}</p>
      <button onClick={logout}>Sign Out</button>
    </>
  )
}

async function logout() {
  const { session } = await validateRequest()
  
  if (!session) {
    return {
      error: 'Unauthorized'
    }
  }

  await lucia.invalidateSession(session.id)
  const sessionCookie = lucia.createBlankSessionCookie()
  cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes)
  return redirect('/login')
}