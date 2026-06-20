"use server"

import { revalidatePath } from "next/cache"
import { getPrisma } from "@/lib/cms/prisma"
import { asOptionalInt, asString, nullableString } from "@/lib/cms/utils"
import { leadSchema } from "@/lib/cms/validation"

export type LeadFormState = {
  ok: boolean
  message: string
}

export async function createLeadAction(
  _prevState: LeadFormState,
  formData: FormData,
): Promise<LeadFormState> {
  const parsed = leadSchema.safeParse({
    name: asString(formData.get("name")),
    phone: asString(formData.get("phone")),
    travelLocation:
      nullableString(formData.get("travelLocation")) ||
      nullableString(formData.get("travelMonth")),
    numberOfPeople: asOptionalInt(formData.get("numberOfPeople")),
    sourcePage: asString(formData.get("sourcePage")) || "/",
    sourceType: asString(formData.get("sourceType")) || "contact_form",
    message: nullableString(formData.get("message")),
  })

  if (!parsed.success) {
    return {
      ok: false,
      message: parsed.error.issues[0]?.message || "Please check your details.",
    }
  }

  try {
    await getPrisma().lead.create({ data: parsed.data })
    revalidatePath("/admin/leads")
  } catch (error) {
    if (process.env.NODE_ENV === "development") {
      console.warn("[lead] Could not save lead:", error)
    }
  }

  return {
    ok: true,
    message:
      "Your enquiry has been received. Our Kashmir travel experts will reach out shortly.",
  }
}
