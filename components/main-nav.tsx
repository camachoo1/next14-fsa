import Image from "next/image";
import Link from "next/link";
import { ShoppingBagIcon, UserIcon, SearchIcon } from "lucide-react";
import { ModeToggle } from "./ModeToggle";
import { validateRequest } from "@/lib/auth";

export default async function Navbar() {
  const { user } = await validateRequest();

  return (
    // Main container
    <header className=" dark:border-white dark:text-white">
      <nav className="flex max-w-full justify-between border-b-[1px] border-black/20 px-9 py-5 ">
        {/* Left side of navbar */}
        <div className="flex cursor-pointer items-center justify-between gap-4 text-lg font-bold">
          <Link
            href="/"
            className="gap-3 overflow-x-hidden overflow-y-hidden dark:invert"
          >
            <Image
              src="/alo.svg"
              alt="Alo Logo"
              height={48}
              width={71}
              className=""
            />
          </Link>
          {/* TODO: Change these to hold the different categories */}
          <h2 className="hover-underline-animation pt-5">WOMEN</h2>
          <h2 className="hover-underline-animation pt-5">MEN</h2>
          <h2 className="hover-underline-animation pt-5">ACCESSORIES</h2>
        </div>

        {/* Right side of navbar */}
        <div className="flex cursor-pointer items-center justify-between gap-5">
          <SearchIcon size={24} />

          {!user ? (
            <Link
              href="/login/github"
              className="group flex items-center gap-1 border-b-2 border-black dark:border-white"
            >
              <UserIcon
                size={24}
                className="group-hover:fill-black dark:group-hover:fill-white"
              />
              <span className="pt-1 text-sm uppercase ">
                Sign in to get rewards
              </span>
            </Link>
          ) : (
            <Link
              href="/account"
              className="group flex items-center gap-1 border-b-2 border-black dark:border-white"
            >
              <UserIcon
                size={24}
                className="group-hover:fill-black dark:group-hover:fill-white"
              />
              <p className="pt-1 text-sm uppercase tracking-tight">
                Hi <span className="font-semibold">{user.username}!</span>
              </p>
            </Link>
          )}

          <ShoppingBagIcon size={24} />

          <ModeToggle />
        </div>
      </nav>
    </header>
  );
}
