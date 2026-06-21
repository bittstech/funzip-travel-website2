"use client"

import { useEffect, useRef, useState } from "react"

const MAX_SOURCE_BYTES = 24 * 1024 * 1024
const TARGET_UPLOAD_BYTES = 1.8 * 1024 * 1024
const MAX_IMAGE_EDGE = 2200
const QUALITY_STEPS = [0.84, 0.76, 0.68, 0.6, 0.52]

function formatBytes(bytes: number) {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function fileBaseName(name: string) {
  return name.replace(/\.[^.]+$/, "") || "image"
}

async function readImageSize(file: File) {
  if ("createImageBitmap" in window) {
    const bitmap = await createImageBitmap(file)
    return {
      width: bitmap.width,
      height: bitmap.height,
      close: () => bitmap.close(),
      draw: (context: CanvasRenderingContext2D, width: number, height: number) => {
        context.drawImage(bitmap, 0, 0, width, height)
      },
    }
  }

  const objectUrl = URL.createObjectURL(file)
  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const element = new Image()
      element.onload = () => resolve(element)
      element.onerror = () => reject(new Error("Could not read this image."))
      element.src = objectUrl
    })

    return {
      width: image.naturalWidth,
      height: image.naturalHeight,
      close: () => URL.revokeObjectURL(objectUrl),
      draw: (context: CanvasRenderingContext2D, width: number, height: number) => {
        context.drawImage(image, 0, 0, width, height)
      },
    }
  } catch (error) {
    URL.revokeObjectURL(objectUrl)
    throw error
  }
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  type: string,
  quality: number,
) {
  return new Promise<Blob | null>((resolve) => {
    canvas.toBlob(resolve, type, quality)
  })
}

async function optimizeImageForUpload(file: File) {
  if (file.size <= TARGET_UPLOAD_BYTES) {
    return {
      file,
      message: null,
    }
  }

  if (file.size > MAX_SOURCE_BYTES) {
    throw new Error(
      `Please choose an image smaller than ${formatBytes(MAX_SOURCE_BYTES)}.`,
    )
  }

  const image = await readImageSize(file)
  try {
    const largestEdge = Math.max(image.width, image.height) || MAX_IMAGE_EDGE
    let scale = Math.min(1, MAX_IMAGE_EDGE / largestEdge)

    for (let attempt = 0; attempt < 4; attempt += 1) {
      const width = Math.max(1, Math.round(image.width * scale))
      const height = Math.max(1, Math.round(image.height * scale))
      const canvas = document.createElement("canvas")
      canvas.width = width
      canvas.height = height
      const context = canvas.getContext("2d")

      if (!context) {
        throw new Error("Your browser could not optimize this image.")
      }

      context.imageSmoothingQuality = "high"
      image.draw(context, width, height)

      for (const quality of QUALITY_STEPS) {
        const blob =
          (await canvasToBlob(canvas, "image/webp", quality)) ||
          (await canvasToBlob(canvas, "image/jpeg", quality))

        if (!blob) continue

        if (blob.size <= TARGET_UPLOAD_BYTES || attempt === 3) {
          const extension = blob.type === "image/jpeg" ? "jpg" : "webp"
          const optimized = new File(
            [blob],
            `${fileBaseName(file.name)}-optimized.${extension}`,
            {
              type: blob.type || "image/webp",
              lastModified: Date.now(),
            },
          )

          if (optimized.size > TARGET_UPLOAD_BYTES) {
            throw new Error(
              `This image is still too large after optimization. Please choose a smaller image.`,
            )
          }

          return {
            file: optimized,
            message: `Optimized from ${formatBytes(file.size)} to ${formatBytes(
              optimized.size,
            )}.`,
          }
        }
      }

      scale *= 0.78
    }
  } finally {
    image.close()
  }

  throw new Error("This image could not be optimized for upload.")
}

function setInputFile(input: HTMLInputElement, file: File) {
  const transfer = new DataTransfer()
  transfer.items.add(file)
  input.files = transfer.files
}

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
  const [status, setStatus] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isOptimizing, setIsOptimizing] = useState(false)

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
          aria-describedby={`${name}-upload-status`}
          data-upload-processing={isOptimizing ? "true" : "false"}
          onChange={async (event) => {
            const file = event.currentTarget.files?.[0]
            const input = event.currentTarget
            if (preview) URL.revokeObjectURL(preview)
            setPreview(null)
            setStatus(null)
            setError(null)

            if (!file) return

            setIsOptimizing(true)
            input.value = ""

            try {
              const optimized = await optimizeImageForUpload(file)
              setInputFile(input, optimized.file)
              setPreview(URL.createObjectURL(optimized.file))
              setStatus(optimized.message || `${formatBytes(optimized.file.size)} selected.`)
            } catch (uploadError) {
              setError(
                uploadError instanceof Error && uploadError.message
                  ? uploadError.message
                  : "This image could not be prepared for upload.",
              )
            } finally {
              setIsOptimizing(false)
            }
          }}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm"
        />
      </label>
      <div id={`${name}-upload-status`} className="mt-2 text-xs">
        {isOptimizing ? (
          <p className="text-muted-foreground">Optimizing image for upload...</p>
        ) : null}
        {status ? <p className="text-muted-foreground">{status}</p> : null}
        {error ? <p className="font-semibold text-destructive">{error}</p> : null}
      </div>
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
              setStatus(null)
              setError(null)
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
