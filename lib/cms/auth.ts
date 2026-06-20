import "server-only"

import bcrypt from "bcryptjs"
import { createHash, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import {
  ADMIN_COOKIE_NAME,
  ADMIN_SESSION_SECONDS,
  createSessionCookieValue,
  verifySessionCookieValue,
} from "./session"

const loginAttempts = new Map<string, { count: number; resetAt: number }>()

function adminSecret() {
  return process.env.ADMIN_PASSWORD_HASH
}

function hashSha256(value: string) {
  return createHash("sha256").update(value).digest("hex")
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
  const hash = adminSecret()
  if (!hash) return false

  if (hash.startsWith("$2a$") || hash.startsWith("$2b$") || hash.startsWith("$2y$")) {
    return bcrypt.compare(password, hash)
  }

  if (hash.startsWith("sha256:")) {
    const expected = Buffer.from(hash.replace(/^sha256:/, ""), "hex")
    const actual = Buffer.from(hashSha256(password), "hex")
    return expected.length === actual.length && timingSafeEqual(expected, actual)
  }

  return false
}

export async function createAdminSession() {
  const secret = adminSecret()
  if (!secret) throw new Error("ADMIN_PASSWORD_HASH is not configured.")

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
    adminSecret(),
  )
}

export async function requireAdmin() {
  if (!(await verifyAdminSession())) {
    redirect("/admin/login")
  }
}
