import Image from "next/image";
import Link from "next/link";
import { ShoppingBagIcon, UserIcon, SearchIcon } from "lucide-react";
import { ModeToggle } from "./ModeToggle";

const Navbar = () => {
  return (
    <header className="shadow-sm dark:text-white">
      <nav className="m-auto flex max-w-7xl justify-between px-3 py-5 ">
        <div className="flex cursor-pointer items-center justify-between gap-6">
          <Link
            href="/"
            className="dark:invert gap-3 overflow-x-hidden overflow-y-hidden"
          >
            <Image
              src="/alo.svg"
              alt="Alo Logo"
              height={48}
              width={71}
              className=""
            />
          </Link>

          <h2 className="hover-underline-animation pt-5">WOMEN</h2>
          <h2 className="hover-underline-animation pt-5">MEN</h2>
          <h2 className="hover-underline-animation pt-5">ACCESSORIES</h2>
        </div>
        <div className="flex cursor-pointer items-center justify-between gap-5">
          <SearchIcon size={24} />

          <div className="group flex items-center gap-1 border-b-2 border-black dark:border-white">
            <UserIcon
              size={24}
              className="group-hover:fill-black dark:group-hover:fill-white"
            />
            <span className="pt-1 text-sm uppercase ">
              Sign in to get rewards
            </span>
          </div>

          <ShoppingBagIcon size={24} />

          <ModeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
