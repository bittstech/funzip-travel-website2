"use server"

import { MediaAssetType } from "@prisma/client"
import { ZodError } from "zod"
import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"
import {
  clearLoginFailures,
  createAdminSession,
  destroyAdminSession,
  isLoginRateLimited,
  recordLoginFailure,
  requireAdmin,
  verifyAdminPassword,
} from "@/lib/cms/auth"
import {
  createMediaAssetFromFile,
  deleteUnusedMediaAsset,
  hasUploadedFile,
} from "@/lib/cms/media"
import { getPrisma } from "@/lib/cms/prisma"
import {
  asBoolean,
  asOptionalInt,
  asString,
  fieldToStringArray,
  nullableString,
  parseFaqs,
  parseItinerary,
  shortDescription,
  slugify,
} from "@/lib/cms/utils"
import { blogSchema, loginSchema, packageSchema, settingsSchema } from "@/lib/cms/validation"

export type AdminFormState = {
  ok: boolean
  message: string
  fieldErrors?: Record<string, string>
}

function adminRedirect(
  path: string,
  message: string,
  type: "success" | "error" = "success",
): never {
  redirect(`${path}?${type}=${encodeURIComponent(message)}`)
}

function revalidatePublic() {
  revalidatePath("/")
  revalidatePath("/packages")
  revalidatePath("/blogs")
  revalidatePath("/gallery")
  revalidatePath("/contact")
  revalidatePath("/sitemap.xml")
  revalidatePath("/robots.txt")
  revalidatePath("/llms.txt")
}

function normalizeUrl(value: string | null | undefined) {
  return value && value.length > 0 ? value : null
}

function validationMessage(error: ZodError) {
  const issue = error.issues[0]
  if (!issue) return "Please check the form and try again."
  const field = issue.path.join(".")
  return field ? `${field}: ${issue.message}` : issue.message
}

function fieldErrorsFromZod(error: ZodError) {
  return error.issues.reduce<Record<string, string>>((errors, issue) => {
    const key = issue.path.join(".")
    if (key && !errors[key]) errors[key] = issue.message
    return errors
  }, {})
}

function formError(
  message: string,
  fieldErrors: Record<string, string> = {},
): AdminFormState {
  return { ok: false, message, fieldErrors }
}

function exceptionMessage(error: unknown, fallback: string) {
  return error instanceof Error && error.message ? error.message : fallback
}

async function imageIdFromForm(
  formData: FormData,
  uploadField: string,
  selectField: string,
  type: MediaAssetType,
  altText: string,
) {
  const uploaded = formData.get(uploadField)
  if (hasUploadedFile(uploaded)) {
    const asset = await createMediaAssetFromFile(uploaded, {
      altText,
      type,
    })
    return asset.id
  }

  return nullableString(formData.get(selectField))
}

export async function loginAction(formData: FormData) {
  const parsed = loginSchema.safeParse({
    password: formData.get("password"),
  })

  if (!parsed.success) {
    adminRedirect("/admin/login", "Password is required.", "error")
  }

  if (isLoginRateLimited()) {
    adminRedirect(
      "/admin/login",
      "Too many login attempts. Please try again in a few minutes.",
      "error",
    )
  }

  const ok = await verifyAdminPassword(parsed.data.password)
  if (!ok) {
    recordLoginFailure()
    adminRedirect("/admin/login", "Invalid admin password.", "error")
  }

  clearLoginFailures()
  await createAdminSession()
  redirect("/admin")
}

export async function logoutAction() {
  await destroyAdminSession()
  redirect("/admin/login")
}

