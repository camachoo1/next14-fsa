import Image from "next/image";
import Link from "next/link";
import { ShoppingBagIcon, UserIcon, SearchIcon } from "lucide-react";
import { ModeToggle } from "../../components/ModeToggle";
import { validateRequest } from "@/lib/auth/auth";
import { User } from "@prisma/client";

interface NavbarProps {
  currentUser?: User | null;
}

export default function Navbar({ currentUser }: NavbarProps) {
  return (
    // Main container
    <header className="sticky top-0 z-50 overflow-auto bg-white/80 dark:bg-background dark:text-white">
      <nav className="flex px-9 dark:border-white">
        <div className="flex w-full justify-between border-b-[1px] border-black/55 py-4 dark:border-white/55">
          <div className="flex cursor-pointer items-center justify-between gap-x-4 text-lg font-bold">
            <Link
              href="/"
              className="overflow-x-hidden overflow-y-hidden dark:invert"
            >
              <Image src="/alo.svg" alt="Alo Logo" height={48} width={71} />
            </Link>
            {/* TODO: Change these to hold the different categories */}
            <h2 className="hover-underline-animation pt-5">WOMEN</h2>
            <h2 className="hover-underline-animation pt-5">MEN</h2>
            <h2 className="hover-underline-animation pt-5">ACCESSORIES</h2>
          </div>

          {/* Right side of navbar */}
          <div className="flex cursor-pointer items-center justify-between gap-5">
            <SearchIcon size={24} />

            {!currentUser ? (
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
                  Hi{" "}
                  <span className="font-semibold">{currentUser.username}!</span>
                </p>
              </Link>
            )}

            <ShoppingBagIcon size={24} />

            <ModeToggle />
          </div>
        </div>
        {/* Left side of navbar */}
      </nav>
    </header>
  );
}
