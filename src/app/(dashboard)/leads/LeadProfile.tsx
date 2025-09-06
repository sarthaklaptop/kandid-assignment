import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { DrawerHeader, DrawerTitle } from "@/components/ui/drawer";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

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

export function LeadProfile({ lead }: { lead: Lead }) {
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
            <span className="text-xs text-muted-foreground">{lead.campaign}</span>
            <Badge className={`rounded-md px-2 py-0.5 text-xs font-medium ${lead.status.color}`}>
              {lead.status.label}
            </Badge>
          </div>
        </div>
      </DrawerHeader>

      <Separator className="my-4" />

      {/* Contact Details */}
      <div className="space-y-3 text-sm">
        <p><span className="font-medium">📧 Email:</span> {lead.email}</p>
        <p><span className="font-medium">🏢 Company:</span> {lead.company ?? "N/A"}</p>
        <p><span className="font-medium">📅 Last Contact:</span> {lead.lastContactDate ?? "Never"}</p>
      </div>

      <Separator className="my-4" />

      {/* Campaign Info */}
      <div className="space-y-2 text-sm">
        <p className="font-medium">📌 Campaign Info</p>
        <p className="text-muted-foreground">{lead.campaignDescription ?? "No description"}</p>
      </div>

      <Separator className="my-4" />

      {/* Interaction History (fake for now, replace with real logs if stored) */}
      <div className="space-y-4 flex-1 overflow-y-auto">
        <p className="font-medium">📝 Interaction History</p>
        <div className="flex gap-3">
          <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs">✓</div>
          <div>
            <p className="font-medium">Invitation Request Sent</p>
            <p className="text-xs text-muted-foreground">“Hi {lead.name}, we’d love to connect...”</p>
          </div>
        </div>
        <div className="flex gap-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-white text-xs">💬</div>
          <div>
            <p className="font-medium">Lead Responded</p>
            <p className="text-xs text-muted-foreground">Responded on LinkedIn - 2 days ago</p>
          </div>
        </div>
      </div>

      <Separator className="my-4" />

      {/* Actions */}
      <div className="flex gap-2 mt-auto">
        <Button className="flex-1">📞 Contact</Button>
        <Button variant="outline" className="flex-1">⚡ Update Status</Button>
      </div>
    </div>
  );
}