export async function saveSiteSettingsAction(formData: FormData) {
  await requireAdmin()
  const db = getPrisma()
  const parsed = settingsSchema.safeParse({
    siteName: asString(formData.get("siteName")),
    siteUrl: asString(formData.get("siteUrl")),
    logoUrl: nullableString(formData.get("logoUrl")),
    phonePrimary: nullableString(formData.get("phonePrimary")),
    phoneSecondary: nullableString(formData.get("phoneSecondary")),
    whatsappNumber: nullableString(formData.get("whatsappNumber")),
    email: nullableString(formData.get("email")) || "",
    address: nullableString(formData.get("address")),
    googleReviewUrl: nullableString(formData.get("googleReviewUrl")) || "",
    tripAdvisorUrl: nullableString(formData.get("tripAdvisorUrl")) || "",
    defaultMetaTitle: nullableString(formData.get("defaultMetaTitle")),
    defaultMetaDescription: nullableString(formData.get("defaultMetaDescription")),
    defaultOgImage: nullableString(formData.get("defaultOgImage")),
  })
  if (!parsed.success) {
    adminRedirect("/admin/settings", validationMessage(parsed.error), "error")
  }

  const existing = await db.siteSettings.findFirst()
  const data = {
    ...parsed.data,
    email: normalizeUrl(parsed.data.email) ? parsed.data.email : null,
    googleReviewUrl: normalizeUrl(parsed.data.googleReviewUrl),
    tripAdvisorUrl: normalizeUrl(parsed.data.tripAdvisorUrl),
  }

  if (existing) {
    await db.siteSettings.update({ where: { id: existing.id }, data })
  } else {
    await db.siteSettings.create({ data })
  }

  revalidatePublic()
  adminRedirect("/admin/settings", "Site settings saved.")
}

export async function createHeroSlideAction(formData: FormData) {
  await requireAdmin()
  const db = getPrisma()
  const title = asString(formData.get("title"))
  const image = formData.get("image")

  if (!title || !hasUploadedFile(image)) {
    adminRedirect("/admin/hero", "Title and desktop hero image are required.", "error")
  }

  const desktop = await createMediaAssetFromFile(image, {
    altText: title,
    type: MediaAssetType.HERO,
  })
  const mobileUpload = formData.get("mobileImage")
  const mobile = hasUploadedFile(mobileUpload)
    ? await createMediaAssetFromFile(mobileUpload, {
        altText: `${title} mobile hero image`,
        type: MediaAssetType.HERO,
      })
    : null

  await db.heroSlide.create({
    data: {
      title,
      subtitle: nullableString(formData.get("subtitle")),
      imageId: desktop.id,
      mobileImageId: mobile?.id,
      ctaText: nullableString(formData.get("ctaText")),
      ctaUrl: nullableString(formData.get("ctaUrl")),
      sortOrder: asOptionalInt(formData.get("sortOrder")) || 0,
      isActive: asBoolean(formData.get("isActive")),
    },
  })

  revalidatePublic()
  adminRedirect("/admin/hero", "Hero image uploaded and slide added.")
}

export async function updateHeroSlideAction(formData: FormData) {
  await requireAdmin()
  const db = getPrisma()
  const id = asString(formData.get("id"))
  const title = asString(formData.get("title"))
  if (!id || !title) adminRedirect("/admin/hero", "Missing hero slide details.", "error")

  const existing = await db.heroSlide.findUnique({
    where: { id },
    select: { imageId: true, mobileImageId: true },
  })
  if (!existing) adminRedirect("/admin/hero", "Hero slide not found.", "error")

  const data: any = {
    title,
    subtitle: nullableString(formData.get("subtitle")),
    ctaText: nullableString(formData.get("ctaText")),
    ctaUrl: nullableString(formData.get("ctaUrl")),
    sortOrder: asOptionalInt(formData.get("sortOrder")) || 0,
    isActive: asBoolean(formData.get("isActive")),
  }

  const replacedAssetIds: string[] = []
  const image = formData.get("image")
  if (hasUploadedFile(image)) {
    const asset = await createMediaAssetFromFile(image, {
      altText: title,
      type: MediaAssetType.HERO,
    })
    data.imageId = asset.id
    replacedAssetIds.push(existing.imageId)
  }

  const mobileImage = formData.get("mobileImage")
  if (hasUploadedFile(mobileImage)) {
    const asset = await createMediaAssetFromFile(mobileImage, {
      altText: `${title} mobile hero image`,
      type: MediaAssetType.HERO,
    })
    data.mobileImageId = asset.id
    if (existing.mobileImageId) replacedAssetIds.push(existing.mobileImageId)
  }

  await db.heroSlide.update({ where: { id }, data })
  await Promise.all(replacedAssetIds.map((assetId) => deleteUnusedMediaAsset(assetId)))
  revalidatePublic()
  adminRedirect(
    "/admin/hero",
    replacedAssetIds.length > 0
      ? "Hero image uploaded and slide updated."
      : "Hero slide updated.",
  )
}

