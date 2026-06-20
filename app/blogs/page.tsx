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
      <section className="bg-secondary/40 px-5 pb-16 pt-32 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Travel Journal
          </p>
          <h1 className="mt-3 font-heading text-5xl font-semibold">
            Kashmir Travel Blog
          </h1>
          <p className="mt-4 max-w-2xl text-muted-foreground">
            Practical guides and inspiration for planning a beautiful Kashmir
            holiday.
          </p>
        </div>
      </section>

      <section className="px-5 py-16 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog) => (
            <article
              key={blog.id}
              className="group overflow-hidden rounded-xl border border-border bg-card"
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
              <div className="p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  {blog.category || "Kashmir Guide"}
                </p>
                <h2 className="mt-2 font-heading text-2xl font-semibold">
                  {blog.title}
                </h2>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {blog.excerpt}
                </p>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="mt-5 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Read More
                </Link>
              </div>
            </article>
          ))}
        </div>
      </section>

      <Footer settings={settings} packages={packages} />
      <FloatingActions settings={settings} />
    </main>
  )
}
