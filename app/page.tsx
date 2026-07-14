import { Navbar } from "@/components/funzip/navbar"
import { Hero } from "@/components/funzip/hero"
import { Story } from "@/components/funzip/story"
import { TravelerTypes } from "@/components/funzip/traveler-types"
import { Packages } from "@/components/funzip/packages"
import { HowItWorks } from "@/components/funzip/how-it-works"
import { Testimonials } from "@/components/funzip/testimonials"
import { Gallery } from "@/components/funzip/gallery"
import { Blogs } from "@/components/funzip/blogs"
import { Faqs } from "@/components/funzip/faqs"
import { Contact } from "@/components/funzip/contact"
import { FinalCta } from "@/components/funzip/final-cta"
import { Footer } from "@/components/funzip/footer"
import { FloatingActions } from "@/components/funzip/floating-actions"
import {
  getFeaturedPackages,
  getGalleryImages,
  getLatestBlogs,
  getSiteSettings,
} from "@/lib/cms/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  JsonLd,
  breadcrumbSchema,
  organizationSchema,
  websiteSchema,
} from "@/lib/seo/schema"

export const revalidate = 3600

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    title:
      settings.defaultMetaTitle ||
      "Funzip Kashmir Tour & Travels | Custom Packages by Native Experts",
    description:
      settings.defaultMetaDescription ||
      "Custom Kashmir trips crafted by native Kashmiri experts at direct local prices. Honeymoon, family, adventure & offbeat packages — hosted as guests, not customers.",
    path: "/",
    image: settings.defaultOgImage,
    settings,
  })
}

export default async function Page() {
  const [settings, packages, galleryImages, blogs] = await Promise.all([
    getSiteSettings(),
    getFeaturedPackages(6),
    getGalleryImages(8),
    getLatestBlogs(6),
  ])

  return (
    <main className="relative">
      <JsonLd
        data={[
          organizationSchema(settings),
          websiteSchema(settings),
          breadcrumbSchema([{ name: "Home", url: "/" }]),
        ]}
      />
      <Navbar />
      <Hero settings={settings} />
      <Story />
      <TravelerTypes />
      <Packages packages={packages} settings={settings} />
      <HowItWorks />
      <Testimonials />
      <Gallery images={galleryImages} />
      <Blogs blogs={blogs} />
      <Faqs />
      <Contact settings={settings} sourcePage="/" />
      <FinalCta />
      <Footer settings={settings} packages={packages} />
      <FloatingActions settings={settings} />
    </main>
  )
}
