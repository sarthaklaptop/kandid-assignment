import { create } from "zustand";

type LeadsState = {
  selectedLeads: string[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  toggleLeadSelection: (id: string) => void;
  clearSelection: () => void;
};

export const useLeadsStore = create<LeadsState>((set) => ({
  selectedLeads: [],
  searchQuery: "",
  setSearchQuery: (q) => set({ searchQuery: q }),
  toggleLeadSelection: (id) =>
    set((state) => ({
      selectedLeads: state.selectedLeads.includes(id)
        ? state.selectedLeads.filter((leadId) => leadId !== id)
        : [...state.selectedLeads, id],
    })),
  clearSelection: () => set({ selectedLeads: [] }),
}));
