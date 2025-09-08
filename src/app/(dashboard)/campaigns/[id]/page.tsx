// src/app/(dashboard)/campaigns/[id]/page.tsx

import { db } from "@/db";
import { campaigns, leads } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
// import ClientCampaignDetail from "./ClientCampaignDetail";

// ✅ shadcn ui
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ClientCampaignDetail from "./ClientCampaignDetail";

interface CampaignPageProps {
  params: { id: string };
}

// ✅ Server Component
export default async function CampaignDetailPage({ params }: CampaignPageProps) {
  const campaignId = Number(params.id);

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
      {/* ✅ Breadcrumb (still server-rendered) */}
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

      {/* ✅ Client component handles filtering/search */}
      <ClientCampaignDetail campaign={campaign} relatedLeads={relatedLeads} />
    </div>
  );
}
