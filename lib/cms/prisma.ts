import "server-only"

import { PrismaClient } from "@prisma/client"

const globalForPrisma = globalThis as unknown as {
  prisma?: PrismaClient
}

export function assertDatabaseUrl() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not configured.")
  }
}

export function getPrisma() {
  assertDatabaseUrl()

  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient()
  }

  return globalForPrisma.prisma
}

export async function withDatabaseFallback<T>(
  run: (db: PrismaClient) => Promise<T>,
  fallback: T,
) {
  if (!process.env.DATABASE_URL) {
    return fallback
  }

  try {
    const db = getPrisma()
    return await run(db)
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[cms] Falling back to static content:", error)
    }
    return fallback
  }
}
