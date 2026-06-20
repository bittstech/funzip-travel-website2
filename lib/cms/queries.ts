import "server-only"

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
  imageRef,
  parseFaqs,
  parseItinerary,
  toStringArray,
} from "./utils"

const mediaInclude = {
  coverImage: true,
  ogImage: true,
} as const

function toPackage(record: any, galleryImages: any[] = []): PublicPackage {
  const cover = imageRef(
    record.coverImage,
    `${record.title} Kashmir package`,
    "/images/dal-lake.png",
  )

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
    galleryImages: galleryImages.map((asset) =>
      imageRef(asset, asset.altText || record.title),
    ),
    services: toStringArray(record.services),
    highlights: toStringArray(record.highlights),
    mustKnow: toStringArray(record.mustKnow),
    inclusions: toStringArray(record.inclusions),
    exclusions: toStringArray(record.exclusions),
    itinerary: parseItinerary(record.itineraryJson),
    faqs: parseFaqs(record.faqsJson),
    metaTitle: record.metaTitle,
    metaDescription: record.metaDescription,
    ogImage: record.ogImage
      ? imageRef(record.ogImage, `${record.title} social preview`)
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
    record.coverImage,
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
    ogImage: record.ogImage
      ? imageRef(record.ogImage, `${record.title} social preview`)
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
    const slides = await db.heroSlide.findMany({
      where: { isActive: true },
      include: { image: true, mobileImage: true },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "desc" }],
    })

    if (slides.length === 0) return fallbackHeroSlides

    return slides.map((slide) => ({
      id: slide.id,
      title: slide.title,
      subtitle: slide.subtitle,
      image: imageRef(slide.image, slide.title, "/images/hero-kashmir.png"),
      mobileImage: slide.mobileImage
        ? imageRef(slide.mobileImage, slide.title, "/images/hero-kashmir.png")
        : null,
      ctaText: slide.ctaText,
      ctaUrl: slide.ctaUrl,
    }))
  }, fallbackHeroSlides)
}

export async function getFeaturedPackages(limit = 6) {
  return withDatabaseFallback(async (db) => {
    const records = await db.package.findMany({
      where: { isPublished: true, isFeatured: true },
      include: mediaInclude,
      orderBy: [{ publishedAt: "desc" }, { createdAt: "desc" }],
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
      orderBy: [{ isFeatured: "desc" }, { publishedAt: "desc" }],
    })

    if (records.length === 0) return fallbackPackages
    return records.map((record) => toPackage(record))
  }, fallbackPackages)
}

export async function getPackageBySlug(slug: string) {
  const fallback = fallbackPackages.find((pkg) => pkg.slug === slug) || null

  return withDatabaseFallback(async (db) => {
    const record = await db.package.findFirst({
      where: { slug, isPublished: true },
      include: mediaInclude,
    })

    if (!record) return fallback

    const galleryIds = toStringArray(record.galleryImageIds)
    const galleryImages =
      galleryIds.length > 0
        ? await db.mediaAsset.findMany({
            where: { id: { in: galleryIds }, isActive: true },
          })
        : []

    return toPackage(record, galleryImages)
  }, fallback)
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
    return records.map(toBlog)
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
    return records.map(toBlog)
  }, fallbackBlogs)
}

export async function getBlogBySlug(slug: string) {
  const fallback = fallbackBlogs.find((blog) => blog.slug === slug) || null

  return withDatabaseFallback(async (db) => {
    const record = await db.blog.findFirst({
      where: { slug, isPublished: true },
      include: mediaInclude,
    })

    return record ? toBlog(record) : fallback
  }, fallback)
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
