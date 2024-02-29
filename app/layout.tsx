import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "@/app/_components/main-nav";
import { Montserrat } from "next/font/google";
import { validateRequest } from "@/lib/auth";
import ClientOnly from "./_components/ClientOnly";
import Footer from "./_components/footer";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Alo Yoga",
  description: "aloyogaclone.vercel.com",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await validateRequest();
  return (
    <html lang="en">
      <body
        className={`${montserrat.className} min-w-[350px] overscroll-none`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          disableTransitionOnChange
        >
          <ClientOnly>
            <Navbar currentUser={user} />
          </ClientOnly>
          {children}
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
