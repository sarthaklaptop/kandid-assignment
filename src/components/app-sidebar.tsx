"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
} from "@/components/ui/sidebar";
import {
  LayoutDashboard,
  Users,
  Megaphone,
  Settings,
  LogOut,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import toast from "react-hot-toast";
import { useState } from "react";
import Image from "next/image";
import { useSidebarStore } from "@/lib/store/sidebar-store";

const navItems = [
  { title: "Dashboard", url: "/dashboard", icon: LayoutDashboard },
  { title: "Leads", url: "/leads", icon: Users },
  { title: "Campaigns", url: "/campaigns", icon: Megaphone },
  { title: "Settings", url: "/settings", icon: Settings },
];

// export function AppSidebar() {
//   const pathname = usePathname();
//   const router = useRouter();
//   const [isLoggingOut, setIsLoggingOut] = useState(false);

//   const { activeRoute, setActiveRoute, isCollapsed } = useSidebarStore();

//   const handleLogout = async () => {
//     if (isLoggingOut) return;
//     setIsLoggingOut(true);

//     await toast.promise(signOut(), {
//       loading: "Logging out...",
//       success: () => {
//         router.push("/login");
//         return "Logged out successfully!";
//       },
//       error: (err) => err?.message || "Logout failed",
//     });

//     setIsLoggingOut(false);
//   };

//   return (
//     <Sidebar collapsible="icon" defaultCollapsed={isCollapsed}>
//       <SidebarContent>
//         <SidebarGroup>
//           <SidebarHeader className="py-4">
//             <div className="relative w-full flex justify-center px-4">
//               {!isCollapsed ? (
//                 <div className="relative w-full max-w-[160px] h-10">
//                   <Image
//                     src="/linkbird-light-logo.svg"
//                     alt="Logo"
//                     fill
//                     className="object-contain"
//                   />
//                 </div>
//               ) : (
//                 <Image
//                   src="/linkbirdai_logo.jpeg"
//                   alt="Logo Collapsed"
//                   width={32}
//                   height={32}
//                   className="h-8 w-8 object-contain"
//                 />
//               )}
//             </div>
//           </SidebarHeader>

//           <hr className="my-4 border-t border-gray-300" />

//           <SidebarGroupContent>
//             <SidebarMenu>
//               {navItems.map((item) => (
//                 <SidebarMenuItem key={item.title}>
//                   <SidebarMenuButton
//                     asChild
//                     isActive={activeRoute === item.url}
//                     onClick={() => setActiveRoute(item.url)}
//                   >
//                     <Link href={item.url}>
//                       <item.icon className="h-4 w-4" />
//                       <span>{item.title}</span>
//                     </Link>
//                   </SidebarMenuButton>
//                 </SidebarMenuItem>
//               ))}
//             </SidebarMenu>
//           </SidebarGroupContent>
//         </SidebarGroup>
//       </SidebarContent>

//       <SidebarFooter>
//         <SidebarMenu>
//           <SidebarMenuItem>
//             <SidebarMenuButton asChild>
//               <button
//                 onClick={handleLogout}
//                 disabled={isLoggingOut}
//                 className={`flex items-center gap-2 ${
//                   isLoggingOut
//                     ? "opacity-50 cursor-not-allowed"
//                     : "hover:text-red-600 text-red-500"
//                 }`}
//               >
//                 <LogOut className="h-4 w-4" />
//                 <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
//               </button>
//             </SidebarMenuButton>
//           </SidebarMenuItem>
//         </SidebarMenu>
//       </SidebarFooter>
//     </Sidebar>
//   );
// }


export function AppSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const { activeRoute, setActiveRoute, isCollapsed } = useSidebarStore();

  const handleLogout = async () => {
    if (isLoggingOut) return;
    setIsLoggingOut(true);

    await toast.promise(signOut(), {
      loading: "Logging out...",
      success: () => {
        router.push("/login");
        return "Logged out successfully!";
      },
      error: (err) => err?.message || "Logout failed",
    });

    setIsLoggingOut(false);
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <SidebarHeader className="py-4">
            <div className="relative w-full flex justify-center px-4">
              {!isCollapsed ? (
                <div className="relative w-full max-w-[160px] h-10">
                  <Image
                    src="/linkbird-light-logo.svg"
                    alt="Logo"
                    fill
                    className="object-contain"
                  />
                </div>
              ) : (
                <Image
                  src="/linkbirdai_logo.jpeg"
                  alt="Logo Collapsed"
                  width={32}
                  height={32}
                  className="h-8 w-8 object-contain"
                />
              )}
            </div>
          </SidebarHeader>

          <hr className="my-4 border-t border-gray-300" />

          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={activeRoute === item.url}
                    onClick={() => setActiveRoute(item.url)}
                  >
                    <Link href={item.url}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className={`flex items-center gap-2 ${
                  isLoggingOut
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:text-red-600 text-red-500"
                }`}
              >
                <LogOut className="h-4 w-4" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}