import Image from "next/image"
import { Camera, Globe, Video, AtSign, Phone, Mail, MapPin } from "lucide-react"
import type { PublicPackage, SiteSettingsPublic } from "@/lib/cms/types"
import { fallbackPackages, fallbackSettings } from "@/lib/cms/fallback-data"

const quickLinks = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blogs", href: "/blogs" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Contact", href: "/contact" },
]

const socials = [
  { icon: Camera, label: "Instagram" },
  { icon: Globe, label: "Facebook" },
  { icon: Video, label: "YouTube" },
  { icon: AtSign, label: "Twitter" },
]

export function Footer({
  settings = fallbackSettings,
  packages = fallbackPackages,
}: {
  settings?: SiteSettingsPublic
  packages?: PublicPackage[]
}) {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-12 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <a
              href="/"
              className="inline-flex rounded-2xl bg-white px-3 py-1 shadow-sm"
            >
              <Image
                src={settings.logoUrl || "/logoksh.svg"}
                alt={settings.siteName}
                width={140}
                height={80}
                className="h-14 w-auto"
              />
            </a>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-background/70">
              Your local Kashmir travel specialists, crafting handpicked
              journeys through the valley&apos;s most beautiful corners.
            </p>
            <div className="mt-5 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href="#"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-background/10 text-background transition-colors hover:bg-primary hover:text-primary-foreground"
                >
                  <s.icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold">Quick Links</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-sm text-background/70 transition-colors hover:text-primary"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold">Packages</h3>
            <ul className="mt-4 flex flex-col gap-2.5">
              {packages.slice(0, 6).map((pkg) => (
                <li key={pkg.slug}>
                  <a
                    href={`/packages/${pkg.slug}`}
                    className="text-sm text-background/70 transition-colors hover:text-primary"
                  >
                    {pkg.title}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-heading text-lg font-semibold">Get In Touch</h3>
            <ul className="mt-4 flex flex-col gap-3">
              <li className="flex items-center gap-2.5 text-sm text-background/70">
                <Phone className="h-4 w-4 text-primary" />
                {settings.phonePrimary || "+91 00000 00000"}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-background/70">
                <Mail className="h-4 w-4 text-primary" />
                {settings.email || "hello@funzip.travel"}
              </li>
              <li className="flex items-center gap-2.5 text-sm text-background/70">
                <MapPin className="h-4 w-4 text-primary" />
                {settings.address || "Kashmir, India"}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-background/15 pt-6 text-sm text-background/60 sm:flex-row">
          <p>&copy; {new Date().getFullYear()} Funzip. All rights reserved.</p>
          <p>Handcrafted Kashmir journeys, made with care.</p>
        </div>
      </div>
    </footer>
  )
}
