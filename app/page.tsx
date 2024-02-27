import { lucia, validateRequest } from "@/lib/auth";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";

export default async function Home() {
  const { user } = await validateRequest();

  // if (!user) {
  //   return redirect('/login');
  // }

  return (
    <main className="m-auto my-10 max-w-5xl space-y-10 px-3">
      {user ? (
        <div>
          <p>{user?.username}</p>
          <p>{user?.githubId}</p>
        </div>
      ) : (
        "Hello Alo"
      )}
    </main>
  );
}