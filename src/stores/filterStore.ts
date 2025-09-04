import { create } from "zustand";

interface FilterState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string;
  setStatusFilter: (status: string) => void;
}

export const useFilterStore = create<FilterState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  statusFilter: "all",
  setStatusFilter: (status) => set({ statusFilter: status }),
}));