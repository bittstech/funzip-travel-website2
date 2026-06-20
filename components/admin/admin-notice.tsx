"use client"

import { useEffect, useState } from "react"

type NoticeParams = {
  success?: string
  error?: string
}

export function AdminNotice({ params }: { params: NoticeParams }) {
  const [visible, setVisible] = useState(Boolean(params.success || params.error))
  const message = params.success || params.error

  useEffect(() => {
    setVisible(Boolean(message))
    if (!message) return

    const timer = window.setTimeout(() => setVisible(false), 6000)
    return () => window.clearTimeout(timer)
  }, [message])

  if (!message || !visible) return null

  return (
    <div
      role={params.error ? "alert" : "status"}
      aria-live={params.error ? "assertive" : "polite"}
      className={`fixed right-5 top-5 z-50 w-[min(24rem,calc(100vw-2rem))] rounded-lg border px-4 py-3 text-sm font-medium shadow-xl backdrop-blur ${
        params.error
          ? "border-destructive/30 bg-destructive/95 text-white"
          : "border-accent/30 bg-accent/95 text-white"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <span>{message}</span>
        <button
          type="button"
          onClick={() => setVisible(false)}
          className="text-current opacity-70 transition hover:opacity-100"
          aria-label="Dismiss notification"
        >
          x
        </button>
      </div>
    </div>
  )
}
