import { AdminNotice } from "@/components/admin/admin-notice"
import { saveSiteSettingsAction } from "@/app/admin/actions"
import { fallbackSettings } from "@/lib/cms/fallback-data"
import { getPrisma } from "@/lib/cms/prisma"

const inputClass =
  "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
const labelClass = "block text-sm font-semibold"

export default async function AdminSettingsPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const [params, settings] = await Promise.all([
    searchParams,
    getPrisma().siteSettings.findFirst({ orderBy: { updatedAt: "desc" } }),
  ])
  const value = settings || fallbackSettings

  return (
    <div>
      <AdminNotice params={params} />
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Settings
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold">
          Site Settings
        </h1>
      </div>

      <form
        action={saveSiteSettingsAction}
        className="mt-8 grid gap-5 rounded-xl border border-border bg-card p-5 md:grid-cols-2"
      >
        <label className={labelClass}>
          Site Name
          <input name="siteName" required defaultValue={value.siteName} className={`${inputClass} mt-2`} />
        </label>
        <label className={labelClass}>
          Site URL
          <input name="siteUrl" required defaultValue={value.siteUrl} className={`${inputClass} mt-2`} />
        </label>
        <label className={labelClass}>
          Logo URL
          <input name="logoUrl" defaultValue={value.logoUrl || ""} className={`${inputClass} mt-2`} />
        </label>
        <label className={labelClass}>
          Primary Phone
          <input name="phonePrimary" defaultValue={value.phonePrimary || ""} className={`${inputClass} mt-2`} />
        </label>
        <label className={labelClass}>
          Secondary Phone
          <input name="phoneSecondary" defaultValue={value.phoneSecondary || ""} className={`${inputClass} mt-2`} />
        </label>
        <label className={labelClass}>
          WhatsApp Number
          <input name="whatsappNumber" defaultValue={value.whatsappNumber || ""} className={`${inputClass} mt-2`} />
        </label>
        <label className={labelClass}>
          Email
          <input name="email" type="email" defaultValue={value.email || ""} className={`${inputClass} mt-2`} />
        </label>
        <label className={labelClass}>
          Address
          <input name="address" defaultValue={value.address || ""} className={`${inputClass} mt-2`} />
        </label>
        <label className={labelClass}>
          Google Review URL
          <input name="googleReviewUrl" defaultValue={value.googleReviewUrl || ""} className={`${inputClass} mt-2`} />
        </label>
        <label className={labelClass}>
          TripAdvisor URL
          <input name="tripAdvisorUrl" defaultValue={value.tripAdvisorUrl || ""} className={`${inputClass} mt-2`} />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Default Meta Title
          <input name="defaultMetaTitle" defaultValue={value.defaultMetaTitle || ""} maxLength={80} className={`${inputClass} mt-2`} />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Default Meta Description
          <textarea name="defaultMetaDescription" rows={3} defaultValue={value.defaultMetaDescription || ""} maxLength={180} className={`${inputClass} mt-2 resize-y`} />
        </label>
        <label className={`${labelClass} md:col-span-2`}>
          Default OG Image URL
          <input name="defaultOgImage" defaultValue={value.defaultOgImage || ""} className={`${inputClass} mt-2`} />
        </label>
        <div className="md:col-span-2">
          <button className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">
            Save Settings
          </button>
        </div>
      </form>
    </div>
  )
}
