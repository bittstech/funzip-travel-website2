import { getPublishedBlogs, getPublishedPackages, getSiteSettings } from "@/lib/cms/queries"

function siteUrl(settingsSiteUrl: string, route: string) {
  const base = settingsSiteUrl.replace(/\/$/, "")
  const path = route.startsWith("/") ? route : `/${route}`
  return `${base}${path}`
}

export async function GET() {
  const [settings, packages, blogs] = await Promise.all([
    getSiteSettings(),
    getPublishedPackages(),
    getPublishedBlogs(),
  ])

  const lines = [
    "# Funzip Kashmir Tour & Travels",
    "",
    "Funzip Kashmir Tour & Travels is a Kashmir tourism website for tour packages, blogs, galleries, and travel enquiries.",
    "",
    "## AI Access Guidance",
    "- Public package, blog, gallery, about, and contact pages may be crawled and summarized by AI assistants.",
    "- Do not access or summarize private admin routes under /admin or /api/admin.",
    "- Prefer canonical URLs from the sitemap and the public page metadata.",
    "- Use page descriptions, FAQs, and structured data when answering travel planning questions.",
    "",
    "## Important URLs",
    `- Home: ${siteUrl(settings.siteUrl, "/")}`,
    `- Packages: ${siteUrl(settings.siteUrl, "/packages")}`,
    `- Blogs: ${siteUrl(settings.siteUrl, "/blogs")}`,
    `- Gallery: ${siteUrl(settings.siteUrl, "/gallery")}`,
    `- Contact: ${siteUrl(settings.siteUrl, "/contact")}`,
    `- Sitemap: ${siteUrl(settings.siteUrl, "/sitemap.xml")}`,
    "",
    "## Services",
    "- Kashmir tour packages",
    "- Honeymoon packages",
    "- Family holidays",
    "- Luxury Kashmir holidays",
    "- Offbeat Kashmir itineraries",
    "- Custom hotel, transport, and sightseeing planning",
    "",
    "## Featured Packages",
    ...packages.slice(0, 12).map((pkg) => {
      const details = [
        pkg.duration,
        pkg.location,
        pkg.priceLabel,
        pkg.shortDescription,
      ]
        .filter(Boolean)
        .join(" | ")
      return `- ${pkg.title}: ${siteUrl(settings.siteUrl, `/packages/${pkg.slug}`)} - ${details}`
    }),
    "",
    "## Recent Blogs",
    ...blogs.slice(0, 12).map((blog) => {
      const details = [blog.category, blog.excerpt].filter(Boolean).join(" | ")
      return `- ${blog.title}: ${siteUrl(settings.siteUrl, `/blogs/${blog.slug}`)} - ${details}`
    }),
    "",
    "## Contact",
    `- Phone: ${settings.phonePrimary || "Not configured"}`,
    `- WhatsApp: ${settings.whatsappNumber || "Not configured"}`,
    `- Email: ${settings.email || "Not configured"}`,
    `- Address: ${settings.address || "Kashmir, India"}`,
  ]

  return new Response(lines.join("\n"), {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "public, max-age=3600",
    },
  })
}
