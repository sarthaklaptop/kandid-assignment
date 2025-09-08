// app/(dashboard)/campaigns/page.tsx (client)
"use client";

import {
  Table, TableHeader, TableRow, TableHead, TableBody, TableCell
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { useCampaigns } from "@/lib/ReactQueryProvider";

export default function CampaignsPageClient() {
  const { data, isLoading, isError, error } = useCampaigns();

  if (isLoading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6"><Skeleton className="h-8 w-64" /></h1>
        <div className="rounded-md border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Total Leads</TableHead>
                <TableHead>Response Rate</TableHead>
                <TableHead>Progress</TableHead>
                <TableHead>Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Array.from({ length: 6 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-10" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                  <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (isError) {
    return <div className="p-6 text-red-600">Error loading campaigns: {(error as Error).message}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Campaigns</h1>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Total Leads</TableHead>
              <TableHead>Response Rate</TableHead>
              <TableHead>Progress</TableHead>
              <TableHead>Created At</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.map((c: any) => {
              const responseRate = c.totalLeads > 0 ? Math.round((c.successfulLeads / c.totalLeads) * 100) : 0;
              return (
                <TableRow key={c.id}>
                  <TableCell><Link href={`/campaigns/${c.id}`} className="text-blue-600 hover:underline">{c.name}</Link></TableCell>
                  <TableCell><Badge>{c.status}</Badge></TableCell>
                  <TableCell>{c.totalLeads}</TableCell>
                  <TableCell>{responseRate}%</TableCell>
                  <TableCell className="w-48"><Progress value={responseRate} /></TableCell>
                  <TableCell>{new Date(c.createdAt).toLocaleDateString()}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
