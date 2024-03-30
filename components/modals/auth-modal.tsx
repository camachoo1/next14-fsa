"use client";

import { useAuthModal } from "@/hooks/useAuthModal";
import Modal from "./modal";
import { useForm } from "react-hook-form";
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
import { LoginSchema, RegisterSchema } from "@/app/types";
import { Button } from "../ui/button";
import Link from "next/link";
import { login, register } from "@/actions/auth";

const AuthModal = () => {
  const authModal = useAuthModal();

  const form = useForm<z.infer<typeof LoginSchema | typeof RegisterSchema>>({
    resolver:
      authModal.modalType === "Login"
        ? zodResolver(LoginSchema)
        : zodResolver(RegisterSchema),
    defaultValues:
      authModal.modalType === "Login"
        ? {
            email: "",
            password: "",
          }
        : {
            email: "",
            password: "",
            confirmPassword: "",
            name: "",
          },
  });

  const onSubmit = async (
    values: z.infer<typeof LoginSchema | typeof RegisterSchema>,
  ) => {
    if (authModal.modalType === "Login" && "password" in values) {
      const res = await login(values as z.infer<typeof LoginSchema>);
      if (res.success) {
        authModal.closeModal();
        return {
          success: "Login successful",
          redirect: "/",
        };
      }
    } else if (
      authModal.modalType === "Register" &&
      "confirmPassword" in values
    ) {
      const res = await register(values as z.infer<typeof RegisterSchema>);
      if (res.success) {
        authModal.closeModal();
        return {
          success: 'Login successful',
          redirect: '/'
        }
      }
    }
  };

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
        {authModal.modalType === "Register" && (
          <>
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <FormControl className="w-full">
                    <Input
                      placeholder="Confirm Password"
                      type="password"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl className="w-full">
                    <Input placeholder="Name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </>
        )}
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
      onSubmit={form.handleSubmit(onSubmit)}
      body={bodyContent}
      actionLabel="Continue"
      onClose={authModal.closeModal}
      footer={footer}
    />
  );
};

export default AuthModal;
