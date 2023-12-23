import { create } from "zustand";

interface NavState {
  isOpen: boolean;
  toggleOpen: (isOpen: boolean) => void;
}

export const useNavStore = create<NavState>((set) => ({
  isOpen: true,
  toggleOpen: (isOpen: boolean) => {
    set({ isOpen });
  },
}));
