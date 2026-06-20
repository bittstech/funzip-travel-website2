import { NextRequest, NextResponse } from "next/server"
import {
  ADMIN_COOKIE_NAME,
  normalizeAdminSecret,
  verifySessionCookieValue,
} from "@/lib/cms/session"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === "/admin/login"
  const hasSession = verifySessionCookieValue(
    request.cookies.get(ADMIN_COOKIE_NAME)?.value,
    normalizeAdminSecret(process.env.ADMIN_PASSWORD) || "imran",
  )

  if (pathname.startsWith("/admin") && !isLogin && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if (isLogin && hasSession) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
