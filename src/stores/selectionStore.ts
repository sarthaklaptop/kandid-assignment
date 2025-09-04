import { create } from "zustand";

interface SelectionState {
  selectedLeadId: string | null;
  setLead: (id: string | null) => void;
  selectedCampaignId: string | null;
  setCampaign: (id: string | null) => void;
}

export const useSelectionStore = create<SelectionState>((set) => ({
  selectedLeadId: null,
  setLead: (id) => set({ selectedLeadId: id }),
  selectedCampaignId: null,
  setCampaign: (id) => set({ selectedCampaignId: id }),
}));
