import { getPrisma } from "@/lib/cms/prisma"

const inputClass =
  "rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"

export default async function AdminLeadsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; sourceType?: string }>
}) {
  const params = await searchParams
  const q = params.q?.trim()
  const sourceType = params.sourceType?.trim()

  const leads = await getPrisma().lead.findMany({
    where: {
      sourceType: sourceType || undefined,
      OR: q
        ? [
            { name: { contains: q, mode: "insensitive" } },
            { phone: { contains: q, mode: "insensitive" } },
            { travelLocation: { contains: q, mode: "insensitive" } },
          ]
        : undefined,
    },
    orderBy: { createdAt: "desc" },
    take: 200,
  })

  return (
    <div>
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
          Enquiries
        </p>
        <h1 className="mt-2 font-heading text-4xl font-semibold">Leads</h1>
      </div>

      <form className="mt-8 flex flex-col gap-3 rounded-xl border border-border bg-card p-4 sm:flex-row">
        <input
          name="q"
          defaultValue={q || ""}
          placeholder="Search name, phone, location"
          className={`${inputClass} flex-1`}
        />
        <input
          name="sourceType"
          defaultValue={sourceType || ""}
          placeholder="Source type"
          className={inputClass}
        />
        <button className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground">
          Filter
        </button>
      </form>

      <div className="mt-6 overflow-x-auto rounded-xl border border-border bg-card">
        <table className="w-full min-w-[900px] text-left text-sm">
          <thead className="bg-secondary/50 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Location</th>
              <th className="px-4 py-3">People</th>
              <th className="px-4 py-3">Source Page</th>
              <th className="px-4 py-3">Source Type</th>
              <th className="px-4 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {leads.map((lead) => (
              <tr key={lead.id}>
                <td className="px-4 py-4">
                  <p className="font-semibold">{lead.name}</p>
                  {lead.message ? (
                    <p className="mt-1 max-w-xs truncate text-xs text-muted-foreground">
                      {lead.message}
                    </p>
                  ) : null}
                </td>
                <td className="px-4 py-4">{lead.phone}</td>
                <td className="px-4 py-4">{lead.travelLocation || "-"}</td>
                <td className="px-4 py-4">{lead.numberOfPeople || "-"}</td>
                <td className="px-4 py-4">{lead.sourcePage}</td>
                <td className="px-4 py-4">{lead.sourceType}</td>
                <td className="px-4 py-4">
                  {lead.createdAt.toLocaleString("en-IN")}
                </td>
              </tr>
            ))}
            {leads.length === 0 ? (
              <tr>
                <td className="px-4 py-8 text-muted-foreground" colSpan={7}>
                  No leads found.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  )
}
