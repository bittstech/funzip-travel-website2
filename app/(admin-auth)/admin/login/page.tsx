import type { Metadata } from "next"
import { Mountain } from "lucide-react"
import { loginAction } from "@/app/admin/actions"

export const metadata: Metadata = {
  title: "Admin Login | Funzip",
  robots: {
    index: false,
    follow: false,
  },
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const params = await searchParams

  return (
    <main className="flex min-h-screen items-center justify-center bg-secondary/40 px-5 py-12">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-xl">
        <div className="flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Mountain className="h-5 w-5" />
          </span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Funzip CMS
            </p>
            <h1 className="font-heading text-3xl font-semibold">
              Admin Login
            </h1>
          </div>
        </div>

        {params.error ? (
          <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
            {params.error}
          </div>
        ) : null}

        <form action={loginAction} className="mt-6 flex flex-col gap-4">
          <label>
            <span className="mb-2 block text-sm font-semibold">Password</span>
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              autoFocus
              className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </label>
          <button
            type="submit"
            className="rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/25 transition-transform hover:scale-[1.01]"
          >
            Login
          </button>
        </form>
      </div>
    </main>
  )
}
