import { create } from "zustand";

interface LeadsFilterState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  statusFilter: string | null;
  setStatusFilter: (status: string | null) => void;
  campaignFilter: string | null;
  setCampaignFilter: (campaign: string | null) => void;
}

export const useLeadsFilterStore = create<LeadsFilterState>((set) => ({
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),
  statusFilter: null,
  setStatusFilter: (status) => set({ statusFilter: status }),
  campaignFilter: null,
  setCampaignFilter: (campaign) => set({ campaignFilter: campaign }),
}));