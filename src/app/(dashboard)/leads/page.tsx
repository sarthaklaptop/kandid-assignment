"use client";

import { useEffect, useState } from "react";
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

// Define a type for our transformed lead data
type Lead = {
  id: number;
  name: string;
  role: string | null;
  avatar: string | null;
  campaign: string | null;
  activity: string[];
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
  const [error, setError] = useState<string | null>(null); // State for errors

  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("/api/leads");
        
        // ✅ Check if the API call was successful
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        
        const data = await response.json();

        const transformedData = data.map((lead: any) => ({
          id: lead.id,
          name: lead.name,
          role: lead.company,
          avatar: lead.owner?.image ?? "/default-avatar.png",
          campaign: lead.campaign?.name ?? "N/A",
          activity: ["#9ca3af", "#9ca3af", "#9ca3af"],
          status:
            statusStyles[lead.status as keyof typeof statusStyles] ||
            { label: "Unknown", color: "bg-gray-200 text-gray-700" },
        }));

        setLeads(transformedData);
      } catch (error) {
        console.error("Error fetching leads:", error);
        setError("Could not load leads. Please try again later."); // Set error message
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeads();
  }, []);

  if (isLoading) {
    return <div className="p-4">Loading leads...</div>;
  }

  if (error) {
    return <div className="p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col w-full h-full p-4">
      <h1 className="text-2xl font-semibold mb-4">Leads</h1>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Campaign Name</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {leads.map((lead) => (
              <TableRow
                key={lead.id}
                className="hover:bg-muted/50 cursor-pointer"
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
                    <p className="text-xs text-muted-foreground">{lead.role}</p>
                  </div>
                </TableCell>
                <TableCell>{lead.campaign}</TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {lead.activity.map((color, i) => (
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
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}