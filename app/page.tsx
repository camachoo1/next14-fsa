import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const { user } = await validateRequest();

  // if (!user) {
  //   return redirect('/login');
  // }

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">Hello Alo</main>
  );
}

async function logout(): Promise<ActionResult> {
  "use server";
  const { session } = await validateRequest();

  if (!session) {
    return {
      error: "Unauthorized",
    };
  }

  await lucia.invalidateSession(session.id);
  const sessionCookie = lucia.createBlankSessionCookie();
  cookies().set(
    sessionCookie.name,
    sessionCookie.value,
    sessionCookie.attributes,
  );
  return redirect("/login");
}

interface ActionResult {
  error: string | null;
}
