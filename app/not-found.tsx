"use client";

import Image from "next/image";

export default function NotFound() {
  return (
    <div className="m-auto flex h-[586px] w-full flex-col items-center justify-center py-40">
      <div className="m-auto flex flex-col items-center space-y-1">
        <Image
          src="/oops.webp"
          alt="oops"
          height={100}
          width={100}
          className="dark:invert"
        />
        <div className="flex flex-col items-center gap-4">
          <h1 className="text-3xl font-bold uppercase tracking-wider">
            There's nothing here
          </h1>
          <p className="tracking-tighter text-muted-foreground">
            Sorry, we couldn't find the page you were looking for. Want to see
            the latest?
          </p>
        </div>
      </div>

      <div className="flex p-10">
        <button className="mx-2 flex items-center text-nowrap bg-foreground px-4 py-3 text-xs uppercase text-white dark:bg-white dark:text-black">
          <a className="" href="/">
            Go to the home page
          </a>
        </button>
        <button className="mx-2 flex items-center text-nowrap bg-foreground px-4 py-3 text-xs uppercase text-white dark:bg-white dark:text-black">
          Shop new arrivals
        </button>
      </div>
    </div>
  );
}
