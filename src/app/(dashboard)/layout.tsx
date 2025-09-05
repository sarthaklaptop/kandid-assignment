"use client";

import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { useSession } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

import { useSidebarStore } from "@/lib/store/sidebar-store";

import { Skeleton } from "@/components/ui/skeleton";



export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, isPending } = useSession();
  const router = useRouter();

  const { isCollapsed, setCollapse } = useSidebarStore();


  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login"); 
    }
  }, [session, isPending, router]);

  if (isPending) {
  return (
    <div className="flex h-screen">
      <aside className="w-16 sm:w-64 bg-gray-100 dark:bg-gray-900 p-4 space-y-4">
        <Skeleton className="h-10 w-full rounded-lg" /> 
        <div className="space-y-2">
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
          <Skeleton className="h-8 w-full rounded-md" />
        </div>
      </aside>

      <main className="flex-1 p-6 space-y-4">
        <Skeleton className="h-10 w-1/3 rounded-md" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      </main>
    </div>
  );
}
  if (!session) return null; 

  return (
    <SidebarProvider
      open={!isCollapsed}                    
      onOpenChange={(open) => setCollapse(!open)}
    >
      <div className="flex h-screen">
        <AppSidebar />
        <main className="flex-1 p-6">
          <SidebarTrigger />
          {children}
        </main>
      </div>
    </SidebarProvider>
  );
}
