"use client"

import { useEffect, useRef, useState } from "react"

export function ImageUploadInput({
  name,
  label,
  required,
}: {
  name: string
  label: string
  required?: boolean
}) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview)
    }
  }, [preview])

  return (
    <div className="block">
      <label>
        <span className="mb-2 block text-sm font-semibold">{label}</span>
        <input
          ref={inputRef}
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
      </label>
      {preview ? (
        <div className="mt-3 overflow-hidden rounded-lg border border-border bg-secondary">
          <img
            src={preview}
            alt=""
            className="h-36 w-full object-cover"
          />
          <button
            type="button"
            onClick={(event) => {
              event.preventDefault()
              if (inputRef.current) inputRef.current.value = ""
              setPreview(null)
            }}
            className="w-full px-3 py-2 text-xs font-semibold text-destructive transition-colors hover:bg-destructive/10"
          >
            Remove selected image
          </button>
        </div>
      ) : null}
    </div>
  )
}
