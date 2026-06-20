import type {
  FaqItem,
  PublicBlog,
  PublicGalleryImage,
  PublicPackage,
  SiteSettingsPublic,
} from "@/lib/cms/types"
import { absoluteUrl } from "@/lib/cms/utils"

type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue | undefined }

function cleanJson<T extends JsonValue>(value: T): T {
  if (Array.isArray(value)) {
    return value
      .map((item) => cleanJson(item))
      .filter((item) => item !== undefined && item !== null) as T
  }

  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value)
        .filter(([, item]) => item !== undefined && item !== null && item !== "")
        .map(([key, item]) => [key, cleanJson(item as JsonValue)]),
    ) as T
  }

  return value
}

export function JsonLd({ data }: { data: JsonValue | JsonValue[] }) {
  const json = JSON.stringify(cleanJson(data)).replace(/</g, "\\u003c")
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: json }}
    />
  )
}

export function organizationSchema(settings: SiteSettingsPublic) {
  return cleanJson({
    "@context": "https://schema.org",
    "@type": ["Organization", "TravelAgency"],
    name: settings.siteName,
    url: absoluteUrl("/"),
    logo: settings.logoUrl ? absoluteUrl(settings.logoUrl) : undefined,
    email: settings.email || undefined,
    telephone: settings.phonePrimary || undefined,
    address: settings.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressCountry: "IN",
        }
      : undefined,
    sameAs: [settings.googleReviewUrl, settings.tripAdvisorUrl].filter(
      (item): item is string => Boolean(item),
    ),
  })
}

export function websiteSchema(settings: SiteSettingsPublic) {
  return cleanJson({
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: settings.siteName,
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/")}search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  })
}

export function breadcrumbSchema(items: { name: string; url: string }[]) {
  return cleanJson({
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.url),
    })),
  })
}

export function packageCollectionSchema(packages: PublicPackage[]) {
  return cleanJson({
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Kashmir Tour Packages",
    url: absoluteUrl("/packages"),
    mainEntity: {
      "@type": "ItemList",
      itemListElement: packages.map((pkg, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: absoluteUrl(`/packages/${pkg.slug}`),
        name: pkg.title,
      })),
    },
  })
}

export function packageSchema(pkg: PublicPackage) {
  return cleanJson({
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    name: pkg.title,
    description: pkg.shortDescription,
    image: absoluteUrl(pkg.coverImage.url),
    url: absoluteUrl(`/packages/${pkg.slug}`),
    touristType: "Kashmir traveler",
    itinerary: pkg.itinerary.map((day) => ({
      "@type": "ItemList",
      name: `Day ${day.day}: ${day.title}`,
      description: day.description,
    })),
    offers: pkg.priceStartingFrom
      ? {
          "@type": "Offer",
          price: pkg.priceStartingFrom,
          priceCurrency: "INR",
          availability: "https://schema.org/InStock",
          url: absoluteUrl(`/packages/${pkg.slug}`),
        }
      : undefined,
  })
}

export function blogCollectionSchema(blogs: PublicBlog[]) {
  return cleanJson({
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Funzip Kashmir Travel Journal",
    url: absoluteUrl("/blogs"),
    blogPost: blogs.map((blog) => ({
      "@type": "BlogPosting",
      headline: blog.title,
      url: absoluteUrl(`/blogs/${blog.slug}`),
      datePublished: blog.publishedAt?.toISOString(),
    })),
  })
}

export function blogPostingSchema(blog: PublicBlog) {
  return cleanJson({
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: blog.title,
    description: blog.excerpt,
    image: absoluteUrl(blog.coverImage.url),
    url: absoluteUrl(`/blogs/${blog.slug}`),
    author: {
      "@type": "Person",
      name: blog.authorName || "Funzip Travel Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Funzip Kashmir Tour & Travels",
    },
    datePublished: blog.publishedAt?.toISOString(),
    dateModified: blog.updatedAt?.toISOString() || blog.publishedAt?.toISOString(),
  })
}

export function faqSchema(faqs: FaqItem[]) {
  if (faqs.length === 0) return null

  return cleanJson({
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  })
}

export function contactSchema(settings: SiteSettingsPublic) {
  return cleanJson({
    "@context": "https://schema.org",
    "@type": "TravelAgency",
    name: settings.siteName,
    url: absoluteUrl("/contact"),
    telephone: settings.phonePrimary || settings.whatsappNumber,
    email: settings.email,
    address: settings.address
      ? {
          "@type": "PostalAddress",
          streetAddress: settings.address,
          addressCountry: "IN",
        }
      : undefined,
    contactPoint: {
      "@type": "ContactPoint",
      telephone: settings.phonePrimary || settings.whatsappNumber,
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["English", "Hindi"],
    },
  })
}

export function gallerySchema(images: PublicGalleryImage[]) {
  return cleanJson({
    "@context": "https://schema.org",
    "@type": "ImageGallery",
    name: "Kashmir Travel Gallery",
    url: absoluteUrl("/gallery"),
    image: images.map((item) => absoluteUrl(item.image.url)),
  })
}
