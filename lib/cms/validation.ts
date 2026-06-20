import { z } from "zod"

const optionalUrl = z.preprocess(
  (value) => (typeof value === "string" && value.trim() === "" ? null : value),
  z.string().trim().url().optional().nullable(),
)

export const leadSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(120),
  phone: z.string().trim().min(6, "Please enter a valid phone number.").max(40),
  travelLocation: z.string().trim().max(160).optional().nullable(),
  numberOfPeople: z.coerce.number().int().min(1).max(500).optional().nullable(),
  sourcePage: z.string().trim().min(1).max(240),
  sourceType: z.string().trim().min(1).max(80),
  message: z.string().trim().max(2000).optional().nullable(),
})

export const loginSchema = z.object({
  password: z.string().min(1, "Password is required."),
})

export const settingsSchema = z.object({
  siteName: z.string().trim().min(2).max(160),
  siteUrl: z.string().trim().url(),
  logoUrl: z.string().trim().optional().nullable(),
  phonePrimary: z.string().trim().optional().nullable(),
  phoneSecondary: z.string().trim().optional().nullable(),
  whatsappNumber: z.string().trim().optional().nullable(),
  email: z.string().trim().email().optional().nullable().or(z.literal("")),
  address: z.string().trim().optional().nullable(),
  googleReviewUrl: optionalUrl,
  tripAdvisorUrl: optionalUrl,
  defaultMetaTitle: z.string().trim().max(80).optional().nullable(),
  defaultMetaDescription: z.string().trim().max(180).optional().nullable(),
  defaultOgImage: z.string().trim().optional().nullable(),
})

export const packageSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().min(3).max(100),
  shortDescription: z.string().trim().min(10).max(500),
  fullDescription: z.string().trim().optional().nullable(),
  itineraryUrl: optionalUrl,
  location: z.string().trim().optional().nullable(),
  duration: z.string().trim().optional().nullable(),
  priceStartingFrom: z.number().int().positive().optional().nullable(),
  metaTitle: z.string().trim().max(80).optional().nullable(),
  metaDescription: z.string().trim().max(180).optional().nullable(),
  canonicalUrl: optionalUrl,
})

export const blogSchema = z.object({
  title: z.string().trim().min(3).max(160),
  slug: z.string().trim().min(3).max(100),
  excerpt: z.string().trim().min(10).max(500),
  content: z.string().trim().optional().nullable(),
  authorName: z.string().trim().optional().nullable(),
  category: z.string().trim().optional().nullable(),
  metaTitle: z.string().trim().max(80).optional().nullable(),
  metaDescription: z.string().trim().max(180).optional().nullable(),
  canonicalUrl: optionalUrl,
})