export async function deleteHeroMobileImageAction(formData: FormData) {
  await requireAdmin()
  const db = getPrisma()
  const id = asString(formData.get("id"))
  const slide = await db.heroSlide.findUnique({
    where: { id },
    select: { mobileImageId: true },
  })

  if (!slide) adminRedirect("/admin/hero", "Hero slide not found.", "error")
  if (!slide.mobileImageId) {
    adminRedirect("/admin/hero", "This slide has no mobile image.", "error")
  }

  const mobileImageId = slide.mobileImageId
  await db.heroSlide.update({
    where: { id },
    data: { mobileImageId: null },
  })
  await deleteUnusedMediaAsset(mobileImageId)
  revalidatePublic()
  adminRedirect("/admin/hero", "Mobile hero image deleted.")
}

export async function deleteHeroSlideAction(formData: FormData) {
  await requireAdmin()
  const db = getPrisma()
  const id = asString(formData.get("id"))
  const slide = await db.heroSlide.findUnique({
    where: { id },
    select: { imageId: true, mobileImageId: true },
  })

  if (!slide) adminRedirect("/admin/hero", "Hero slide not found.", "error")

  await db.heroSlide.delete({ where: { id } })
  await Promise.all([
    deleteUnusedMediaAsset(slide.imageId),
    deleteUnusedMediaAsset(slide.mobileImageId),
  ])
  revalidatePublic()
  adminRedirect("/admin/hero", "Hero slide and uploaded images deleted.")
}

export async function createGalleryImageAction(formData: FormData) {
  await requireAdmin()
  const image = formData.get("image")
  if (!hasUploadedFile(image)) {
    adminRedirect("/admin/gallery", "Please choose a gallery image.", "error")
  }

  const title = nullableString(formData.get("title"))
  const altText = nullableString(formData.get("altText")) || title || "Kashmir travel gallery image"
  const asset = await createMediaAssetFromFile(image, {
    altText,
    caption: title,
    type: MediaAssetType.GALLERY,
  })

  await getPrisma().galleryImage.create({
    data: {
      imageId: asset.id,
      title,
      location: nullableString(formData.get("location")),
      altText,
      sortOrder: asOptionalInt(formData.get("sortOrder")) || 0,
      isActive: asBoolean(formData.get("isActive")),
    },
  })

  revalidatePublic()
  adminRedirect("/admin/gallery", "Gallery image added.")
}

export async function updateGalleryImageAction(formData: FormData) {
  await requireAdmin()
  const id = asString(formData.get("id"))
  const title = nullableString(formData.get("title"))
  const altText = nullableString(formData.get("altText"))

  await getPrisma().galleryImage.update({
    where: { id },
    data: {
      title,
      location: nullableString(formData.get("location")),
      altText,
      sortOrder: asOptionalInt(formData.get("sortOrder")) || 0,
      isActive: asBoolean(formData.get("isActive")),
    },
  })

  if (altText) {
    const imageId = asString(formData.get("imageId"))
    await getPrisma().mediaAsset.update({
      where: { id: imageId },
      data: { altText, caption: title },
    })
  }

  revalidatePublic()
  adminRedirect("/admin/gallery", "Gallery image updated.")
}

