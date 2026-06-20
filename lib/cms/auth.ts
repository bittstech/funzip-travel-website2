import "server-only"

import { timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECONDS,
  createSessionCookieValue,
  normalizeAdminSecret,
  verifySessionCookieValue,
} from "./session"

const loginAttempts = new Map<string, { count: number; resetAt: number }>()
const DEFAULT_ADMIN_PASSWORD = "imran"

function adminPassword() {
  return normalizeAdminSecret(process.env.ADMIN_PASSWORD) || DEFAULT_ADMIN_PASSWORD
}

export function isLoginRateLimited(key = "global") {
  const current = loginAttempts.get(key)
  if (!current) return false
  if (current.resetAt < Date.now()) {
    loginAttempts.delete(key)
    return false
  }
  return current.count >= 8
}

export function recordLoginFailure(key = "global") {
  const current = loginAttempts.get(key)
  const resetAt = Date.now() + 10 * 60 * 1000
  loginAttempts.set(key, {
    count: current && current.resetAt > Date.now() ? current.count + 1 : 1,
    resetAt,
  })
}

export function clearLoginFailures(key = "global") {
  loginAttempts.delete(key)
}

export async function verifyAdminPassword(password: string) {
  const expected = Buffer.from(adminPassword())
  const actual = Buffer.from(password)

  return expected.length === actual.length && timingSafeEqual(expected, actual)
}

export async function createAdminSession() {
  const secret = adminPassword()

  const store = await cookies()
  store.set(ADMIN_COOKIE_NAME, createSessionCookieValue(secret), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/admin",
    maxAge: ADMIN_SESSION_SECONDS,
  })
}

export async function destroyAdminSession() {
  const store = await cookies()
  store.delete(ADMIN_COOKIE_NAME)
}

export async function verifyAdminSession() {
  const store = await cookies()
  return verifySessionCookieValue(
    store.get(ADMIN_COOKIE_NAME)?.value,
    adminPassword(),
  )
}

export async function requireAdmin() {
  if (!(await verifyAdminSession())) {
    redirect("/admin/login")
  }
}
