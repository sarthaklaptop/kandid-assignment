"use client";

import { Skeleton } from "@/components/ui/skeleton";

export default function CampaignLoading() {
  return (
    <div className="p-6 space-y-6">
      <Skeleton className="h-6 w-32" /> {/* breadcrumb */}
      <Skeleton className="h-8 w-48" /> {/* campaign title */}
      <Skeleton className="h-6 w-72" /> {/* description */}
      <div className="space-y-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  );
}