"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays } from "lucide-react"
import { Reveal } from "./reveal"
import type { PublicBlog } from "@/lib/cms/types"
import { fallbackBlogs } from "@/lib/cms/fallback-data"

export function Blogs({ blogs = fallbackBlogs }: { blogs?: PublicBlog[] }) {
  const scrollerRef = useRef<HTMLDivElement>(null)

  const scrollBy = (dir: number) => {
    const el = scrollerRef.current
    if (!el) return
    const amount = el.clientWidth * 0.8
    el.scrollBy({ left: dir * amount, behavior: "smooth" })
  }

  return (
    <section id="blogs" className="relative overflow-hidden py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
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

          <div className="hidden gap-3 md:flex">
            <button
              type="button"
              aria-label="Previous blogs"
              onClick={() => scrollBy(-1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              aria-label="Next blogs"
              onClick={() => scrollBy(1)}
              className="flex h-12 w-12 items-center justify-center rounded-full border border-border bg-card text-foreground transition-colors hover:bg-primary hover:text-primary-foreground"
            >
              <ArrowRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div
          ref={scrollerRef}
          className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto pb-4 sm:gap-6"
        >
          {blogs.map((blog, i) => (
            <article
              key={`${blog.id || blog.slug || blog.title}-${i}`}
              className="group flex w-[min(84vw,20rem)] shrink-0 snap-start flex-col overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-xl sm:w-80 lg:w-[21.25rem]"
            >
              <div className="relative h-48 overflow-hidden">
                <Image
                  src={blog.coverImage.url || "/placeholder.svg"}
                  alt={blog.coverImage.alt}
                  fill
                  sizes="(min-width: 1024px) 340px, 300px"
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <span className="absolute left-3 top-3 rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-secondary-foreground">
                  {blog.category || "Kashmir Guide"}
                </span>
              </div>

              <div className="flex min-w-0 flex-1 flex-col p-5 sm:p-6">
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
                <h3 className="mt-3 font-heading text-2xl font-semibold leading-snug break-words transition-colors group-hover:text-primary">
                  {blog.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground break-words">
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
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
