import type { MetadataRoute } from "next"
import { getSiteSettings } from "@/lib/cms/queries"
import { absoluteUrl } from "@/lib/cms/utils"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings()
  const siteUrl = settings.siteUrl.replace(/\/$/, "")

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/api/admin"],
    },
    sitemap: absoluteUrl("/sitemap.xml").replace("https://funzip.travel", siteUrl),
  }
}
