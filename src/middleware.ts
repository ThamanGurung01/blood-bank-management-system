import { getToken } from "next-auth/jwt"
import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const pathname = req.nextUrl.pathname

  const isAuthPage = pathname === "/login" || pathname === "/signup"
  const isProtectedPage = pathname === "/profile"

  if (!token && (pathname.startsWith("/dashboard") || pathname.startsWith("/admin") || isProtectedPage)) {
    return NextResponse.redirect(new URL("/?from=protected", req.url))
  }

  if (token && isAuthPage) {
    const role = token.role
    let redirectPath = "/"
    if (role === "donor") redirectPath = "/dashboard/find-donors"
    else if (role === "blood_bank") redirectPath = "/dashboard"
    else if (role === "admin") redirectPath = "/admin/dashboard"

    return NextResponse.redirect(new URL(redirectPath, req.url))
  }

  if (token) {
    const role = token.role

    const donorPaths = ["/dashboard/find-donors", "/dashboard/blood-request", "/dashboard/donation-schedule", "/dashboard/donation-history", "/dashboard/leaderboard", "/dashboard/event"]
    const bloodBankPaths = ["/dashboard/blood_bank-overview","/dashboard/blood-stock", "/dashboard/blood-donation", "/dashboard/blood_bank-request", "/dashboard/blood_bank-donation_schedule", "/dashboard/blood_bank-event"]
    const adminPaths = ["/admin/dashboard", "/admin/dashboard/list-blood_banks", "/admin/dashboard/list-donors", "/admin/dashboard/verify-blood_banks"]

    function isAllowed(paths: string[]) {
      return paths.some(path => pathname === path || pathname.startsWith(path + "/"))
    }

    if (isAllowed(donorPaths) && role !== "donor") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (isAllowed(bloodBankPaths) && role !== "blood_bank") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }

    if (isAllowed(adminPaths) && role !== "admin") {
      return NextResponse.redirect(new URL("/unauthorized", req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/dashboard/:path*",
    "/login",
    "/signup",
    "/profile"
  ]
}
