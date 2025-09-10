"use client";

import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import ClientCampaignDetail from "./ClientCampaignDetail";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { use } from "react"; 

interface CampaignPageProps {
  params: Promise<{ id: string }>; 
}

export default function CampaignDetailPage({ params }: CampaignPageProps) {
  const { id } = use(params);
  const [campaignData, setCampaignData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCampaign = async () => {
      try {
        const res = await fetch(`/api/campaigns/${id}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const data = await res.json();
          setCampaignData(data);
        }
      } catch (err) {
        console.error("Failed to fetch campaign:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCampaign();
  }, [id]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="space-y-4">
          <Skeleton className="h-4 w-40" />
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  if (!campaignData) {
    return <div className="p-6">Campaign not found</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/campaigns">Campaigns</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{campaignData.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <ClientCampaignDetail
        campaign={campaignData}
        relatedLeads={campaignData.leads || []}
      />
    </div>
  );
}
