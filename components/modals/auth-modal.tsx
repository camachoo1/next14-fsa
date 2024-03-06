"use client";

import { useAuthModal } from "@/hooks/useAuthModal";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Modal from "./modal";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { useCallback } from "react";

const AuthModal = () => {
  const router = useRouter();
  const authModal = useAuthModal();
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

  const bodyContent = <div>Sign in with Google</div>;

  const footer = (
    <div>
      <button onClick={onToggle}>
        {authModal.modalType === "Login"
          ? "Register Now"
          : "Login to your account"}
      </button>
    </div>
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
