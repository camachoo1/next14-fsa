import logout from "@/actions/logout";
import { validateRequest } from "@/lib/auth/auth";
import accountViewSchema from "@/lib/validations/accountviewschema";
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
    <aside className="sticky top-0 h-fit rounded-lg p-4 md:w-[260px]">
      <form action={menuAction}>
        <div className="flex flex-col items-start gap-y-2">
          <button
            name="view"
            type="submit"
            value="edit"
            className="hover:text-muted-foreground"
          >
            Account Information
          </button>
          <button
            name="view"
            type="submit"
            value="order-history"
            className="hover:text-muted-foreground"
          >
            Order History
          </button>
          <button
            name="view"
            type="submit"
            value="wishlist"
            className="hover:text-muted-foreground"
          >
            Wishlist
          </button>
          <button
            name="view"
            type="submit"
            value="logout"
            className="hover:text-muted-foreground"
          >
            Sign out
          </button>
        </div>
      </form>
    </aside>
  );
}

async function menuAction(formData: FormData) {
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
