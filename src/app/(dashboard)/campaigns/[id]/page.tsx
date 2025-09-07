import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

// ✅ shadcn ui
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface CampaignPageProps {
  params: { id: string };
}

export default async function CampaignDetailPage({
  params
}: CampaignPageProps) {
  const { id } = await params; 
  const campaignId = Number(id);


  const [campaign] = await db
    .select()
    .from(campaigns)
    .where(eq(campaigns.id, campaignId));

  const relatedLeads = await db
    .select()
    .from(leads)
    .where(eq(leads.campaignId, campaignId));

  if (!campaign) {
    return <div className="p-6">Campaign not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      {/* ✅ Breadcrumb */}
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/campaigns">Campaigns</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{campaign.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

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

      {/* ✅ Leads Table (shadcn/ui) */}
      <div>
        <h2 className="text-xl font-semibold mb-3">Leads</h2>
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
              {relatedLeads.length > 0 ? (
                relatedLeads.map((lead) => (
                  <TableRow key={lead.id}>
                    <TableCell className="font-medium">{lead.name}</TableCell>
                    <TableCell>{lead.role ?? "—"}</TableCell>
                    <TableCell>{lead.email}</TableCell>
                    <TableCell>{lead.company ?? "—"}</TableCell>
                    <TableCell>{lead.status}</TableCell>
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
    </div>
  );
}
