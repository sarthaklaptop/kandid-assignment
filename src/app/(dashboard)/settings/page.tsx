// Example: Add this to a settings page, e.g., src/app/(dashboard)/settings/page.tsx

"use client";

import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

export default function SettingsPage() {

  const handleSeed = async () => {
    const promise = fetch("/api/dev/seed-user", { 
      method: "POST",
      credentials: "include",
    }).then(res => {
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      return res.json();
    });

    toast.promise(promise, {
      loading: 'Seeding your account...',
      success: 'Your account has been seeded with sample data!',
      error: 'Failed to seed account.',
    });
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-semibold mb-4">Settings</h1>
      <p className="mb-2">Need some sample data to test with?</p>
      <Button onClick={handleSeed}>Seed My Account</Button>
    </div>
  );
}