export async function deleteGalleryImageAction(formData: FormData) {
  await requireAdmin()
  const id = asString(formData.get("id"))
  await getPrisma().galleryImage.delete({ where: { id } })
  revalidatePublic()
  adminRedirect("/admin/gallery", "Gallery image removed.")
}

function readPackageForm(formData: FormData) {
  const title = asString(formData.get("title"))
  const slug = slugify(asString(formData.get("slug")) || title)
  const shortText = asString(formData.get("shortDescription"))

  const parsed = packageSchema.safeParse({
    title,
    slug,
    shortDescription: shortText,
    fullDescription: nullableString(formData.get("fullDescription")),
    itineraryUrl: nullableString(formData.get("itineraryUrl")) || "",
    location: nullableString(formData.get("location")),
    duration: nullableString(formData.get("duration")),
    priceStartingFrom: asOptionalInt(formData.get("priceStartingFrom")),
    metaTitle: nullableString(formData.get("metaTitle")) || shortDescription(title, 58),
    metaDescription:
      nullableString(formData.get("metaDescription")) || shortDescription(shortText, 158),
    canonicalUrl: nullableString(formData.get("canonicalUrl")) || "",
  })
  if (!parsed.success) {
    return {
      ok: false as const,
      state: formError(
        "Please fix the highlighted package fields.",
        fieldErrorsFromZod(parsed.error),
      ),
    }
  }

  return {
    ok: true as const,
    data: {
      ...parsed.data,
      canonicalUrl: normalizeUrl(parsed.data.canonicalUrl),
      itineraryUrl: normalizeUrl(parsed.data.itineraryUrl),
      galleryImageIds: formData.getAll("galleryImageIds").map(String),
      services: fieldToStringArray(formData.get("services")),
      highlights: fieldToStringArray(formData.get("highlights")),
      mustKnow: fieldToStringArray(formData.get("mustKnow")),
      inclusions: fieldToStringArray(formData.get("inclusions")),
      exclusions: fieldToStringArray(formData.get("exclusions")),
      itineraryJson: parseItinerary(formData.get("itinerary")),
      faqsJson: parseFaqs(formData.get("faqs")),
      keywords: fieldToStringArray(formData.get("keywords")),
      isFeatured: asBoolean(formData.get("isFeatured")),
      isPublished: asBoolean(formData.get("isPublished")),
    },
  }
}

export async function createPackageAction(
  _previousState: AdminFormState,
  formData: FormData,
) {
  await requireAdmin()
  const db = getPrisma()
  const parsed = readPackageForm(formData)
  if (!parsed.ok) return parsed.state

  const data = parsed.data
  const duplicate = await db.package.findUnique({ where: { slug: data.slug } })

  if (duplicate) {
    return formError("Please choose a unique package slug.", {
      slug: "A package with this slug already exists.",
    })
  }

  try {
    const coverImageId = await imageIdFromForm(
      formData,
      "coverImage",
      "coverImageId",
      MediaAssetType.PACKAGE,
      `${data.title} cover image`,
    )
    const ogImageId = await imageIdFromForm(
      formData,
      "ogImage",
      "ogImageId",
      MediaAssetType.OG_IMAGE,
      `${data.title} social preview`,
    )

    await db.package.create({
      data: {
        ...data,
        coverImageId,
        ogImageId,
        publishedAt: data.isPublished ? new Date() : null,
      },
    })
  } catch (error) {
    return formError(exceptionMessage(error, "Package could not be saved."))
  }

  revalidatePublic()
  adminRedirect("/admin/packages", "Package created.")
}

