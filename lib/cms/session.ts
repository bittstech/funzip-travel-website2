export const ADMIN_COOKIE_NAME = "funzip_admin"
export const ADMIN_SESSION_SECONDS = 60 * 60 * 8

export function normalizeAdminSecret(secret: string | undefined) {
  const value = secret?.trim()
  if (!value) return undefined
  return value.replace(/^['"]|['"]$/g, "").replace(/\\\$/g, "$")
}

export function createSessionCookieValue(secret: string) {
  return secret
}

export function verifySessionCookieValue(
  value: string | undefined,
  secret: string | undefined,
) {
  return Boolean(value && secret && value === secret)
}
