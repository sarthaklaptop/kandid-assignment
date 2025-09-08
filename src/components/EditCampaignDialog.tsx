"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import toast from "react-hot-toast";

type Campaign = {
  id: number;
  name: string;
  status: string;
  createdAt: string;
  totalLeads: number;
  successfulLeads: number;
};

export function EditCampaignDialog({
  campaign,
  onUpdated,
}: {
  campaign: Campaign;
  onUpdated: (updated: Campaign) => void;
}) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(campaign.name);
  const [status, setStatus] = useState(campaign.status);
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    try {
      setSaving(true);
      const toastId = toast.loading("Updating campaign...");

      const res = await fetch(`/api/campaigns/${campaign.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, status }),
      });

      if (!res.ok) throw new Error("Failed to update");

      const updated = await res.json();
      onUpdated(updated);

      toast.success("Campaign updated!", { id: toastId });
      setOpen(false);
    } catch (err) {
      console.error(err);
      toast.error("Failed to update campaign");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Campaign</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm font-medium">Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Draft">Draft</SelectItem>
                <SelectItem value="Paused">Paused</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
