"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "motion/react"
import { ArrowUpRight, CalendarDays } from "lucide-react"
import { Reveal } from "./reveal"
import type { PublicBlog } from "@/lib/cms/types"
import { fallbackBlogs } from "@/lib/cms/fallback-data"

export function Blogs({ blogs = fallbackBlogs }: { blogs?: PublicBlog[] }) {
  return (
    <section id="blogs" className="relative py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Reveal className="max-w-2xl">
          <span className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">
            Travel Journal
          </span>
          <h2 className="mt-3 font-heading text-4xl font-semibold leading-tight text-balance sm:text-5xl lg:text-6xl">
            Stories & Travel Inspiration
          </h2>
          <p className="mt-4 max-w-xl text-pretty leading-relaxed text-muted-foreground">
            Tips, guides, and inspiration to help you plan an unforgettable
            Kashmir journey.
          </p>
        </Reveal>

        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {blogs.map((blog, i) => (
            <motion.article
              key={`${blog.id || blog.slug || blog.title}-${i}`}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.6, delay: (i % 3) * 0.1 }}
              className="group flex flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl"
            >
            <div className="relative h-48 overflow-hidden">
                <Image
                  src={blog.coverImage.url || "/placeholder.svg"}
                  alt={blog.coverImage.alt}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {blog.category}
                </span>
              </div>

              <div className="flex flex-1 flex-col p-6">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {blog.publishedAt
                    ? new Date(blog.publishedAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "2-digit",
                        year: "numeric",
                      })
                    : "Travel Guide"}
                </span>
                <h3 className="mt-3 font-heading text-2xl font-semibold leading-snug transition-colors group-hover:text-primary">
                  {blog.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {blog.excerpt}
                </p>
                <Link
                  href={`/blogs/${blog.slug}`}
                  className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary"
                >
                  Read More
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </Link>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  )
}
