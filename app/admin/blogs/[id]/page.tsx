import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminNotice } from "@/components/admin/admin-notice"
import { BlogForm } from "@/components/admin/blog-form"
import { updateBlogAction } from "@/app/admin/actions"
import { getPrisma } from "@/lib/cms/prisma"
import { getSelectableMedia } from "@/lib/cms/queries"

export default async function EditBlogPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [{ id }, noticeParams] = await Promise.all([params, searchParams])
  const [blog, media] = await Promise.all([
    getPrisma().blog.findUnique({ where: { id } }),
    getSelectableMedia(),
  ])

  if (!blog) notFound()

  return (
    <div>
      <AdminNotice params={noticeParams} />
      <Link href="/admin/blogs" className="text-sm font-semibold text-primary">
        Back to blogs
      </Link>
      <h1 className="mt-3 font-heading text-4xl font-semibold">Edit Blog</h1>
      <div className="mt-8">
        <BlogForm
          action={updateBlogAction}
          submitLabel="Save Blog"
          media={media}
          blog={blog}
        />
      </div>
    </div>
  )
}
