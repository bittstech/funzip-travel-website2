import { Navbar } from "@/components/funzip/navbar"
import { Hero } from "@/components/funzip/hero"
import { Packages } from "@/components/funzip/packages"
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
  getHeroSlides,
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
      "Funzip Kashmir Tour & Travels | Premium Kashmir Packages",
    description:
      settings.defaultMetaDescription ||
      "Discover Kashmir with Funzip. Handcrafted tour packages for families, couples, honeymooners, and adventure travelers.",
    path: "/",
    image: settings.defaultOgImage,
    settings,
  })
}

export default async function Page() {
  const [settings, heroSlides, packages, galleryImages, blogs] =
    await Promise.all([
      getSiteSettings(),
      getHeroSlides(),
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
      <Hero slides={heroSlides} />
      <Packages packages={packages} />
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
