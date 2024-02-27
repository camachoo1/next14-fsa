import { lucia, validateRequest } from "@/lib/auth";
import accountViewSchema from "@/lib/validations/accountviewschema";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

interface AccountMenuProps {
  searchParams: {
    view?: string;
  };
}

export default async function AccountMenu({
  searchParams: { view },
}: AccountMenuProps) {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/");
  }
  return (
    <aside className="sticky top-0 h-fit rounded-lg p-4 md:w-[260px] dark:text-white">
      <form action={action}>
        <div className="flex flex-col items-start gap-y-2">
          <button name="view" type="submit" value="edit">
            Account Information
          </button>
          <button name="view" type="submit" value="order-history">
            Order History
          </button>
          <button name="view" type="submit" value="wishlist">
            Wishlist
          </button>
          <button name="view" type="submit" value="logout">
            Sign out
          </button>
        </div>
      </form>
    </aside>
  );
}

async function action(formData: FormData) {
  "use server";
  const values = Object.fromEntries(formData.entries());
  const { view } = accountViewSchema.parse(values);

  if (view === "logout") {
    return await logout();
  }
  const searchParams = new URLSearchParams({
    ...(view && { view }),
  });
  redirect(`/account?${searchParams.toString()}`);
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
  return redirect("/");
}

interface ActionResult {
  error: string | null;
}
