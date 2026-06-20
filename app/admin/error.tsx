"use client"

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-5 text-destructive">
      <p className="font-heading text-2xl font-semibold">
        Admin page could not load
      </p>
      <p className="mt-2 text-sm leading-relaxed">
        Please check the database environment variables and migrations for this
        Vercel deployment.
      </p>
      {error.digest ? (
        <p className="mt-2 text-xs font-semibold">Error digest: {error.digest}</p>
      ) : null}
      <button
        type="button"
        onClick={reset}
        className="mt-4 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground"
      >
        Try again
      </button>
    </div>
  )
}
