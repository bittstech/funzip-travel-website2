import Link from "next/link"
import { getPrisma } from "@/lib/cms/prisma"
import { getSeoWarnings } from "@/lib/cms/utils"

export default async function AdminSeoPage() {
  const [packages, blogs] = await Promise.all([
    getPrisma().package.findMany({ include: { coverImage: true } }),
    getPrisma().blog.findMany({ include: { coverImage: true } }),
  ])

  const allMeta = [
    ...packages.map((pkg) => ({
      metaTitle: pkg.metaTitle,
      metaDescription: pkg.metaDescription,
    })),
    ...blogs.map((blog) => ({
      metaTitle: blog.metaTitle,
      metaDescription: blog.metaDescription,
    })),
  ]
  const titleCounts = new Map<string, number>()
  const descriptionCounts = new Map<string, number>()

  for (const item of allMeta) {
    if (item.metaTitle) {
      const key = item.metaTitle.trim().toLowerCase()
      titleCounts.set(key, (titleCounts.get(key) || 0) + 1)
    }
    if (item.metaDescription) {
      const key = item.metaDescription.trim().toLowerCase()
      descriptionCounts.set(key, (descriptionCounts.get(key) || 0) + 1)
    }
  }

  const duplicateWarnings = (item: {
    metaTitle?: string | null
    metaDescription?: string | null
  }) => [
    ...(item.metaTitle &&
    (titleCounts.get(item.metaTitle.trim().toLowerCase()) || 0) > 1
      ? ["Duplicate meta title"]
      : []),
    ...(item.metaDescription &&
    (descriptionCounts.get(item.metaDescription.trim().toLowerCase()) || 0) > 1
      ? ["Duplicate meta description"]
      : []),
  ]

  const packageRows = packages.map((pkg) => ({
    id: pkg.id,
    type: "Package",
    title: pkg.title,
    href: `/admin/packages/${pkg.id}`,
    warnings: [
      ...getSeoWarnings({
        slug: pkg.slug,
        metaTitle: pkg.metaTitle,
        metaDescription: pkg.metaDescription,
        imageAlt: pkg.coverImage?.altText,
        faqs: pkg.faqsJson,
      }),
      ...duplicateWarnings(pkg),
    ],
  }))

  const blogRows = blogs.map((blog) => ({
    id: blog.id,
    type: "Blog",
    title: blog.title,
    href: `/admin/blogs/${blog.id}`,
    warnings: [
      ...getSeoWarnings({
        slug: blog.slug,
        metaTitle: blog.metaTitle,
        metaDescription: blog.metaDescription,
        imageAlt: blog.coverImage?.altText,
        faqs: blog.faqsJson,
      }),
      ...duplicateWarnings(blog),
    ],
  }))

  const rows = [...packageRows, ...blogRows].sort(
    (a, b) => b.warnings.length - a.warnings.length,
  )

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Search
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold">
          SEO Settings
        </h1>
        <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
          Warnings are based on missing titles, descriptions, slug length, image
          alt text, and visible FAQ coverage. Duplicate slugs are blocked by the
          database.
        </p>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[820px] text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Warnings</th>
              <th className="px-4 py-3 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {rows.map((row) => (
              <tr key={`${row.type}-${row.id}`}>
                <td className="px-4 py-4">{row.type}</td>
                <td className="px-4 py-4 font-semibold">{row.title}</td>
                <td className="px-4 py-4">
                  {row.warnings.length ? (
                    <ul className="flex flex-wrap gap-2">
                      {row.warnings.map((warning, warningIndex) => (
                        <li
                          key={`${row.type}-${row.id}-warning-${warningIndex}-${warning}`}
                          className="rounded-full bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive"
                        >
                          {warning}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <span className="text-accent">Good</span>
                  )}
                </td>
                <td className="px-4 py-4 text-right">
                  <Link
                    href={row.href}
                    className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                  >
                    Edit
                  </Link>
                </td>
              </tr>
            ))}
            {rows.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted-foreground" colSpan={4}>
                  No packages or blogs yet.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
