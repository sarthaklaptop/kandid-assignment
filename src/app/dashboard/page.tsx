"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";

export default function Dashboard() {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login"); // 🔄 redirect to login if no session
    }
  }, [session, isPending, router]);

  if (isPending) return <p>Loading...</p>;

  // While redirecting, show nothing or loading
  if (!session) return null;

  return (
    <div className="p-6">
      <h1 className="text-xl">Welcome, {session.user.email}</h1>
      <button
        onClick={() => signOut()}
        className="p-2 bg-gray-700 text-white"
      >
        Logout
      </button>
    </div>
  );
}
