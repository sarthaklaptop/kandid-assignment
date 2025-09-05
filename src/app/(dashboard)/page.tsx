"use client";

import { useSession, signOut } from "@/lib/auth-client";

export default function DashboardPage() {
  const { data: session } = useSession();

  return (
    <div className="p-6">
      <h1 className="text-xl">Welcome, {session?.user.email}</h1>
      <button
        onClick={() => signOut()}
        className="p-2 bg-gray-700 text-white"
      >
        Logout
      </button>
    </div>
  );
}
