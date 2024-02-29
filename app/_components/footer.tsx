import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative w-full bg-foreground px-10 py-9 text-white dark:bg-background dark:border-t">
      <div className="mx-auto flex justify-around px-6">
        <div className="flex flex-col gap-y-8">
          <h1 className="text-lg">Customer Service</h1>
          <div className="flex flex-col gap-y-1 text-sm">
            <p>Track My Order</p>
            <p>FAQs</p>
            <p>Contact Us</p>
            <p>Return Policy</p>
            <p>Size Guide</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-8">
          <h1 className="text-lg">My Account</h1>
          <div className="flex flex-col gap-y-1 text-sm">
            <p>Login or Register</p>
            <p>Order History</p>
          </div>
        </div>
        <div className="flex flex-col gap-y-8">
          <h1 className="text-lg">Information</h1>
          <div className="flex flex-col gap-y-1 text-sm">
            <p>We Are Alo</p>
            <p>About Us</p>
          </div>
        </div>
        <div className="flex flex-col items-center gap-y-8">
          <h1>Follow Us</h1>
          <div className="flex gap-1">
            <Link href="https://github.com/camachoo1/">
              <Image
                src="/github-logo.png"
                alt="github"
                height={50}
                width={50}
                className="rounded-full p-1"
              />
            </Link>
            <Link href="https://www.linkedin.com/in/omar-camacho-aa01b3133/">
              <Image
                src="/linkedin-logo.jpg"
                alt="github"
                height={50}
                width={50}
                className="rounded-full p-1"
              />
            </Link>
          </div>
        </div>
      </div>
      <div className="m-auto flex space-x-2 px-40 py-4">
        <p className="">© 2024 Alo, LLC. All Rights Reserved.</p>
        <p className="border-b border-current">Terms</p>
        <p className="border-b border-current">Privacy</p>
        <p className="border-b border-current">Cookie Policy</p>
      </div>
    </footer>
  );
}
