import { getPublishedBlogs, getPublishedPackages, getSiteSettings } from "@/lib/cms/queries"
import { absoluteUrl } from "@/lib/cms/utils"

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
    "## Important URLs",
    `- Home: ${absoluteUrl("/")}`,
    `- Packages: ${absoluteUrl("/packages")}`,
    `- Blogs: ${absoluteUrl("/blogs")}`,
    `- Gallery: ${absoluteUrl("/gallery")}`,
    `- Contact: ${absoluteUrl("/contact")}`,
    "",
    "## Services",
    "- Kashmir tour packages",
    "- Honeymoon packages",
    "- Family holidays",
    "- Luxury Kashmir holidays",
    "- Offbeat Kashmir itineraries",
    "- Custom hotel, transport, and sightseeing planning",
    "",
    "## Featured Package URLs",
    ...packages.slice(0, 12).map((pkg) => `- ${pkg.title}: ${absoluteUrl(`/packages/${pkg.slug}`)}`),
    "",
    "## Recent Blog URLs",
    ...blogs.slice(0, 12).map((blog) => `- ${blog.title}: ${absoluteUrl(`/blogs/${blog.slug}`)}`),
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
