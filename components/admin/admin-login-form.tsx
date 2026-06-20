"use client"

import { useState } from "react"
import { ADMIN_COOKIE_NAME, ADMIN_SESSION_SECONDS } from "@/lib/cms/session"

const ADMIN_PASSWORD = "imran"

export function AdminLoginForm({ initialError }: { initialError?: string }) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState(initialError || "")

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (password !== ADMIN_PASSWORD) {
      setError("Invalid admin password.")
      return
    }

    const secure = window.location.protocol === "https:" ? "; Secure" : ""
    document.cookie = `${ADMIN_COOKIE_NAME}=${ADMIN_PASSWORD}; Path=/admin; Max-Age=${ADMIN_SESSION_SECONDS}; SameSite=Lax${secure}`
    window.location.assign("/admin")
  }

  return (
    <>
      {error ? (
        <div className="mt-6 rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm font-medium text-destructive">
          {error}
        </div>
      ) : null}

      <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
        <label>
          <span className="mb-2 block text-sm font-semibold">Password</span>
          <input
            value={password}
            onChange={(event) => setPassword(event.target.value)}
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
    </>
  )
}
