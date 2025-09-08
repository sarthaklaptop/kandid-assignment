"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import toast from "react-hot-toast";
import { EditCampaignDialog } from "@/components/EditCampaignDialog";

type Campaign = {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  totalLeads: number;
  successfulLeads: number;
};

type SortKey =
  | "name"
  | "status"
  | "createdAt"
  | "totalLeads"
  | "successfulLeads";

export default function CampaignsPage() {
  const [allCampaigns, setAllCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>("All");
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    async function fetchCampaigns() {
      try {
        const res = await fetch("/api/campaigns");
        if (!res.ok) throw new Error("Failed to fetch campaigns");
        const data = await res.json();
        setAllCampaigns(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchCampaigns();
  }, []);

  // ✅ Summary stats
  const totalCampaigns = allCampaigns.length;
  const activeCampaigns = allCampaigns.filter(
    (c) => c.status === "Active"
  ).length;
  const totalLeads = allCampaigns.reduce((sum, c) => sum + c.totalLeads, 0);
  const totalResponses = allCampaigns.reduce(
    (sum, c) => sum + c.successfulLeads,
    0
  );
  const avgResponseRate =
    totalLeads > 0 ? Math.round((totalResponses / totalLeads) * 100) : 0;

  // ✅ Filter + Sort logic
  const displayedCampaigns = useMemo(() => {
    let filtered = [...allCampaigns];
    if (statusFilter !== "All") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    filtered.sort((a, b) => {
      let valA: any = a[sortKey];
      let valB: any = b[sortKey];

      if (sortKey === "createdAt") {
        valA = new Date(valA).getTime();
        valB = new Date(valB).getTime();
      }

      if (valA < valB) return sortOrder === "asc" ? -1 : 1;
      if (valA > valB) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [allCampaigns, statusFilter, sortKey, sortOrder]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortKey(key);
      setSortOrder("asc");
    }
  }

  async function handleDelete(id: number) {
    try {
      // show loading toast
      const toastId = toast.loading("Deleting campaign...");

      const res = await fetch(`/api/campaigns/${id}`, { method: "DELETE" });

      if (!res.ok) {
        throw new Error("Failed to delete campaign");
      }

      setAllCampaigns((prev) => prev.filter((c) => c.id !== id));

      // update toast to success
      toast.success("Campaign deleted successfully!", { id: toastId });
    } catch (err) {
      console.error("Failed to delete campaign", err);
      toast.error("Failed to delete campaign");
    }
  }

  async function handleToggleStatus(campaign: Campaign) {
    const newStatus = campaign.status === "Active" ? "Paused" : "Active";
    try {
      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error("Failed to update status");
      const updated = await res.json();

      setAllCampaigns((prev) =>
        prev.map((c) =>
          c.id === campaign.id ? { ...c, status: updated.status } : c
        )
      );
    } catch (err) {
      console.error("Failed to update campaign", err);
    }
  }

  async function handleStatusChange(id: number, newStatus: string) {
    try {
      const toastId = toast.loading("Updating status...");
      const res = await fetch(`/api/campaigns/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error("Failed to update status");

      const updated = await res.json();
      setAllCampaigns((prev) => prev.map((c) => (c.id === id ? updated : c)));

      toast.success("Status updated!", { id: toastId });
    } catch (err) {
      console.error(err);
      toast.error("Failed to update status");
    }
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Campaigns</h1>

      {/* ✅ Summary Cards with Skeleton */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              totalLeads.toString()
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              totalLeads.toString()
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Leads</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              totalLeads.toString()
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Avg Response Rate</CardTitle>
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {loading ? (
              <Skeleton className="h-8 w-16" />
            ) : (
              `${avgResponseRate}%`
            )}
          </CardContent>
        </Card>
      </div>

      {/* ✅ Status Filter */}
      <div className="flex justify-end mb-4">
        <Select onValueChange={setStatusFilter} defaultValue="All">
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Filter by Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="All">All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Draft">Draft</SelectItem>
            <SelectItem value="Paused">Paused</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* ✅ Campaigns Table */}
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead
              onClick={() => handleSort("name")}
              className="cursor-pointer"
            >
              Name {sortKey === "name" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </TableHead>
            <TableHead
              onClick={() => handleSort("status")}
              className="cursor-pointer"
            >
              Status{" "}
              {sortKey === "status" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </TableHead>
            <TableHead
              onClick={() => handleSort("totalLeads")}
              className="cursor-pointer"
            >
              Total Leads{" "}
              {sortKey === "totalLeads"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </TableHead>
            <TableHead
              onClick={() => handleSort("successfulLeads")}
              className="cursor-pointer"
            >
              Successful Leads{" "}
              {sortKey === "successfulLeads"
                ? sortOrder === "asc"
                  ? "↑"
                  : "↓"
                : ""}
            </TableHead>
            <TableHead>Response Rate</TableHead>
            <TableHead>Progress</TableHead>
            <TableHead
              onClick={() => handleSort("createdAt")}
              className="cursor-pointer"
            >
              Created At{" "}
              {sortKey === "createdAt" ? (sortOrder === "asc" ? "↑" : "↓") : ""}
            </TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading
            ? Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 8 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-6 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : displayedCampaigns.map((c) => {
                const responseRate =
                  c.totalLeads > 0
                    ? Math.round((c.successfulLeads / c.totalLeads) * 100)
                    : 0;

                return (
                  <TableRow key={c.id}>
                    <TableCell>
                      <Link
                        href={`/campaigns/${c.id}`}
                        className="hover:underline underline-offset-4 font-medium"
                      >
                        {c.name}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          c.status === "Active"
                            ? "default"
                            : c.status === "Draft"
                            ? "secondary"
                            : c.status === "Paused"
                            ? "outline"
                            : "destructive"
                        }
                      >
                        {c.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{c.totalLeads}</TableCell>
                    <TableCell>{c.successfulLeads}</TableCell>
                    <TableCell>{responseRate}%</TableCell>
                    <TableCell className="w-48">
                      <Progress value={responseRate} />
                    </TableCell>
                    <TableCell>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell className="space-x-2">
                      {/* <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEdit(c)}
                      >
                        Edit
                      </Button> */}
                      <EditCampaignDialog
                        campaign={c}
                        onUpdated={(updated) =>
                          setAllCampaigns((prev) =>
                            prev.map((x) => (x.id === updated.id ? updated : x))
                          )
                        }
                      />
                      {c.status === "Active" ? (
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => handleStatusChange(c.id, "Paused")}
                        >
                          Pause
                        </Button>
                      ) : (
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleStatusChange(c.id, "Active")}
                        >
                          Resume
                        </Button>
                      )}
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(c.id)}
                      >
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
        </TableBody>
      </Table>
    </div>
  );
}
