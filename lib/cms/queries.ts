import "server-only"

import { existsSync } from "fs"
import path from "path"
import {
  fallbackBlogs,
  fallbackGalleryImages,
  fallbackHeroSlides,
  fallbackPackages,
  fallbackSettings,
} from "./fallback-data"
import { getPrisma, withDatabaseFallback } from "./prisma"
import type {
  PublicBlog,
  PublicGalleryImage,
  PublicHeroSlide,
  PublicPackage,
  SiteSettingsPublic,
} from "./types"
import {
  formatPrice,
  fallbackContentSections,
  imageRef,
  parseContentSections,
  parseFaqs,
  parseItinerary,
  toStringArray,
} from "./utils"

const mediaInclude = {
  coverImage: true,
  ogImage: true,
} as const

function localUploadExists(url: string | null | undefined) {
  if (!url || !url.startsWith("/uploads/")) return true

  const uploadRoot = path.resolve(process.cwd(), "public", "uploads")
  const filePath = path.resolve(process.cwd(), "public", url.replace(/^\//, ""))

  return filePath.startsWith(uploadRoot) && existsSync(filePath)
}

function renderableAsset<T extends { storageUrl?: string | null }>(
  asset: T | null | undefined,
) {
  return localUploadExists(asset?.storageUrl) ? asset : null
}

function toPackage(record: any, galleryImages: any[] = []): PublicPackage {
  const cover = imageRef(
    renderableAsset(record.coverImage),
    `${record.title} Kashmir package`,
    "/images/dal-lake.png",
  )

  const contentSections = parseContentSections(record.contentSections)
  const legacySections = fallbackContentSections({
    services: record.services,
    highlights: record.highlights,
    inclusions: record.inclusions,
    exclusions: record.exclusions,
    mustKnow: record.mustKnow,
    itinerary: record.itineraryJson,
  })

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    shortDescription: record.shortDescription,
    fullDescription: record.fullDescription,
    itineraryUrl: record.itineraryUrl,
    location: record.location,
    duration: record.duration,
    priceStartingFrom: record.priceStartingFrom,
    priceLabel: formatPrice(record.priceStartingFrom),
    coverImage: cover,
    galleryImages: galleryImages
      .filter((asset) => localUploadExists(asset.storageUrl))
      .map((asset) => imageRef(asset, asset.altText || record.title)),
    services: toStringArray(record.services),
    highlights: toStringArray(record.highlights),
    contentSections:
      contentSections.length > 0 ? contentSections : legacySections,
    mustKnow: toStringArray(record.mustKnow),
    inclusions: toStringArray(record.inclusions),
    exclusions: toStringArray(record.exclusions),
    itinerary: parseItinerary(record.itineraryJson),
    faqs: parseFaqs(record.faqsJson),
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
    ogImage: renderableAsset(record.ogImage)
      ? imageRef(renderableAsset(record.ogImage), `${record.title} social preview`)
      : cover,
    canonicalUrl: record.canonicalUrl,
    keywords: toStringArray(record.keywords),
    isFeatured: record.isFeatured,
    publishedAt: record.publishedAt,
    updatedAt: record.updatedAt,
  }
}

function toBlog(record: any): PublicBlog {
  const cover = imageRef(
    renderableAsset(record.coverImage),
    record.title,
    "/images/gardens.png",
  )

  return {
    id: record.id,
    title: record.title,
    slug: record.slug,
    excerpt: record.excerpt,
    content: record.content,
    coverImage: cover,
    authorName: record.authorName,
    category: record.category,
    tags: toStringArray(record.tags),
    faqs: parseFaqs(record.faqsJson),
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
    ogImage: renderableAsset(record.ogImage)
      ? imageRef(renderableAsset(record.ogImage), `${record.title} social preview`)
      : cover,
    canonicalUrl: record.canonicalUrl,
    isPublished: record.isPublished,
    publishedAt: record.publishedAt,
    updatedAt: record.updatedAt,
  }
}

export async function getSiteSettings(): Promise<SiteSettingsPublic> {
  return withDatabaseFallback(async (db) => {
    const settings = await db.siteSettings.findFirst({
      orderBy: { updatedAt: "desc" },
    })

    return settings || fallbackSettings
  }, fallbackSettings)
}

export async function getHeroSlides(): Promise<PublicHeroSlide[]> {
  return fallbackHeroSlides
}

export async function getFeaturedPackages(limit = 6) {
  return fallbackPackages.slice(0, limit)
}

export async function getPublishedPackages() {
  return fallbackPackages
}

export async function getPackageBySlug(slug: string) {
  return fallbackPackages.find((pkg) => pkg.slug === slug) || null
}

export async function getLatestBlogs(limit = 6) {
  return fallbackBlogs.slice(0, limit)
}

export async function getPublishedBlogs() {
  return fallbackBlogs
}

export async function getBlogBySlug(slug: string) {
  return fallbackBlogs.find((blog) => blog.slug === slug) || null
}

export async function getGalleryImages(limit?: number) {
  return withDatabaseFallback(async (db) => {
    const records = await db.galleryImage.findMany({
      where: { isActive: true },
      include: { image: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
      take: limit,
    })

    if (records.length === 0) {
      return limit ? fallbackGalleryImages.slice(0, limit) : fallbackGalleryImages
    }

    return records.map(
      (record): PublicGalleryImage => ({
        id: record.id,
        title: record.title || record.image.caption || "Kashmir gallery",
        location: record.location,
        altText: record.altText || record.image.altText || "Kashmir travel image",
        image: imageRef(
          record.image,
          record.altText || record.image.altText || "Kashmir travel image",
        ),
      }),
    )
  }, limit ? fallbackGalleryImages.slice(0, limit) : fallbackGalleryImages)
}

export async function getAdminCounts() {
  const db = getPrisma()
  const [packages, blogs, leads, media] = await Promise.all([
    db.package.count(),
    db.blog.count(),
    db.lead.count(),
    db.mediaAsset.count(),
  ])
  return { packages, blogs, leads, media }
}

export async function getSelectableMedia() {
  const db = getPrisma()
  return db.mediaAsset.findMany({
    where: { isActive: true },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      storageUrl: true,
      altText: true,
      originalFileName: true,
      type: true,
    },
  })
}
