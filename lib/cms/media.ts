import "server-only"

import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { randomUUID } from "crypto"
import sharp from "sharp"
import { MediaAssetType } from "@prisma/client"
import { getPrisma } from "./prisma"

const MAX_UPLOAD_SIZE = 8 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/avif",
])

const variants = [
  { key: "thumbnail", width: 400 },
  { key: "medium", width: 900 },
  { key: "large", width: 1600 },
]

export function hasUploadedFile(value: FormDataEntryValue | null): value is File {
  return value instanceof File && value.size > 0 && Boolean(value.name)
}

function fileExtension(name: string) {
  return name.split(".").pop()?.toLowerCase() || ""
}

function validateFile(file: File) {
  const extension = fileExtension(file.name)
  const typeAllowed =
    ALLOWED_TYPES.has(file.type) ||
    ["jpg", "jpeg", "png", "webp", "avif"].includes(extension)

  if (!typeAllowed) {
    throw new Error("Only JPG, PNG, WebP, and AVIF images are allowed.")
  }

  if (file.size > MAX_UPLOAD_SIZE) {
    throw new Error("Image is too large. Please upload an image under 8 MB.")
  }
}

async function storeBuffer(
  key: string,
  buffer: Buffer,
  contentType = "image/webp",
) {
  const blobToken = process.env.BLOB_READ_WRITE_TOKEN

  if (blobToken) {
    const { put } = await import("@vercel/blob")
    const blob = await put(key, buffer, {
      access: "public",
      contentType,
      token: blobToken,
    })
    return blob.url
  }

  const uploadDir = path.join(process.cwd(), "public", "uploads")
  await mkdir(path.dirname(path.join(uploadDir, key)), { recursive: true })
  await writeFile(path.join(uploadDir, key), buffer)
  return `/uploads/${key.replace(/\\/g, "/")}`
}

export async function createMediaAssetFromFile(
  file: File,
  options: {
    altText?: string | null
    caption?: string | null
    type?: MediaAssetType
  } = {},
) {
  validateFile(file)

  const originalBuffer = Buffer.from(await file.arrayBuffer())
  const source = sharp(originalBuffer, { failOn: "none" }).rotate()
  const metadata = await source.metadata()
  const baseName = `${Date.now()}-${randomUUID()}`
  const folder = (options.type || MediaAssetType.GENERAL).toLowerCase()

  const uploadedVariants: Record<
    string,
    { url: string; width: number; height: number; sizeKb: number; format: string }
  > = {}

  for (const variant of variants) {
    const resized = sharp(originalBuffer, { failOn: "none" })
      .rotate()
      .resize({
        width: Math.min(variant.width, metadata.width || variant.width),
        withoutEnlargement: true,
      })
      .webp({ quality: 86, smartSubsample: true })

    const output = await resized.toBuffer()
    const outputMeta = await sharp(output).metadata()
    const key = `${folder}/${baseName}-${variant.key}.webp`
    const url = await storeBuffer(key, output)

    uploadedVariants[variant.key] = {
      url,
      width: outputMeta.width || variant.width,
      height: outputMeta.height || metadata.height || variant.width,
      sizeKb: Math.max(1, Math.round(output.byteLength / 1024)),
      format: "webp",
    }
  }

  const large = uploadedVariants.large || Object.values(uploadedVariants)[0]

  return getPrisma().mediaAsset.create({
    data: {
      originalFileName: file.name,
      altText: options.altText || null,
      caption: options.caption || null,
      storageUrl: large.url,
      variantsJson: uploadedVariants,
      width: large.width,
      height: large.height,
      format: large.format,
      sizeKb: large.sizeKb,
      type: options.type || MediaAssetType.GENERAL,
    },
  })
}
