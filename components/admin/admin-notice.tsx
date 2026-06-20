type NoticeParams = {
  success?: string
  error?: string
}

export function AdminNotice({ params }: { params: NoticeParams }) {
  const message = params.success || params.error
  if (!message) return null

  return (
    <div
      className={`mb-6 rounded-lg border px-4 py-3 text-sm font-medium ${
        params.error
          ? "border-destructive/30 bg-destructive/10 text-destructive"
          : "border-accent/30 bg-accent/10 text-accent"
      }`}
    >
      {message}
    </div>
  )
}
