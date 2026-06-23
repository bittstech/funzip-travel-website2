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
  return withDatabaseFallback(async (db) => {
    const records = await db.heroSlide.findMany({
      where: { isActive: true },
      include: {
        image: true,
        mobileImage: true,
      },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })

    if (records.length === 0) return fallbackHeroSlides

    return records.map((record) => ({
      id: record.id,
      title: record.title,
      subtitle: record.subtitle,
      image: imageRef(
        renderableAsset(record.image),
        record.title,
        fallbackHeroSlides[0]?.image.url || "/images/hero-kashmir.png",
      ),
      mobileImage: record.mobileImage
        ? imageRef(renderableAsset(record.mobileImage), `${record.title} mobile image`)
        : null,
      ctaText: record.ctaText,
      ctaUrl: record.ctaUrl,
    }))
  }, fallbackHeroSlides)
}

export async function getFeaturedPackages(limit = 6) {
  return withDatabaseFallback(async (db) => {
    const records = await db.package.findMany({
      where: { isPublished: true },
      include: mediaInclude,
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
      take: limit,
    })

    if (records.length === 0) return fallbackPackages.slice(0, limit)

    return records.map((record) => toPackage(record))
  }, fallbackPackages.slice(0, limit))
}

export async function getPublishedPackages() {
  return withDatabaseFallback(async (db) => {
    const records = await db.package.findMany({
      where: { isPublished: true },
      include: mediaInclude,
      orderBy: [
        { isFeatured: "desc" },
        { publishedAt: "desc" },
        { createdAt: "desc" },
      ],
    })

    if (records.length === 0) return fallbackPackages

    return records.map((record) => toPackage(record))
  }, fallbackPackages)
}

export async function getPackageBySlug(slug: string) {
  const fallbackPackage =
    fallbackPackages.find((pkg) => pkg.slug === slug) || null

  return withDatabaseFallback(async (db) => {
    const record = await db.package.findUnique({
      where: { slug },
      include: mediaInclude,
    })

    if (!record) return fallbackPackage
    if (!record.isPublished) return null

    const galleryImageIds = toStringArray(record.galleryImageIds)
    const galleryImages = galleryImageIds.length
      ? await db.mediaAsset.findMany({
          where: {
            id: { in: galleryImageIds },
            isActive: true,
          },
        })
      : []
    const galleryById = new Map(galleryImages.map((image) => [image.id, image]))

    return toPackage(
      record,
      galleryImageIds
        .map((imageId) => galleryById.get(imageId))
        .filter((image): image is (typeof galleryImages)[number] => Boolean(image)),
    )
  }, fallbackPackage)
}

export async function getLatestBlogs(limit = 6) {
  return withDatabaseFallback(async (db) => {
    const records = await db.blog.findMany({
      where: { isPublished: true },
      include: mediaInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
      take: limit,
    })

    if (records.length === 0) return fallbackBlogs.slice(0, limit)

    return records.map((record) => toBlog(record))
  }, fallbackBlogs.slice(0, limit))
}

export async function getPublishedBlogs() {
  return withDatabaseFallback(async (db) => {
    const records = await db.blog.findMany({
      where: { isPublished: true },
      include: mediaInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
    })

    if (records.length === 0) return fallbackBlogs

    return records.map((record) => toBlog(record))
  }, fallbackBlogs)
}

export async function getBlogBySlug(slug: string) {
  const fallbackBlog = fallbackBlogs.find((blog) => blog.slug === slug) || null

  return withDatabaseFallback(async (db) => {
    const record = await db.blog.findUnique({
      where: { slug },
      include: mediaInclude,
    })

    if (!record) return fallbackBlog
    if (!record.isPublished) return null

    return toBlog(record)
  }, fallbackBlog)
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
