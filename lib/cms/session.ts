import { createHmac, timingSafeEqual } from "crypto"

export const ADMIN_COOKIE_NAME = "funzip_admin"
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8

type SessionPayload = {
  sub: "admin"
  exp: number
}

export function normalizeAdminSecret(secret: string | undefined) {
  const value = secret?.trim()
  if (!value) return undefined
  return value.replace(/^['"]|['"]$/g, "").replace(/\\\$/g, "$")
}

function encode(value: string) {
  return Buffer.from(value).toString("base64url")
}

function decode(value: string) {
  return Buffer.from(value, "base64url").toString("utf8")
}

function sign(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

export function createSessionCookieValue(secret: string) {
  const payload: SessionPayload = {
    sub: "admin",
    exp: Math.floor(Date.now() / 1000) + ADMIN_SESSION_SECONDS,
  }
  const encodedPayload = encode(JSON.stringify(payload))
  return `${encodedPayload}.${sign(encodedPayload, secret)}`
}

export function verifySessionCookieValue(
  value: string | undefined,
  secret: string | undefined,
) {
  if (!value || !secret) return false

  const [encodedPayload, signature] = value.split(".")
  if (!encodedPayload || !signature) return false

  const expected = sign(encodedPayload, secret)
  const signatureBuffer = Buffer.from(signature)
  const expectedBuffer = Buffer.from(expected)

  if (signatureBuffer.length !== expectedBuffer.length) return false
  if (!timingSafeEqual(signatureBuffer, expectedBuffer)) return false

  try {
    const payload = JSON.parse(decode(encodedPayload)) as SessionPayload
    return payload.sub === "admin" && payload.exp > Math.floor(Date.now() / 1000)
  } catch {
    return false
  }
}
