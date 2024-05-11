import { create } from "zustand";

type ModalType = "Login" | "Register" | null;

type AuthModalProps = {
  modalType: ModalType;
  isOpen: boolean;
  openModal: (type: ModalType) => void;
  closeModal: () => void;
  toggleModal: () => void;
};

export const useAuthModal = create<AuthModalProps>((set) => ({
  modalType: null,
  isOpen: false,
  openModal: (type: ModalType) => set({ isOpen: true, modalType: type }),
  closeModal: () => set({ isOpen: false, modalType: null }),
  toggleModal: () =>
    set((state) => ({
      modalType: state.modalType === "Login" ? "Register" : "Login",
    })),
}));
