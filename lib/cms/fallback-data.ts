import {
  blogs,
  faqs,
  galleryItems,
  packages,
} from "@/components/funzip/data"
import type {
  PublicBlog,
  PublicGalleryImage,
  PublicHeroSlide,
  PublicPackage,
  SiteSettingsPublic,
} from "./types"
import { formatPrice, slugify } from "./utils"

export const fallbackSettings: SiteSettingsPublic = {
  siteName: "Funzip Kashmir Tour & Travels",
  siteUrl: "https://funzip.travel",
  logoUrl: "/logoksh.svg",
  phonePrimary: "+91 00000 00000",
  phoneSecondary: null,
  whatsappNumber: "910000000000",
  email: "hello@funzip.travel",
  address: "Kashmir, India",
  googleReviewUrl: null,
  tripAdvisorUrl: null,
  defaultMetaTitle: "Funzip Kashmir Tour & Travels | Premium Kashmir Packages",
  defaultMetaDescription:
    "Discover Kashmir with Funzip. Handcrafted tour packages for families, couples, honeymooners, and adventure travelers.",
  defaultOgImage: "/images/hero-kashmir.png",
}

export const fallbackHeroSlides: PublicHeroSlide[] = [
  {
    id: "fallback-hero",
    title: "Discover Kashmir With Funzip",
    subtitle:
      "Handcrafted Kashmir tour packages for families, couples, honeymooners, and adventure travelers.",
    image: {
      url: "/naweedey-XHG0uFAlEGM-unsplash.jpg",
      alt: "Cinematic view of a Kashmir valley with snow-capped mountains and Dal Lake at golden hour",
      width: 1920,
      height: 1280,
    },
    ctaText: "Explore Packages",
    ctaUrl: "/packages",
  },
]

export const fallbackPackages: PublicPackage[] = packages.map((pkg, index) => {
  const priceStartingFrom =
    Number.parseInt(pkg.price.replace(/[^\d]/g, ""), 10) || null

  return {
    id: `fallback-package-${index}`,
    title: pkg.name,
    slug: slugify(pkg.name),
    shortDescription: pkg.description,
    fullDescription: `${pkg.description} Our local Kashmir team can customize hotels, transport, sightseeing, meals, and pacing around your travel style.`,
    itineraryUrl: null,
    location: "Kashmir",
    duration: pkg.duration,
    priceStartingFrom,
    priceLabel: formatPrice(priceStartingFrom),
    coverImage: {
      url: pkg.image,
      alt: `${pkg.name} Kashmir tour package`,
      width: 1200,
      height: 800,
    },
    galleryImages: [],
    services: ["Sightseeing", "Transportation", "Support", "Meals", "Hotel"],
    highlights: [
      "Private transfers for the full trip",
      "Balanced sightseeing and leisure time",
      "Customizable plan for families, couples, and groups",
    ],
    contentSections: [
      {
        id: "trip-style",
        title: "Trip Style",
        lines: [
          "Private transfers for the full trip",
          "Balanced sightseeing and leisure time",
          "Customizable plan for families, couples, and groups",
        ],
      },
      {
        id: "included-support",
        title: "Included Support",
        lines: ["Private transport", "Hotel stay", "Sightseeing support"],
      },
    ],
    mustKnow: [
      "Seasonal activities depend on weather and local conditions.",
      "Advance booking helps secure better hotels and houseboats.",
      "Adventure activities and entry tickets can be arranged separately.",
    ],
    inclusions: ["Private transport", "Hotel stay", "Sightseeing support"],
    exclusions: ["Flights", "Personal expenses", "Adventure activity tickets"],
    itinerary: [
      {
        day: 1,
        title: "Arrival in Srinagar",
        description: "Airport pickup, local sightseeing, and a relaxed start.",
      },
      {
        day: 2,
        title: "Valley sightseeing",
        description: "Explore scenic locations based on your selected package.",
      },
    ],
    faqs: faqs.slice(0, 3).map((faq) => ({
      question: faq.q,
      answer: faq.a,
    })),
    metaTitle: `${pkg.name} | Funzip Kashmir Tour & Travels`,
    metaDescription: pkg.description,
    ogImage: {
      url: pkg.image,
      alt: `${pkg.name} Kashmir tour package`,
      width: 1200,
      height: 800,
    },
    canonicalUrl: null,
    keywords: ["Kashmir tour package", pkg.name],
    isFeatured: index < 6,
    publishedAt: new Date("2025-05-01T00:00:00.000Z"),
    updatedAt: new Date("2025-05-01T00:00:00.000Z"),
  }
})

export const fallbackGalleryImages: PublicGalleryImage[] = galleryItems.map(
  (item, index) => ({
    id: `fallback-gallery-${index}`,
    title: item.category,
    location: "Kashmir",
    altText: `${item.category} in Kashmir`,
    image: {
      url: item.image,
      alt: `${item.category} in Kashmir`,
      width: 1200,
      height: 800,
    },
  }),
)

export const fallbackBlogs: PublicBlog[] = blogs.map((blog, index) => ({
  id: `fallback-blog-${index}`,
  title: blog.title,
  slug: slugify(blog.title),
  excerpt: blog.excerpt,
  content: `# ${blog.title}\n\n${blog.excerpt}\n\nPlanning a Kashmir trip becomes easier when you balance weather, route timing, hotels, and local guidance. Funzip helps you shape a comfortable itinerary around your dates and budget.`,
  coverImage: {
    url: blog.image,
    alt: blog.title,
    width: 1200,
    height: 800,
  },
  authorName: "Funzip Travel Team",
  category: blog.category,
  tags: [blog.category, "Kashmir"],
  faqs: [],
  metaTitle: `${blog.title} | Funzip Kashmir Tour & Travels`,
  metaDescription: blog.excerpt,
  ogImage: {
    url: blog.image,
    alt: blog.title,
    width: 1200,
    height: 800,
  },
  canonicalUrl: null,
  isPublished: true,
  publishedAt: new Date(blog.date),
  updatedAt: new Date(blog.date),
}))
