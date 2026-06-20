import Link from "next/link"
import { notFound } from "next/navigation"
import { AdminNotice } from "@/components/admin/admin-notice"
import { PackageForm } from "@/components/admin/package-form"
import { updatePackageAction } from "@/app/admin/actions"
import { getPrisma } from "@/lib/cms/prisma"
import { getSelectableMedia } from "@/lib/cms/queries"

export default async function EditPackagePage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [{ id }, noticeParams] = await Promise.all([params, searchParams])
  const [pkg, media] = await Promise.all([
    getPrisma().package.findUnique({ where: { id } }),
    getSelectableMedia(),
  ])

  if (!pkg) notFound()

  return (
    <div>
      <AdminNotice params={noticeParams} />
      <Link href="/admin/packages" className="text-sm font-semibold text-primary">
        Back to packages
      </Link>
      <h1 className="mt-3 font-heading text-4xl font-semibold">
        Edit Package
      </h1>
      <div className="mt-8">
        <PackageForm
          action={updatePackageAction}
          submitLabel="Save Package"
          media={media}
          pkg={pkg}
        />
      </div>
    </div>
  )
}