export async function updatePackageAction(
  _previousState: AdminFormState,
  formData: FormData,
) {
  await requireAdmin()
  const db = getPrisma()
  const id = asString(formData.get("id"))
  const parsed = readPackageForm(formData)
  if (!parsed.ok) return parsed.state

  const data = parsed.data
  const existing = await db.package.findUnique({ where: { id } })

  if (!existing) adminRedirect("/admin/packages", "Package not found.", "error")

  const duplicate = await db.package.findUnique({ where: { slug: data.slug } })
  if (duplicate && duplicate.id !== id) {
    return formError("Please choose a unique package slug.", {
      slug: "A package with this slug already exists.",
    })
  }

  try {
    const coverImageId = await imageIdFromForm(
      formData,
      "coverImage",
      "coverImageId",
      MediaAssetType.PACKAGE,
      `${data.title} cover image`,
    )
    const ogImageId = await imageIdFromForm(
      formData,
      "ogImage",
      "ogImageId",
      MediaAssetType.OG_IMAGE,
      `${data.title} social preview`,
    )

    await db.package.update({
      where: { id },
      data: {
        ...data,
        coverImageId,
        ogImageId,
        publishedAt: data.isPublished
          ? existing.publishedAt || new Date()
          : null,
      },
    })
  } catch (error) {
    return formError(exceptionMessage(error, "Package could not be saved."))
  }

  revalidatePublic()
  revalidatePath(`/packages/${existing.slug}`)
  revalidatePath(`/packages/${data.slug}`)
  adminRedirect("/admin/packages", "Package updated.")
}

export async function togglePackagePublishAction(formData: FormData) {
  await requireAdmin()
  const db = getPrisma()
  const id = asString(formData.get("id"))
  const pkg = await db.package.findUnique({ where: { id } })
  if (!pkg) adminRedirect("/admin/packages", "Package not found.", "error")

  await db.package.update({
    where: { id },
    data: {
      isPublished: !pkg.isPublished,
      publishedAt: !pkg.isPublished ? new Date() : null,
    },
  })

  revalidatePublic()
  revalidatePath(`/packages/${pkg.slug}`)
  adminRedirect("/admin/packages", pkg.isPublished ? "Package unpublished." : "Package published.")
}

export async function deletePackageAction(formData: FormData) {
  await requireAdmin()
  const db = getPrisma()
  const id = asString(formData.get("id"))
  const pkg = await db.package.findUnique({ where: { id } })
  if (!pkg) adminRedirect("/admin/packages", "Package not found.", "error")
  await db.package.delete({ where: { id } })
  revalidatePublic()
  revalidatePath(`/packages/${pkg.slug}`)
  adminRedirect("/admin/packages", "Package deleted.")
}

function readBlogForm(formData: FormData) {
  const title = asString(formData.get("title"))
  const slug = slugify(asString(formData.get("slug")) || title)
  const excerpt = asString(formData.get("excerpt"))

  const parsed = blogSchema.safeParse({
    title,
    slug,
    excerpt,
    content: nullableString(formData.get("content")),
    authorName: nullableString(formData.get("authorName")),
    category: nullableString(formData.get("category")),
    metaTitle: nullableString(formData.get("metaTitle")) || shortDescription(title, 58),
    metaDescription:
      nullableString(formData.get("metaDescription")) || shortDescription(excerpt, 158),
    canonicalUrl: nullableString(formData.get("canonicalUrl")) || "",
  })
  if (!parsed.success) {
    return {
      ok: false as const,
      state: formError(
        "Please fix the highlighted blog fields.",
        fieldErrorsFromZod(parsed.error),
      ),
    }
  }

  return {
    ok: true as const,
    data: {
      ...parsed.data,
      canonicalUrl: normalizeUrl(parsed.data.canonicalUrl),
      tags: fieldToStringArray(formData.get("tags")),
      faqsJson: parseFaqs(formData.get("faqs")),
      isPublished: asBoolean(formData.get("isPublished")),
    },
  }
}

