import { NextRequest, NextResponse } from "next/server"
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECONDS,
  createSessionCookieValue,
} from "@/lib/cms/session"
import {
  clearLoginFailures,
  getAdminSessionSecret,
  isLoginRateLimited,
  recordLoginFailure,
  verifyAdminPassword,
} from "@/lib/cms/auth"
import { loginSchema } from "@/lib/cms/validation"

function redirectToLogin(request: NextRequest, message: string) {
  const url = new URL("/admin/login", request.url)
  url.searchParams.set("error", message)
  return NextResponse.redirect(url, { status: 303 })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const parsed = loginSchema.safeParse({
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return redirectToLogin(request, "Password is required.")
  }

  if (isLoginRateLimited()) {
    return redirectToLogin(
      request,
      "Too many login attempts. Please try again in a few minutes.",
    )
  }

  const ok = await verifyAdminPassword(parsed.data.password)
  if (!ok) {
    recordLoginFailure()
    return redirectToLogin(request, "Invalid admin password.")
  }

  clearLoginFailures()

  const response = NextResponse.redirect(new URL("/admin", request.url), {
    status: 303,
  })

  response.cookies.set(
    ADMIN_COOKIE_NAME,
    createSessionCookieValue(getAdminSessionSecret()),
    {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/admin",
      maxAge: ADMIN_SESSION_SECONDS,
    },
  )

  return response
}

export function GET(request: NextRequest) {
  return NextResponse.redirect(new URL("/admin/login", request.url), {
    status: 303,
  })
}
