"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { FaPhoneAlt } from "react-icons/fa";
import { RiFlashlightFill } from "react-icons/ri";
import toast from "react-hot-toast";
import { RiProgress4Line } from "react-icons/ri";

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
  status: {
    label: string;
    color: string;
  };
};

type CampaignDetails = {
  id: number;
  name: string;
  description: string | null;
  status: string;
  createdAt: string;
  targetAudience?: string | null;
  platform?: string | null;
};

type InteractionHistory = {
  id: number;
  type: string;
  message: string | null;
  timestamp: string;
  status: string;
  platform?: string | null;
};

export function LeadProfile({ lead }: { lead: Lead }) {
  const [campaignDetails, setCampaignDetails] =
    useState<CampaignDetails | null>(null);
  const [interactions, setInteractions] = useState<InteractionHistory[]>([]);
  const [isLoadingCampaign, setIsLoadingCampaign] = useState(true);
  const [isLoadingInteractions, setIsLoadingInteractions] = useState(true);

  useEffect(() => {
    const fetchCampaignDetails = async () => {
      if (!lead.id) return;

      try {
        setIsLoadingCampaign(true);
        const response = await fetch(`/api/leads/${lead.id}/campaign`);
        if (response.ok) {
          const data = await response.json();
          setCampaignDetails(data);
        }
      } catch (error) {
        console.error("Error fetching campaign details:", error);
      } finally {
        setIsLoadingCampaign(false);
      }
    };

    const fetchInteractionHistory = async () => {
      try {
        setIsLoadingInteractions(true);
        const response = await fetch(`/api/leads/${lead.id}/interactions`);
        if (response.ok) {
          const data = await response.json();
          setInteractions(data);
        }
      } catch (error) {
        console.error("Error fetching interaction history:", error);
      } finally {
        setIsLoadingInteractions(false);
      }
    };

    fetchCampaignDetails();
    fetchInteractionHistory();
  }, [lead.id]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInDays === 0) return "Today";
    if (diffInDays === 1) return "Yesterday";
    if (diffInDays < 7) return `${diffInDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="p-4 flex flex-col h-full">
      {/* Header */}
      <DrawerHeader className="flex items-start gap-4">
        <Image
          src={lead.avatar!}
          alt={lead.name}
          width={56}
          height={56}
          className="rounded-full object-cover"
        />
        <div className="flex-1">
          <DrawerTitle className="text-xl font-bold">{lead.name}</DrawerTitle>
          <p className="text-sm text-muted-foreground">{lead.role}</p>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-xs text-muted-foreground">
              {lead.campaign}
            </span>
            <Badge
              className={`rounded-md px-2 py-0.5 text-xs font-medium ${lead.status.color}`}
            >
              {lead.status.label}
            </Badge>
          </div>
        </div>
      </DrawerHeader>

      <Separator className="my-4" />

      {/* Contact Details */}
      <div className="space-y-3 text-sm">
        <p>
          <span className="font-medium">📧 Email:</span> {lead.email}
        </p>
        <p>
          <span className="font-medium">🏢 Company:</span>{" "}
          {lead.company ?? "N/A"}
        </p>
        <p>
          <span className="font-medium">📅 Last Contact:</span>{" "}
          {lead.lastContactDate ? formatDate(lead.lastContactDate) : "Never"}
        </p>
      </div>

      <Separator className="my-4" />

      {/* Campaign Info */}
      <div className="space-y-2 text-sm">
        <p className="font-medium">📌 Campaign Info</p>
        {isLoadingCampaign ? (
          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ) : campaignDetails ? (
          <div className="space-y-2">
            <p className="text-muted-foreground">
              {campaignDetails.description || "No description available"}
            </p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {campaignDetails.platform && (
                <p>
                  <span className="font-medium">Platform:</span>{" "}
                  {campaignDetails.platform}
                </p>
              )}
              {campaignDetails.targetAudience && (
                <p>
                  <span className="font-medium">Target:</span>{" "}
                  {campaignDetails.targetAudience}
                </p>
              )}
              <p>
                <span className="font-medium">Status:</span>{" "}
                {campaignDetails.status}
              </p>
              <p>
                <span className="font-medium">Created:</span>{" "}
                {formatDate(campaignDetails.createdAt)}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-muted-foreground">
            No campaign information available
          </p>
        )}
      </div>

      <Separator className="my-4" />

      {/* Interaction History */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        <p className="font-medium">📝 Interaction History</p>
        {isLoadingInteractions ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-3">
                <Skeleton className="w-6 h-6 rounded-full" />
                <div className="flex-1 space-y-1">
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-3 w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : interactions.length > 0 ? (
          <div className="space-y-3">
            {interactions.map((interaction) => (
              <div key={interaction.id} className="flex gap-3">
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-white text-xs`}
                >
                  {interaction.type.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <p className="font-medium capitalize">
                    {interaction.type} {interaction.status.toLowerCase()}
                  </p>
                  {interaction.message && (
                    <p className="text-xs text-muted-foreground">
                      "{interaction.message}"
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <p className="text-xs text-muted-foreground">
                      {formatDate(interaction.timestamp)}
                    </p>
                    {interaction.platform && (
                      <span className="text-xs bg-gray-100 px-1 rounded">
                        {interaction.platform}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-muted-foreground text-sm">
            No interaction history available
          </p>
        )}
      </div>

      <Separator className="my-4" />

      <div className="flex gap-2 mt-auto">
        <Button
          className="flex-1 flex items-center gap-2"
          onClick={() =>
            toast("Working on this feature!")
          }
        >
          <FaPhoneAlt />
          Contact
        </Button>
        <Button
          variant="outline"
          className="flex-1 flex items-center gap-2"
          onClick={() =>
            toast(`Working on this feature!`)
          }
        >
          <RiFlashlightFill />
          Update Status
        </Button>
      </div>
    </div>
  );
}
