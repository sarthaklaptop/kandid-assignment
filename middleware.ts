import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ Get session safely
  let session: any = null;
  try {
    session = await auth.api.getSession({ headers: req.headers });
  } catch (e) {
    console.error("Error getting session in middleware:", e);
  }

  // 🚨 If logged in and trying to access /login → redirect to /dashboard
  if (pathname === "/login" && session) {
    return NextResponse.redirect(new URL("/dashboard", req.url));
  }

  // 🚨 If NOT logged in and trying to access protected routes → redirect to /login
  if ((pathname === "/" || pathname.startsWith("/dashboard")) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

// ✅ Ensure matcher includes both /login and /login/
export const config = {
  matcher: ["/", "/dashboard/:path*", "/login", "/login/"],
};
