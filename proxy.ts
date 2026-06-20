import { NextRequest, NextResponse } from "next/server"
import {
  ADMIN_COOKIE_NAME,
  verifySessionCookieValue,
} from "@/lib/cms/session"

const ADMIN_PASSWORD = "imran"

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isLogin = pathname === "/admin/login"
  const isLoginSubmit = pathname === "/admin/login/submit"
  const hasSession = verifySessionCookieValue(
    request.cookies.get(ADMIN_COOKIE_NAME)?.value,
    ADMIN_PASSWORD,
  )

  if (pathname.startsWith("/admin") && !isLogin && !isLoginSubmit && !hasSession) {
    return NextResponse.redirect(new URL("/admin/login", request.url))
  }

  if ((isLogin || isLoginSubmit) && hasSession) {
    return NextResponse.redirect(new URL("/admin", request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*"],
}
