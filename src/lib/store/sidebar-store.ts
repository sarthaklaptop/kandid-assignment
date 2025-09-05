// sidebar-store.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

type SidebarState = {
  isCollapsed: boolean;
  activeRoute: string;
  toggleCollapse: () => void;
  setCollapse: (value: boolean) => void;
  setActiveRoute: (route: string) => void;
};

export const useSidebarStore = create<SidebarState>()(
  persist(
    (set) => ({
      isCollapsed: false,
      activeRoute: "/dashboard",
      toggleCollapse: () =>
        set((state) => ({ isCollapsed: !state.isCollapsed })),
      setCollapse: (value) => set({ isCollapsed: value }),
      setActiveRoute: (route) => set({ activeRoute: route }),
    }),
    { name: "sidebar-storage" }
  )
);
