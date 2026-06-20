import Link from "next/link"
import { AdminNotice } from "@/components/admin/admin-notice"
import { getAdminCounts } from "@/lib/cms/queries"
import { getPrisma } from "@/lib/cms/prisma"

export default async function AdminDashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ success?: string; error?: string }>
}) {
  const params = await searchParams
  let databaseError: string | null = null
  let counts = { packages: 0, blogs: 0, leads: 0, media: 0 }
  let leads: Awaited<ReturnType<ReturnType<typeof getPrisma>["lead"]["findMany"]>> = []

  try {
    const [adminCounts, recentLeads] = await Promise.all([
      getAdminCounts(),
      getPrisma().lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ])
    counts = adminCounts
    leads = recentLeads
  } catch (error) {
    databaseError =
      error instanceof Error && error.message
        ? error.message
        : "The admin database could not be reached."
  }

  const statCards = [
    { label: "Packages", value: counts.packages, href: "/admin/packages" },
    { label: "Blogs", value: counts.blogs, href: "/admin/blogs" },
    { label: "Leads", value: counts.leads, href: "/admin/leads" },
    { label: "Media Assets", value: counts.media, href: "/admin/gallery" },
  ]

  return (
    <div>
      <AdminNotice params={params} />
      {databaseError ? (
        <div className="mb-6 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          <p className="font-semibold">Admin database is not ready.</p>
          <p className="mt-1">
            Check the Vercel `DATABASE_URL` environment variable and run Prisma
            migrations. Details: {databaseError}
          </p>
        </div>
      ) : null}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Overview
          </p>
          <h1 className="mt-2 font-heading text-4xl font-semibold">
            Dashboard
          </h1>
        </div>
        <Link
          href="/"
          className="rounded-full border border-border px-5 py-2.5 text-sm font-semibold"
        >
          View Website
        </Link>
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-xl border border-border bg-card p-5 transition-colors hover:bg-secondary/60"
          >
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="mt-3 font-heading text-4xl font-semibold">
              {card.value}
            </p>
          </Link>
        ))}
      </div>

      <section className="mt-10 rounded-xl border border-border bg-card p-5">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-heading text-2xl font-semibold">Recent Leads</h2>
          <Link href="/admin/leads" className="text-sm font-semibold text-primary">
            View all
          </Link>
        </div>
        <div className="mt-5 overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="text-xs uppercase tracking-wide text-muted-foreground">
              <tr>
                <th className="py-3">Name</th>
                <th className="py-3">Phone</th>
                <th className="py-3">Location</th>
                <th className="py-3">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {leads.map((lead) => (
                <tr key={lead.id}>
                  <td className="py-3 font-medium">{lead.name}</td>
                  <td className="py-3">{lead.phone}</td>
                  <td className="py-3">{lead.travelLocation || "-"}</td>
                  <td className="py-3">
                    {lead.createdAt.toLocaleDateString("en-IN")}
                  </td>
                </tr>
              ))}
              {leads.length === 0 ? (
                <tr>
                  <td className="py-6 text-muted-foreground" colSpan={4}>
                    No leads yet.
                  </td>
                </tr>
              ) : null}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
