"use client";

import { useAuthModal } from "@/hooks/useAuthModal";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useCallback } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { LoginSchema } from "@/app/types";
import { Button } from "../ui/button";
import Link from "next/link";

const AuthModal = () => {
  const router = useRouter();
  const authModal = useAuthModal();
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const { register, handleSubmit } = useForm<FieldValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });
  console.log(authModal.modalType);

  const onSubmit: SubmitHandler<FieldValues> = (data) => {};

  const onToggle = useCallback(() => {
    authModal.toggleModal();
  }, [authModal]);

  const bodyContent = (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="w-full space-y-2">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl className="w-full">
                <Input placeholder="email" {...field} />
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
                <Input placeholder="password" type="password" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );

  const footer = (
    <>
      <div className="flex w-full items-center justify-center gap-2">
        <span className="w-full border-b border-muted-foreground"></span>
        <span className="flex-none text-sm text-muted-foreground">
          Or sign in with your email
        </span>
        <span className="w-full border-b border-muted-foreground"></span>
      </div>

      <div className="flex w-full flex-col items-center justify-center space-y-2">
        <Link href="/auth/github" className="w-full">
          <Button variant={"outline"} className="flex w-full">
            <div className="mx-2 flex cursor-pointer items-center justify-center gap-x-2 border-black">
              <img
                src="/github-logo.png"
                alt="github"
                className="h-6 w-6 rounded-full object-cover"
              />
              <p className="dark:text-white">Sign in with GitHub</p>
            </div>
          </Button>
        </Link>

        <Link href="/auth/google" className="w-full">
          <Button variant={"outline"} className="flex w-full">
            <div className="mx-2 flex cursor-pointer items-center justify-center gap-x-2 border-black">
              <img
                src="/linkedin-logo.jpg"
                alt="github"
                className="h-6 w-6 rounded-full object-cover"
              />
              <p className="dark:text-white">Sign in with Google</p>
            </div>
          </Button>
        </Link>
      </div>

      <div className="text-center">
        <button onClick={onToggle}>
          {authModal.modalType === "Login"
            ? "Register Now"
            : "Login to your account"}
        </button>
      </div>
    </>
  );
  return (
    <Modal
      isOpen={authModal.isOpen}
      title={authModal.modalType as string}
      onSubmit={handleSubmit(onSubmit)}
      body={bodyContent}
      actionLabel="Continue"
      onClose={authModal.closeModal}
      footer={footer}
    />
  );
};

export default AuthModal;