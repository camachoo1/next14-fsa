import AccountMenu from "@/app/account/_components/account-menu";
import { validateRequest } from "@/lib/auth/auth";
import DynamicContent from "./_components/DynamicContent";

const orders = [
  {
    id: "1",
    date: "January, 17, 2024",
    total: "$85.32",
    details: {
      name: "Double Take Short Sleeve",
      color: "Black",
      size: "L",
      quantity: 1,
      price: "$78",
    },
  },
  {
    id: "2",
    date: "January, 17, 2024",
    total: "$85.32",
    details: {
      name: "Double Take Short Sleeve",
      color: "Bone",
      size: "M",
      quantity: 1,
      price: "$78",
    },
  },
]; 

export default async function AccountPage() {
  const { user } = await validateRequest();

  if (!user) {
    return <h1>Unauthorized</h1>;
  }

  return (
    <div className="container mx-auto flex pt-32 dark:text-white">
      <div className="flex columns-2 items-center">
        <AccountMenu searchParams={{ view: "order-history" }} />
        <DynamicContent />
      </div>
    </div>
  );
}
