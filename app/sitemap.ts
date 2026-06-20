import type { MetadataRoute } from "next"
import {
  getPublishedBlogs,
  getPublishedPackages,
  getSiteSettings,
} from "@/lib/cms/queries"
import { absoluteUrl } from "@/lib/cms/utils"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [settings, packages, blogs] = await Promise.all([
    getSiteSettings(),
    getPublishedPackages(),
    getPublishedBlogs(),
  ])

  const now = new Date()
  const staticRoutes = ["/", "/packages", "/blogs", "/gallery", "/contact", "/about"]

  return [
    ...staticRoutes.map((route) => ({
      url: absoluteUrl(route),
      lastModified: now,
      changeFrequency: (route === "/" ? "weekly" : "monthly") as
        | "weekly"
        | "monthly",
      priority: route === "/" ? 1 : 0.8,
    })),
    ...packages.map((pkg) => ({
      url: absoluteUrl(`/packages/${pkg.slug}`),
      lastModified: pkg.updatedAt || pkg.publishedAt || now,
      changeFrequency: "weekly" as const,
      priority: pkg.isFeatured ? 0.9 : 0.75,
    })),
    ...blogs.map((blog) => ({
      url: absoluteUrl(`/blogs/${blog.slug}`),
      lastModified: blog.updatedAt || blog.publishedAt || now,
      changeFrequency: "monthly" as const,
      priority: 0.65,
    })),
  ].map((entry) => ({
    ...entry,
    url: entry.url.replace("https://funzip.travel", settings.siteUrl.replace(/\/$/, "")),
  }))
}
