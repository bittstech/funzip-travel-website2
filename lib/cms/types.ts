export type ImageRef = {
  id?: string
  url: string
  alt: string
  width: number
  height: number
}

export type FaqItem = {
  question: string
  answer: string
}

export type ItineraryDay = {
  day: number
  title: string
  description?: string
}

export type SiteSettingsPublic = {
  siteName: string
  siteUrl: string
  logoUrl?: string | null
  phonePrimary?: string | null
  phoneSecondary?: string | null
  whatsappNumber?: string | null
  email?: string | null
  address?: string | null
  googleReviewUrl?: string | null
  tripAdvisorUrl?: string | null
  defaultMetaTitle?: string | null
  defaultMetaDescription?: string | null
  defaultOgImage?: string | null
}

export type PublicHeroSlide = {
  id: string
  title: string
  subtitle?: string | null
  image: ImageRef
  mobileImage?: ImageRef | null
  ctaText?: string | null
  ctaUrl?: string | null
}

export type PublicPackage = {
  id: string
  title: string
  slug: string
  shortDescription: string
  fullDescription?: string | null
  itineraryUrl?: string | null
  location?: string | null
  duration?: string | null
  priceStartingFrom?: number | null
  priceLabel: string
  coverImage: ImageRef
  galleryImages: ImageRef[]
  services: string[]
  highlights: string[]
  mustKnow: string[]
  inclusions: string[]
  exclusions: string[]
  itinerary: ItineraryDay[]
  faqs: FaqItem[]
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: ImageRef | null
  canonicalUrl?: string | null
  keywords: string[]
  isFeatured: boolean
  publishedAt?: Date | null
  updatedAt?: Date | null
}

export type PublicBlog = {
  id: string
  title: string
  slug: string
  excerpt: string
  content?: string | null
  coverImage: ImageRef
  authorName?: string | null
  category?: string | null
  tags: string[]
  faqs: FaqItem[]
  metaTitle?: string | null
  metaDescription?: string | null
  ogImage?: ImageRef | null
  canonicalUrl?: string | null
  isPublished: boolean
  publishedAt?: Date | null
  updatedAt?: Date | null
}

export type PublicGalleryImage = {
  id: string
  title: string
  location?: string | null
  altText: string
  image: ImageRef
}
