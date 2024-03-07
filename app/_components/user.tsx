"use client";

import { useAuthModal } from "@/hooks/useAuthModal";
import { Link, UserIcon } from "lucide-react";
import { useCallback } from "react";

const User = () => {
  const {isOpen, openModal, closeModal, modalType} = useAuthModal();

  const handleClick = useCallback(() => {
    if (!isOpen) {
      openModal('Login')
    }
  }, []);
  return (
    <button
      onClick={handleClick}
      className="group flex items-center gap-1 border-b-2 border-black dark:border-white"
    >
      <UserIcon
        size={24}
        className="group-hover:fill-black dark:group-hover:fill-white"
      />
      <span className="pt-1 text-sm uppercase ">Sign in to get rewards</span>
    </button>
  );
};

export default User;
