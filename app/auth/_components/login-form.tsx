"use client";

import { LoginSchema } from "@/app/types";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

export default function LoginForm() {
  const router = useRouter();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {};

  return (
    <>
      <div className="flex w-full flex-col items-center justify-center space-y-2">
        <Button variant={"outline"} className="flex w-full">
          <Link href="/auth/github">
            <div className="mx-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-black bg-muted hover:bg-muted-foreground/30 active:bg-muted-foreground/30 dark:invert">
              <img
                src="/github-logo.png"
                alt="github"
                className="h-6 w-6 rounded-full object-cover"
              />
            </div>
            Sign in with GitHub
          </Link>
        </Button>
        <Button variant={"outline"} className="flex w-full">
          <Link href="/auth/google">
            <div className="mx-2 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full border-black bg-muted hover:bg-muted-foreground/30 active:bg-muted-foreground/30 dark:invert">
              <img
                src="/linkedin-logo.jpg"
                alt="github"
                className="h-6 w-6 rounded-full object-cover"
              />
            </div>
            Sign in with Google
          </Link>
        </Button>
      </div>

      <div className="flex w-full items-center justify-center gap-2">
        <span className="w-full border-b border-muted-foreground"></span>
        <span className="flex-none text-sm text-muted-foreground">
          Or sign in with your email
        </span>
        <span className="w-full border-b border-muted-foreground"></span>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="w-full space-y-2"
        >
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl className="w-full">
                  <Input placeholder="shadcn" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />{" "}
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input placeholder="****" type="password" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
}
