"use client";

import { Button } from "@/components/ui/button";
import { useState } from "react";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [isSetAccount, setIsSetAccount] = useState(false);

  const handleSeed = async () => {

    setIsSetAccount(true);

    const promise = fetch("/api/dev/seed-user", {
      method: "POST",
      credentials: "include",
    }).then((res) => {
      if (!res.ok) {
        throw new Error("Something went wrong");
      }
      return res.json();
    });

    try {
      await toast.promise(promise, {
        loading: "Seeding your account...",
        success: "Your account has been seeded with sample data!",
        error: "Failed to seed account.",
      });
    }
    catch (error) {
      console.error("Seeding failed: ",error);
    }
    finally {
      setIsSetAccount(false);
    }
  };

  return (
    <div className="p-4 flex flex-col h-full items-center justify-center">
      <h1 className="text-2xl font-semibold mb-2">Settings</h1>
      <p className="mb-2">Need some sample data to test with?</p>
      <Button
        onClick={handleSeed}
        disabled={isSetAccount}
      >
        {isSetAccount ? "Seeding..." : "Seed My Account"}
      </Button>
    </div>
  );
}
