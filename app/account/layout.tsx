import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Account | Alo Yoga",
  description: "aloyogaclone.vercel.com",
};

export default function AccountLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <body>{children}</body>;
}
