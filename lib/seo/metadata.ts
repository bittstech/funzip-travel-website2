import type { Metadata } from "next"
import type { ImageRef, SiteSettingsPublic } from "@/lib/cms/types"
import { absoluteUrl, seoTitle, shortDescription } from "@/lib/cms/utils"

type MetadataInput = {
  title: string
  description: string
  path?: string
  image?: ImageRef | string | null
  canonical?: string | null
  keywords?: string[]
  noIndex?: boolean
  settings?: SiteSettingsPublic
}

function imageUrl(image: ImageRef | string | null | undefined) {
  if (!image) return undefined
  return typeof image === "string" ? absoluteUrl(image) : absoluteUrl(image.url)
}

export function buildMetadata({
  title,
  description,
  path = "/",
  image,
  canonical,
  keywords,
  noIndex,
  settings,
}: MetadataInput): Metadata {
  const resolvedTitle = seoTitle(title, settings?.siteName)
  const resolvedDescription = shortDescription(description)
  const resolvedCanonical = canonical || absoluteUrl(path)
  const resolvedImage = imageUrl(image || settings?.defaultOgImage)

  return {
    title: resolvedTitle,
    description: resolvedDescription,
    keywords,
    alternates: {
      canonical: resolvedCanonical,
    },
    openGraph: {
      title: resolvedTitle,
      description: resolvedDescription,
      url: resolvedCanonical,
      siteName: settings?.siteName || "Funzip Kashmir Tour & Travels",
      images: resolvedImage ? [{ url: resolvedImage }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: resolvedTitle,
      description: resolvedDescription,
      images: resolvedImage ? [resolvedImage] : undefined,
    },
    robots: noIndex
      ? {
          index: false,
          follow: false,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : undefined,
  }
}
