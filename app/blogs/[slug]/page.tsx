import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { Navbar } from "@/components/funzip/navbar"
import { Footer } from "@/components/funzip/footer"
import { FloatingActions } from "@/components/funzip/floating-actions"
import { Contact } from "@/components/funzip/contact"
import {
  getBlogBySlug,
  getPublishedBlogs,
  getPublishedPackages,
  getSiteSettings,
} from "@/lib/cms/queries"
import { markdownToHtml } from "@/lib/cms/markdown"
import { buildMetadata } from "@/lib/seo/metadata"
import {
  JsonLd,
  blogPostingSchema,
  breadcrumbSchema,
  faqSchema,
} from "@/lib/seo/schema"

export const revalidate = 3600

export async function generateStaticParams() {
  const blogs = await getPublishedBlogs()
  return blogs.map((blog) => ({ slug: blog.slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const [{ slug }, settings] = await Promise.all([params, getSiteSettings()])
  const blog = await getBlogBySlug(slug)
  if (!blog) return {}

  return buildMetadata({
    title: blog.metaTitle || blog.title,
    description: blog.metaDescription || blog.excerpt,
    path: `/blogs/${blog.slug}`,
    image: blog.ogImage || blog.coverImage,
    canonical: blog.canonicalUrl,
    keywords: blog.tags,
    settings,
  })
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [settings, packages, blog] = await Promise.all([
    getSiteSettings(),
    getPublishedPackages(),
    getBlogBySlug(slug),
  ])

  if (!blog) notFound()

  return (
    <main>
      <JsonLd
        data={[
          blogPostingSchema(blog),
          breadcrumbSchema([
            { name: "Home", url: "/" },
            { name: "Blogs", url: "/blogs" },
            { name: blog.title, url: `/blogs/${blog.slug}` },
          ]),
          faqSchema(blog.faqs),
        ].filter(Boolean) as any}
      />
      <Navbar />
      <article>
        <header className="relative min-h-[65svh] overflow-hidden px-5 pb-16 pt-36 text-white lg:px-8">
          <Image
            src={blog.coverImage.url}
            alt={blog.coverImage.alt}
            fill
            priority
            sizes="100vw"
            className="-z-10 object-cover"
          />
          <div className="absolute inset-0 -z-10 bg-gradient-to-b from-black/55 via-black/35 to-black/75" />
          <div className="mx-auto max-w-4xl">
            <Link href="/blogs" className="text-sm font-semibold text-white/85">
              Travel Journal
            </Link>
            <h1 className="mt-5 font-heading text-5xl font-semibold leading-tight sm:text-6xl">
              {blog.title}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-relaxed text-white/90">
              {blog.excerpt}
            </p>
            <p className="mt-5 text-sm text-white/75">
              {blog.authorName || "Funzip Travel Team"}
              {blog.publishedAt
                ? ` · ${new Date(blog.publishedAt).toLocaleDateString("en-IN")}`
                : ""}
            </p>
          </div>
        </header>

        <div className="mx-auto max-w-3xl px-5 py-16 lg:px-8">
          <div
            className="prose prose-neutral max-w-none prose-headings:font-heading prose-a:text-primary"
            dangerouslySetInnerHTML={{ __html: markdownToHtml(blog.content || blog.excerpt) }}
          />

          {blog.faqs.length ? (
            <section className="mt-12">
              <h2 className="font-heading text-3xl font-semibold">FAQs</h2>
              <div className="mt-5 space-y-4">
                {blog.faqs.map((faq) => (
                  <article key={faq.question} className="rounded-xl border border-border bg-card p-5">
                    <h3 className="font-semibold">{faq.question}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                      {faq.answer}
                    </p>
                  </article>
                ))}
              </div>
            </section>
          ) : null}
        </div>
      </article>

      <Contact settings={settings} sourcePage={`/blogs/${blog.slug}`} />
      <Footer settings={settings} packages={packages} />
      <FloatingActions settings={settings} />
    </main>
  )
}
