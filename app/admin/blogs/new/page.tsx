import Link from "next/link"
import { AdminNotice } from "@/components/admin/admin-notice"
import { BlogForm } from "@/components/admin/blog-form"
import { createBlogAction } from "@/app/admin/actions"
import { getSelectableMedia } from "@/lib/cms/queries"

export default async function NewBlogPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [media, params] = await Promise.all([getSelectableMedia(), searchParams])

  return (
    <div>
      <AdminNotice params={params} />
      <Link href="/admin/blogs" className="text-sm font-semibold text-primary">
        Back to blogs
      </Link>
      <h1 className="mt-3 font-heading text-4xl font-semibold">Add Blog</h1>
      <div className="mt-8">
        <BlogForm action={createBlogAction} submitLabel="Create Blog" media={media} />
      </div>
    </div>
  )
}
