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

const mapEmbedSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.305363851662!2d74.8345174755632!3d34.11293137313413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e18550f14035a3%3A0xd8474e2c549a4135!2sFunzip%20Kashmir%20Tour%20and%20Travels!5e0!3m2!1sen!2sin!4v1782034509916!5m2!1sen!2sin"

const mapDirectionsUrl =
  "https://www.google.com/maps/search/?api=1&query=Funzip%20Kashmir%20Tour%20and%20Travels"

export function Footer({
  settings = fallbackSettings,
  packages = fallbackPackages,
}: {
  settings?: SiteSettingsPublic
  packages?: PublicPackage[]
}) {
  return (
    <footer className="bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-16">
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
              {socials.map((s, socialIndex) => (
                <a
                  key={`${s.label}-${socialIndex}`}
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
              {quickLinks.map((link, linkIndex) => (
                <li key={`${link.href}-${linkIndex}`}>
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
              {packages.slice(0, 6).map((pkg, packageIndex) => (
                <li key={`${pkg.id || pkg.slug}-${packageIndex}`}>
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
            <h3 className="font-heading text-lg font-semibold">Get in Touch</h3>
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

        <div className="mt-12 overflow-hidden rounded-2xl border border-background/15 bg-background/5">
          <div className="grid gap-0 lg:grid-cols-[minmax(0,0.85fr)_minmax(360px,1.15fr)]">
            <div className="flex flex-col justify-center p-5 sm:p-6 lg:p-8">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
                Find Us
              </p>
              <h3 className="mt-2 font-heading text-2xl font-semibold text-background sm:text-3xl">
                Funzip Kashmir Tour & Travels
              </h3>
              <p className="mt-3 max-w-md text-sm leading-relaxed text-background/70">
                {settings.address || "Kashmir, India"}
              </p>
              <a
                href={mapDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-5 inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition-transform hover:scale-105"
              >
                <MapPin className="h-4 w-4" />
                Open Directions
              </a>
            </div>

            <div className="min-h-[260px] bg-background/10 p-2 sm:p-3">
              <iframe
                title="Funzip Kashmir Tour & Travels location"
                src={mapEmbedSrc}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                className="h-full min-h-[260px] w-full rounded-xl border-0 sm:min-h-[320px] lg:min-h-[360px]"
              />
            </div>
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
