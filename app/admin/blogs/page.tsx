import Link from "next/link"
import { AdminNotice } from "@/components/admin/admin-notice"
import { deleteBlogAction, toggleBlogPublishAction } from "@/app/admin/actions"
import { getPrisma } from "@/lib/cms/prisma"
import { getSeoWarnings } from "@/lib/cms/utils"

export default async function AdminBlogsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [params, blogs] = await Promise.all([
    searchParams,
    getPrisma().blog.findMany({
      include: { coverImage: true },
      orderBy: [{ createdAt: "desc" }],
    }),
  ])

  return (
    <div>
      <AdminNotice params={params} />
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Blogs
          </p>
          <h1 className="mt-2 font-heading text-4xl font-semibold">
            Travel Journal
          </h1>
        </div>
        <Link
          href="/admin/blogs/new"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
        >
          Add New
        </Link>
      </div>

      <div className="mt-8 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">SEO</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {blogs.map((blog) => {
              const warnings = getSeoWarnings({
                slug: blog.slug,
                metaTitle: blog.metaTitle,
                metaDescription: blog.metaDescription,
                imageAlt: blog.coverImage?.altText,
                faqs: blog.faqsJson,
              })

              return (
                <tr key={blog.id}>
                  <td className="px-4 py-4">
                    <p className="font-semibold">{blog.title}</p>
                    <p className="font-mono text-xs text-muted-foreground">
                      {blog.slug}
                    </p>
                  </td>
                  <td className="px-4 py-4">{blog.category || "-"}</td>
                  <td className="px-4 py-4">
                    <span className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold">
                      {blog.isPublished ? "Published" : "Draft"}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    {warnings.length ? (
                      <span className="text-xs text-destructive">
                        {warnings.length} warning{warnings.length > 1 ? "s" : ""}
                      </span>
                    ) : (
                      <span className="text-xs text-accent">Good</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <div className="flex justify-end gap-2">
                      <Link
                        href={`/admin/blogs/${blog.id}`}
                        className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                      >
                        Edit
                      </Link>
                      <form action={toggleBlogPublishAction}>
                        <input type="hidden" name="id" value={blog.id} />
                        <button className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold">
                          {blog.isPublished ? "Unpublish" : "Publish"}
                        </button>
                      </form>
                      <form action={deleteBlogAction}>
                        <input type="hidden" name="id" value={blog.id} />
                        <button className="rounded-full border border-destructive/30 px-3 py-1.5 text-xs font-semibold text-destructive">
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              )
            })}
            {blogs.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted-foreground" colSpan={5}>
                  No blogs yet. Add the first one.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
