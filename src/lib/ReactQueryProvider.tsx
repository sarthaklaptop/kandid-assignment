// src/lib/queries.ts
import {
  useInfiniteQuery,
  useQuery,
  useMutation,
  useQueryClient,
  InfiniteData,
} from "@tanstack/react-query";

type Lead = {
  id: string | number;
  name: string;
  role?: string;
  status: string;
  campaign?: { id: string; name: string };
};

type Campaign = {
  id: string | number;
  name: string;
  status: string;
  totalLeads: number;
  successfulLeads: number;
  createdAt: string;
};

type LeadInCampaign = {
  id: number;
  name: string;
  role: string | null;
  avatarUrl: string | null;
  email: string;
  company: string | null;
  status: string;
};

type CampaignWithLeads = Campaign & {
  leads: LeadInCampaign[];
};

// Infinite leads
export const useLeadsInfinite = (opts?: {
  q?: string;
  status?: string;
  pageSize?: number;
}) => {
  const pageSize = opts?.pageSize ?? 20;

  return useInfiniteQuery({
    queryKey: ["leads", opts?.q ?? "", opts?.status ?? ""],
    queryFn: async ({ pageParam = 1 }) => {
      const url = new URL("/api/leads", location.origin);
      url.searchParams.set("page", String(pageParam));
      url.searchParams.set("limit", String(pageSize));
      if (opts?.q) url.searchParams.set("q", opts.q);
      if (opts?.status) url.searchParams.set("status", opts.status);

      const res = await fetch(url.toString());
      if (!res.ok) throw new Error("Failed to fetch leads");
      // expected shape: { items: Lead[], nextPage: number | null }
      return res.json();
    },
    getNextPageParam: (lastPage: any) => lastPage?.nextPage ?? null,
    initialPageParam: 1,
  });
};

// Campaigns
export const useCampaigns = () =>
  useQuery<Campaign[]>({
    queryKey: ["campaigns"],
    queryFn: async () => {
      const res = await fetch("/api/campaigns", { credentials: "include" }); // Added credentials
      if (!res.ok) throw new Error("Failed to fetch campaigns");
      return res.json();
    },
  });

export const useCampaign = (id: string | number) =>
  useQuery<CampaignWithLeads>({
    queryKey: ["campaign", id],
    queryFn: async () => {
      const res = await fetch(`/api/campaigns/${id}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch campaign data");
      return res.json();
    },
    enabled: !!id,
  });

// Optimistic mutation for lead status
export const useUpdateLeadStatus = () => {
  const qc = useQueryClient();

  return useMutation<
    Lead, // return type
    Error, // error type
    { id: string | number; status: string } // variables type
  >({
    mutationFn: async ({ id, status }) => {
      const res = await fetch(`/api/leads/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (!res.ok) throw new Error("Update failed");
      return res.json();
    },
    onMutate: async ({ id, status }) => {
      await qc.cancelQueries({ queryKey: ["leads"] });

      const previous = qc.getQueryData<InfiniteData<any>>(["leads"]);

      // optimistic update
      qc.setQueryData<InfiniteData<any>>(["leads"], (old) => {
        if (!old) return old;
        return {
          ...old,
          pages: old.pages.map((page) => ({
            ...page,
            items: page.items.map((item: Lead) =>
              item.id === id ? { ...item, status } : item
            ),
          })),
        };
      });

      return { previous };
    },
    onError: (_err, _vars, context: unknown) => {
      const previous = (context as { previous?: InfiniteData<any> } | undefined)
        ?.previous;
      if (previous) {
        qc.setQueryData(["leads"], previous);
      }
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};
