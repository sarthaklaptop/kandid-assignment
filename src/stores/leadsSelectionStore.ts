import { create } from "zustand";

interface LeadsSelectionState {
  selectedLeadId: number | null;
  setLead: (id: number | null) => void;
}

export const useLeadsSelectionStore = create<LeadsSelectionState>((set) => ({
  selectedLeadId: null,
  setLead: (id) => set({ selectedLeadId: id }),
}));