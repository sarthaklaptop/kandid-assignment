"use client";

import { useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { useFilterStore } from "@/stores/filterStore";
import { useSelectionStore } from "@/stores/selectionStore";

export default function ClientCampaignDetail({
  campaign,
  relatedLeads,
}: {
  campaign: any;
  relatedLeads: any[];
}) {
  // Zustand filters
  const { searchQuery, setSearchQuery, statusFilter, setStatusFilter } = useFilterStore();
  const { selectedLeadId, setLead } = useSelectionStore();

  // Filtered leads (memoized)
  const displayedLeads = useMemo(() => {
    return relatedLeads.filter((lead) => {
      const matchesName = lead.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus =
        statusFilter === "ALL" ? true : lead.status === statusFilter;
      return matchesName && matchesStatus;
    });
  }, [searchQuery, statusFilter, relatedLeads]);

  return (
    <div className="space-y-6">
      {/* Campaign Info */}
      <div>
        <h1 className="text-2xl font-bold">{campaign.name}</h1>
        <p className="text-gray-600">{campaign.description}</p>
        <p className="mt-2">
          <strong>Status:</strong> {campaign.status}
        </p>
        <p>
          <strong>Created:</strong>{" "}
          {new Date(campaign.createdAt).toLocaleDateString()}
        </p>
      </div>

      {/* Filters */}
      <div className="flex gap-4 items-center">
        <Input
          placeholder="Search by name..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-xs"
        />

        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="CONTACTED">Contacted</SelectItem>
            <SelectItem value="RESPONDED">Responded</SelectItem>
            <SelectItem value="CONVERTED">Converted</SelectItem>
            <SelectItem value="DO_NOT_CONTACT">Do Not Contact</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Leads Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {displayedLeads.length > 0 ? (
              displayedLeads.map((lead) => (
                <TableRow
                  key={lead.id}
                  className={`cursor-pointer ${
                    selectedLeadId === String(lead.id) ? "bg-blue-50" : ""
                  }`}
                  onClick={() =>
                    setLead(selectedLeadId === String(lead.id) ? null : String(lead.id))
                  }
                >
                  <TableCell className="font-medium">{lead.name}</TableCell>
                  <TableCell>{lead.role ?? "—"}</TableCell>
                  <TableCell>{lead.email}</TableCell>
                  <TableCell>{lead.company ?? "—"}</TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium
                        ${
                          lead.status === "PENDING"
                            ? "bg-gray-200 text-gray-800"
                            : lead.status === "CONTACTED"
                            ? "bg-blue-100 text-blue-800"
                            : lead.status === "RESPONDED"
                            ? "bg-yellow-100 text-yellow-800"
                            : lead.status === "CONVERTED"
                            ? "bg-green-100 text-green-800"
                            : lead.status === "DO_NOT_CONTACT"
                            ? "bg-red-100 text-red-800"
                            : "bg-neutral-200 text-neutral-800"
                        }`}
                    >
                      {lead.status}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6">
                  No leads found for this campaign.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
