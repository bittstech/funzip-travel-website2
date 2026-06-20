"use client"

import { motion } from "motion/react"
import { Phone, MessageCircle } from "lucide-react"
import type { SiteSettingsPublic } from "@/lib/cms/types"
import { fallbackSettings } from "@/lib/cms/fallback-data"

export function FloatingActions({
  settings = fallbackSettings,
}: {
  settings?: SiteSettingsPublic
}) {
  const phone = settings.phonePrimary || "+91 00000 00000"
  const whatsapp = settings.whatsappNumber || "910000000000"

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1.2, duration: 0.5 }}
      className="fixed bottom-5 right-5 z-50 flex flex-col gap-3"
    >
      <a
        href={`https://wa.me/${whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="group relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-lg shadow-black/20 transition-transform hover:scale-110"
      >
        <span className="absolute inset-0 animate-ping rounded-full bg-[#25D366] opacity-30" />
        <MessageCircle className="relative h-6 w-6" />
      </a>
      <a
        href={`tel:${phone.replace(/\s/g, "")}`}
        aria-label="Call now"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-primary p-3.5 text-primary-foreground shadow-lg shadow-black/20 transition-transform hover:scale-110"
      >
        <Phone className="h-6 w-6" />
      </a>
    </motion.div>
  )
}
