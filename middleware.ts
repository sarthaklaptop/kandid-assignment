
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth"; // your betterAuth server instance

const protectedRoutes = ["/dashboard", "/"];

export async function middleware(req: NextRequest) {
  const session = await auth.api.getSession({ headers: req.headers });

  const { pathname } = req.nextUrl;

  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!session) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  // If logged in and visiting /login → redirect to dashboard
  if (pathname.startsWith("/login") && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  return NextResponse.next();
}

// Run middleware only on selected paths
export const config = {
  matcher: ["/", "/dashboard/:path*", "/login"],
};
