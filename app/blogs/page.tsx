import Image from "next/image"
import Link from "next/link"
import { Navbar } from "@/components/funzip/navbar"
import { Footer } from "@/components/funzip/footer"
import { FloatingActions } from "@/components/funzip/floating-actions"
import { getPublishedBlogs, getPublishedPackages, getSiteSettings } from "@/lib/cms/queries"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  JsonLd,
  blogCollectionSchema,
  breadcrumbSchema,
} from "@/lib/seo/schema"

export const revalidate = 3600

export async function generateMetadata() {
  const settings = await getSiteSettings()
  return buildMetadata({
    title: "Kashmir Travel Blog",
    description:
      "Read Kashmir travel tips, destination guides, honeymoon planning advice, and itinerary inspiration from Funzip.",
    path: "/blogs",
    image: settings.defaultOgImage,
    settings,
  })
}

export default async function BlogsPage() {
  const [settings, blogs, packages] = await Promise.all([
    getSiteSettings(),
    getPublishedBlogs(),
    getPublishedPackages(),
  ])
  const heroImage = blogs[0]?.coverImage || {
    url: settings.defaultOgImage || "/images/gardens.png",
    alt: "Kashmir travel blog",
  }

  return (
    <main>
      <JsonLd
        data={[
          blogCollectionSchema(blogs),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blogs", url: "/blogs" },
          ]),
        ]}
      />
      <Navbar />
      <section className="relative isolate min-h-[52svh] overflow-hidden bg-black px-4 pb-16 pt-36 text-white sm:px-6 lg:px-8">
        <Image
          src={heroImage.url}
          alt={heroImage.alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 z-0 bg-gradient-to-b from-black/65 via-black/45 to-black/80" />
        <div className="relative z-10 mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-white/80">
            Travel Journal
          </p>
          <h1 className="mt-3 font-heading text-5xl font-semibold">
            Kashmir Travel Blog
          </h1>
          <p className="mt-4 max-w-2xl text-white/85">
            Practical guides and inspiration for planning a beautiful Kashmir
            holiday.
          </p>
        </div>
      </section>

      <section className="px-4 py-16 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.length === 0 ? (
            <div className="col-span-full flex min-h-[300px] flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 text-center">
              <p className="text-lg font-semibold text-muted-foreground">No blog posts published yet.</p>
              <p className="mt-2 text-sm text-muted-foreground">Check back soon for travel guides and inspiration.</p>
            </div>
          ) : (
            blogs.map((blog) => (
              <article
                key={blog.id}
                className="group flex min-w-0 flex-col overflow-hidden rounded-xl border border-border bg-card"
              >
                <div className="relative h-56 overflow-hidden">
                  <Image
                    src={blog.coverImage.url}
                    alt={blog.coverImage.alt}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </div>
                <div className="flex min-w-0 flex-1 flex-col p-5">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                    {blog.category || "Kashmir Guide"}
                  </p>
                  <h2 className="mt-2 line-clamp-2 font-heading text-2xl font-semibold">
                    {blog.title}
                  </h2>
                  <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-muted-foreground">
                    {blog.excerpt}
                  </p>
                  <Link
                    href={`/blogs/${blog.slug}`}
                    className="mt-auto inline-flex rounded-full bg-primary px-4 py-2 pt-5 text-sm font-semibold text-primary-foreground"
                  >
                    Read More
                  </Link>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      <Footer settings={settings} packages={packages} />
      <FloatingActions settings={settings} />
    </main>
  )
}
