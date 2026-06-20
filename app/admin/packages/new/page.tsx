import Link from "next/link"
import { AdminNotice } from "@/components/admin/admin-notice"
import { PackageForm } from "@/components/admin/package-form"
import { createPackageAction } from "@/app/admin/actions"
import { getSelectableMedia } from "@/lib/cms/queries"

export default async function NewPackagePage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [media, params] = await Promise.all([getSelectableMedia(), searchParams])

  return (
    <div>
      <AdminNotice params={params} />
      <Link href="/admin/packages" className="text-sm font-semibold text-primary">
        Back to packages
      </Link>
      <h1 className="mt-3 font-heading text-4xl font-semibold">
        Add Package
      </h1>
      <div className="mt-8">
        <PackageForm
          action={createPackageAction}
          submitLabel="Create Package"
          media={media}
        />
      </div>
    </div>
  )
}