export async function createBlogAction(
  _previousState: AdminFormState,
  formData: FormData,
) {
  await requireAdmin()
  const db = getPrisma()
  const parsed = readBlogForm(formData)
  if (!parsed.ok) return parsed.state

  const data = parsed.data
  const duplicate = await db.blog.findUnique({ where: { slug: data.slug } })

  if (duplicate) {
    return formError("Please choose a unique blog slug.", {
      slug: "A blog with this slug already exists.",
    })
  }

  try {
    const coverImageId = await imageIdFromForm(
      formData,
      "coverImage",
      "coverImageId",
      MediaAssetType.BLOG,
      `${data.title} cover image`,
    )
    const ogImageId = await imageIdFromForm(
      formData,
      "ogImage",
      "ogImageId",
      MediaAssetType.OG_IMAGE,
      `${data.title} social preview`,
    )

    await db.blog.create({
      data: {
        ...data,
        coverImageId,
        ogImageId,
        publishedAt: data.isPublished ? new Date() : null,
      },
    })
  } catch (error) {
    return formError(exceptionMessage(error, "Blog could not be saved."))
  }

  revalidatePublic()
  adminRedirect("/admin/blogs", "Blog created.")
}

export async function updateBlogAction(
  _previousState: AdminFormState,
  formData: FormData,
) {
  await requireAdmin()
  const db = getPrisma()
  const id = asString(formData.get("id"))
  const parsed = readBlogForm(formData)
  if (!parsed.ok) return parsed.state

  const data = parsed.data
  const existing = await db.blog.findUnique({ where: { id } })
  if (!existing) adminRedirect("/admin/blogs", "Blog not found.", "error")

  const duplicate = await db.blog.findUnique({ where: { slug: data.slug } })
  if (duplicate && duplicate.id !== id) {
    return formError("Please choose a unique blog slug.", {
      slug: "A blog with this slug already exists.",
    })
  }

  try {
    const coverImageId = await imageIdFromForm(
      formData,
      "coverImage",
      "coverImageId",
      MediaAssetType.BLOG,
      `${data.title} cover image`,
    )
    const ogImageId = await imageIdFromForm(
      formData,
      "ogImage",
      "ogImageId",
      MediaAssetType.OG_IMAGE,
      `${data.title} social preview`,
    )

    await db.blog.update({
      where: { id },
      data: {
        ...data,
        coverImageId,
        ogImageId,
        publishedAt: data.isPublished
          ? existing.publishedAt || new Date()
          : null,
      },
    })
  } catch (error) {
    return formError(exceptionMessage(error, "Blog could not be saved."))
  }

  revalidatePublic()
  revalidatePath(`/blogs/${existing.slug}`)
  revalidatePath(`/blogs/${data.slug}`)
  adminRedirect("/admin/blogs", "Blog updated.")
}

export async function toggleBlogPublishAction(formData: FormData) {
  await requireAdmin()
  const db = getPrisma()
  const id = asString(formData.get("id"))
  const blog = await db.blog.findUnique({ where: { id } })
  if (!blog) adminRedirect("/admin/blogs", "Blog not found.", "error")

  await db.blog.update({
    where: { id },
    data: {
      isPublished: !blog.isPublished,
      publishedAt: !blog.isPublished ? new Date() : null,
    },
  })

  revalidatePublic()
  revalidatePath(`/blogs/${blog.slug}`)
  adminRedirect("/admin/blogs", blog.isPublished ? "Blog unpublished." : "Blog published.")
}

export async function deleteBlogAction(formData: FormData) {
  await requireAdmin()
  const db = getPrisma()
  const id = asString(formData.get("id"))
  const blog = await db.blog.findUnique({ where: { id } })
  if (!blog) adminRedirect("/admin/blogs", "Blog not found.", "error")
  await db.blog.delete({ where: { id } })
  revalidatePublic()
  revalidatePath(`/blogs/${blog.slug}`)
  adminRedirect("/admin/blogs", "Blog deleted.")
}
