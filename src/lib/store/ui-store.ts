import { create } from "zustand";

type UIState = {
  isModalOpen: boolean;
  isSideSheetOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
  toggleSideSheet: () => void;
};

export const useUIStore = create<UIState>((set) => ({
  isModalOpen: false,
  isSideSheetOpen: false,
  openModal: () => set({ isModalOpen: true }),
  closeModal: () => set({ isModalOpen: false }),
  toggleSideSheet: () =>
    set((state) => ({ isSideSheetOpen: !state.isSideSheetOpen })),
}));
