"use client";

import { useCallback, useEffect, useState } from "react";
import { Button } from "../ui/button";

type ModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  onSubmit: () => void;
  title?: string;
  body?: React.ReactElement;
  actionLabel: string;
  disabled?: boolean;
  footer?: React.ReactElement;
};

export default function Modal({
  isOpen,
  onClose,
  onSubmit,
  title,
  body,
  footer,
  actionLabel,
  disabled,
}: ModalProps) {
  const [showModal, setShowModal] = useState(isOpen);

  useEffect(() => {
    setShowModal(isOpen);
  }, [isOpen]);

  const handleClose = useCallback(() => {
    if (disabled) {
      return null;
    }

    setShowModal(false);
    setTimeout(() => {
      onClose();
    }, 300);
  }, [onClose, disabled]);

  const handleSubmit = useCallback(() => {
    if (disabled) {
      return null;
    }

    onSubmit();
  }, [onSubmit, disabled]);

  if (!isOpen) {
    return null;
  }

  return (
    <>
      <div
        className="fixed 
          inset-0 
          z-50 
          flex 
          items-center 
          justify-center 
          overflow-y-auto 
          overflow-x-hidden 
          bg-neutral-800/70 
          outline-none
          focus:outline-none"
      >
        <div
          className="relative 
          mx-auto
          my-6
          h-full
          w-full
          md:h-auto
          md:w-4/6 
          lg:h-auto 
          lg:w-3/6
          xl:w-2/5"
        >
          {/* CONTENT */}
          <div
            className={`
            translate
            h-full
            duration-300
            ${showModal ? "translate-y-0" : "translate-y-full"}
            ${showModal ? "opacity-100" : "opacity-0"}
          `}
          >
            <div
              className="translate
              relative
              flex
              h-full
              w-full 
              flex-col 
              rounded-lg 
              border-0 
              bg-white 
              dark:bg-background
              shadow-lg 
              outline-none 
              focus:outline-none 
              md:h-auto 
              lg:h-auto"
            >
              {/* HEADER */}
              <div
                className="relative 
                flex 
                items-center
                justify-center
                rounded-t
                border-b-[1px]
                p-6"
              >
                <button
                  className="
                    absolute
                    left-9 
                    border-0
                    p-1
                    transition
                    hover:opacity-70
                  "
                  onClick={handleClose}
                >
                  X
                </button>
                {/* TITLE */}
                <div className="text-lg font-semibold">{title}</div>
              </div>
              {/* BODY */}
              <div className="relative flex-auto p-6">{body}</div>
              {/* FOOTER */}
              <div className="flex flex-col gap-2 p-6">
                <div className="flex w-full items-center gap-4 dark:text-white">
                  <Button
                    variant="default"
                    disabled={disabled}
                    onClick={handleSubmit}
                    className="w-full"
                  >
                    {actionLabel}
                  </Button>
                </div>
                {footer}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
