import type { MetadataRoute } from "next"
import { getSiteSettings } from "@/lib/cms/queries"

export default async function robots(): Promise<MetadataRoute.Robots> {
  const settings = await getSiteSettings()
  const siteUrl = settings.siteUrl.replace(/\/$/, "")
  const privatePaths = ["/admin", "/api/admin"]

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: privatePaths,
      },
      {
        userAgent: [
          "GPTBot",
          "ChatGPT-User",
          "ClaudeBot",
          "PerplexityBot",
          "Google-Extended",
        ],
        allow: "/",
        disallow: privatePaths,
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  }
}
