"use client";

import { useEffect, useState, useMemo } from "react";
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
  activity?: string[]; // Made optional with default fallback
  status: {
    label: string;
    color: string;
  };
};

// Map database statuses to UI styles
const statusStyles = {
  PENDING: { label: "Pending", color: "bg-yellow-100 text-yellow-700" },
  CONTACTED: { label: "Contacted", color: "bg-blue-100 text-blue-700" },
  RESPONDED: { label: "Responded", color: "bg-purple-100 text-purple-700" },
  CONVERTED: { label: "Converted", color: "bg-green-100 text-green-700" },
};

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [campaignFilter, setCampaignFilter] = useState<string | null>(null);

  const processedLeads = useMemo(() => {
    let result = [...leads];

    result = result.filter((lead) =>
      [lead.name, lead.role, lead.campaign, lead.status.label]
        .filter(Boolean)
        .some((field) =>
          field!.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    if (statusFilter) {
      result = result.filter((lead) => lead.status.label === statusFilter);
    }

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
  }, [searchQuery, statusFilter, campaignFilter, sortOrder, leads]);

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/leads");
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const data = await response.json();
        
        const transformedData = data.map((lead: any) => ({
          id: lead.id,
          name: lead.name,
          role: lead.role,
          avatar: lead.avatarUrl ?? "/default-avatar.png",
          email: lead.email,
          company: lead.company,
          campaign: lead.campaign?.name ?? "N/A",
          campaignDescription: lead.campaign?.description ?? null,
          lastContactDate: lead.lastContactDate,
          // Add default activity array or use from API if available
          activity: lead.activity ?? ["#9ca3af", "#9ca3af", "#9ca3af"],
          status: statusStyles[lead.status as keyof typeof statusStyles] || {
            label: "Unknown",
            color: "bg-gray-200 text-gray-700",
          },
        }));

        setLeads(transformedData);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setError("Could not load leads. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeads();
  }, []);

  // ✅ filtered leads by search
  const filteredLeads = useMemo(() => {
    return leads.filter((lead) =>
      [lead.name, lead.role, lead.campaign, lead.status.label]
        .filter(Boolean)
        .some((field) =>
          field!.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
  }, [searchQuery, leads]);

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
      <div className="flex flex-col w-full h-full p-4">
        <h1 className="text-2xl font-semibold mb-4">Leads</h1>

        {/* ✅ Search input */}
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
                    {sortOrder === "desc" && (
                      <ChevronDown className="h-4 w-4" />
                    )}
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
                // ✅ Skeleton loader rows
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
                    onClick={() => setSelectedLead(lead)}
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
      <Drawer
        open={!!selectedLead}
        onOpenChange={(isOpen) => !isOpen && setSelectedLead(null)}
        direction="right"
      >
        <DrawerContent className="w-1/3 min-w-[400px] h-full top-0 right-0 left-auto mt-0 rounded-none">
          {selectedLead && <LeadProfile lead={selectedLead} />}
        </DrawerContent>
      </Drawer>
      </div>
  )
}