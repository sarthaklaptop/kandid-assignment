"use client";

import { useMemo, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { LeadProfile } from "./LeadProfile";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Filter } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { useLeadsFilterStore } from "@/stores/leadsFilterStore";
import { useLeadsSelectionStore } from "@/stores/leadsSelectionStore";
import { useLeadsInfinite } from "@/lib/ReactQueryProvider";

type Lead = {
  id: number;
  name: string;
  role: string | null;
  avatar: string | null;
  campaign: string | null;
  campaignDescription?: string | null;
  email: string;
  company: string | null;
  lastContactDate: string | null;
  activity?: string[];
  status: {
    label: string;
    color: string;
  };
};

const statusStyles = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  CONTACTED: { label: "Contacted", color: "bg-blue-100 text-blue-700" },
  RESPONDED: { label: "Responded", color: "bg-purple-100 text-purple-700" },
  CONVERTED: { label: "Converted", color: "bg-green-100 text-green-700" },
};

export default function LeadsPage() {
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  const {
    searchQuery,
    setSearchQuery,
    statusFilter,
    setStatusFilter,
    campaignFilter,
    setCampaignFilter,
  } = useLeadsFilterStore();

  const { selectedLeadId, setLead: setSelectedLeadId } =
    useLeadsSelectionStore();

  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useLeadsInfinite({ q: searchQuery, status: statusFilter ?? undefined });

  const leads = useMemo(() => {
    if (!data) return [];

    if (Array.isArray(data)) {
      return data.map((lead: any) => ({
        id: lead.id,
        name: lead.name,
        role: lead.role,
        avatar: lead.avatarUrl,
        email: lead.email,
        company: lead.company,
        campaign: lead.campaign?.name,
        campaignDescription: lead.campaign?.description ?? null,
        lastContactDate: lead.lastContactDate,
        activity: lead.activity ?? ["#9ca3af", "#9ca3af", "#9ca3af"],
        status: statusStyles[lead.status as keyof typeof statusStyles] || {
          label: "Unknown",
          color: "bg-gray-200 text-gray-700",
        },
      }));
    }

    if (data.pages) {
      return data.pages.flatMap((page: any) => {
        const rows = page?.items || page || [];
        return rows.map((lead: any) => ({
          id: lead.id,
          name: lead.name,
          role: lead.role,
          avatar: lead.avatarUrl,
          email: lead.email,
          company: lead.company,
          campaign: lead.campaign?.name,
          campaignDescription: lead.campaign?.description ?? null,
          lastContact: lead.lastContactDate,
          activity: lead.activity ?? ["#9ca3af", "#9ca3af", "#9ca3af"],
          status: statusStyles[lead.status as keyof typeof statusStyles] || {
            label: "Unknown",
            color: "bg-gray-200 text-gray-700",
          },
        }));
      });
    }

    return [];
  }, [data]);

  const processedLeads = useMemo(() => {
    let result = [...leads];

    if (campaignFilter) {
      result = result.filter((lead) => lead.campaign === campaignFilter);
    }

    if (sortOrder) {
      result.sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
    }

    return result;
  }, [leads, campaignFilter, sortOrder]);

  const selectedLead = useMemo(() => {
    if (!selectedLeadId) return null;
    return leads.find((lead) => lead.id === selectedLeadId) || null;
  }, [selectedLeadId, leads]);

  if (isError) {
    return <div className="p-4 text-red-500">{(error as Error).message}</div>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h1 className="text-2xl font-semibold mb-4">Leads</h1>

      <div className="mb-4 w-full md:w-1/3">
        <Input
          placeholder="Search leads..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>
                Name
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setSortOrder((prev) =>
                      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
                    )
                  }
                >
                  {sortOrder === "asc" && <ChevronUp className="h-4 w-4" />}
                  {sortOrder === "desc" && <ChevronDown className="h-4 w-4" />}
                </Button>
              </TableHead>
              <TableHead>
                Campaign Name
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setCampaignFilter(null)}>
                      All Campaigns
                    </DropdownMenuItem>
                    {[...new Set(leads.map((l) => l.campaign))].map((c) => (
                      <DropdownMenuItem
                        key={c}
                        onClick={() => setCampaignFilter(c)}
                      >
                        {c}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>
                Status
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Filter />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                      All Statuses
                    </DropdownMenuItem>
                    {["Pending", "Contacted", "Responded", "Converted"].map(
                      (status) => (
                        <DropdownMenuItem
                          key={status}
                          onClick={() => setStatusFilter(status)}
                        >
                          {status}
                        </DropdownMenuItem>
                      )
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell className="flex items-center gap-3">
                    <Skeleton className="h-9 w-9 rounded-full" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Skeleton className="h-5 w-1 rounded" />
                      <Skeleton className="h-5 w-1 rounded" />
                      <Skeleton className="h-5 w-1 rounded" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </TableCell>
                </TableRow>
              ))
            ) : processedLeads.length > 0 ? (
              processedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className="hover:bg-muted/50 cursor-pointer"
                  onClick={() => setSelectedLeadId(lead.id)}
                >
                  <TableCell className="flex items-center gap-3">
                    <Image
                      src={lead.avatar!}
                      alt={lead.name}
                      width={36}
                      height={36}
                      className="rounded-full object-cover"
                    />
                    <div>
                      <p className="font-medium">{lead.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {lead.role}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell>{lead.campaign}</TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      {(lead.activity || []).map((color, i) => (
                        <span
                          key={i}
                          className="w-1 h-5 rounded"
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={`rounded-full px-3 py-1 text-xs font-medium ${lead.status.color}`}
                    >
                      {lead.status.label}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-6">
                  No leads found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {hasNextPage && (
        <div className="flex justify-center mt-4">
          <Button onClick={() => fetchNextPage()} disabled={isFetchingNextPage}>
            {isFetchingNextPage ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
      <Drawer
        open={!!selectedLead}
        onOpenChange={(isOpen) => !isOpen && setSelectedLeadId(null)}
        direction="right"
      >
        <DrawerContent className="w-1/3 min-w-[400px] h-full top-0 right-0 left-auto mt-0 rounded-none">
          {selectedLead && <LeadProfile lead={selectedLead} />}
        </DrawerContent>
      </Drawer>
    </div>
  );
}
