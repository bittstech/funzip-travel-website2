"use client"

import { useState } from "react"

export function ImageUploadInput({
  name,
  label,
  required,
}: {
  name: string
  label: string
  required?: boolean
}) {
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <label className="block">
      <span className="mb-2 block text-sm font-semibold">{label}</span>
      <input
        name={name}
        type="file"
        accept="image/jpeg,image/png,image/webp,image/avif"
        required={required}
        onChange={(event) => {
          const file = event.currentTarget.files?.[0]
          setPreview(file ? URL.createObjectURL(file) : null)
        }}
        className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
      />
      {preview ? (
        <img
          src={preview}
          alt=""
          className="mt-3 h-36 w-full rounded-lg object-cover"
        />
      ) : null}
    </label>
  )
}
