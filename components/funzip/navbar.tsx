"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "motion/react"
import { MapPin, Menu, Moon, Sun, X } from "lucide-react"
import { cn } from "@/lib/utils"

const links = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Gallery", href: "/gallery" },
  { label: "Blogs", href: "/blogs" },
  { label: "FAQs", href: "/#faqs" },
  { label: "Contact", href: "/contact" },
]

const themeStorageKey = "funzip-theme"
const mapEmbedSrc =
  "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3303.305363851662!2d74.8345174755632!3d34.11293137313413!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38e18550f14035a3%3A0xd8474e2c549a4135!2sFunzip%20Kashmir%20Tour%20and%20Travels!5e0!3m2!1sen!2sin!4v1782034509916!5m2!1sen!2sin"

type ThemeMode = "light" | "dark"

function applyTheme(theme: ThemeMode) {
  const root = document.documentElement
  root.classList.toggle("dark", theme === "dark")
  root.classList.toggle("light", theme === "light")
  root.style.colorScheme = theme
}

export function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const [mapOpen, setMapOpen] = useState(false)
  const [theme, setTheme] = useState<ThemeMode>("light")

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    const savedTheme =
      window.localStorage.getItem(themeStorageKey) === "dark" ? "dark" : "light"
    setTheme(savedTheme)
    applyTheme(savedTheme)
  }, [])

  function toggleTheme() {
    setTheme((currentTheme) => {
      const nextTheme = currentTheme === "dark" ? "light" : "dark"
      window.localStorage.setItem(themeStorageKey, nextTheme)
      applyTheme(nextTheme)
      return nextTheme
    })
  }

  function closeMobileMenu() {
    setOpen(false)
    setMapOpen(false)
  }

  function renderThemeToggle() {
    return (
      <button
        type="button"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
        className={cn(
          "inline-flex h-10 w-10 items-center justify-center rounded-full border text-sm transition-colors",
          scrolled
            ? "border-border bg-background/85 text-foreground hover:bg-secondary"
            : "border-white/35 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
        )}
      >
        {theme === "dark" ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </button>
    )
  }

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-500",
        scrolled
          ? "border-b border-white/30 bg-background/70 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.06)]"
          : "border-b border-transparent bg-transparent",
      )}
    >
      <nav className="relative mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="/"
          className={cn(
            "flex items-center rounded-2xl bg-white/90 px-3 py-1 shadow-sm ring-1 ring-white/50 transition-all",
            scrolled ? "bg-white" : "backdrop-blur-md",
          )}
        >
          <Image
            src="/logoksh.svg"
            alt="Funzip"
            width={140}
            height={80}
            priority
            className="h-12 w-auto sm:h-14"
          />
        </a>

        <div className="hidden items-center gap-8 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={cn(
                "group relative text-sm font-medium transition-colors",
                scrolled
                  ? "text-foreground/80 hover:text-primary"
                  : "text-white/90 hover:text-white",
              )}
            >
              {link.label}
              <span className="absolute -bottom-1 left-0 h-0.5 w-0 bg-primary transition-all duration-300 group-hover:w-full" />
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <div className="relative">
            <button
              type="button"
              onClick={() => setMapOpen((value) => !value)}
              aria-expanded={mapOpen}
              className={cn(
                "inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-semibold transition-colors",
                scrolled
                  ? "border-border bg-background/85 text-foreground hover:bg-secondary"
                  : "border-white/35 bg-white/10 text-white backdrop-blur-md hover:bg-white/20",
              )}
            >
              <MapPin className="h-4 w-4" />
              Find Us
            </button>

            <AnimatePresence>
              {mapOpen ? (
                <motion.div
                  initial={{ y: -8, opacity: 0, scale: 0.98 }}
                  animate={{ y: 0, opacity: 1, scale: 1 }}
                  exit={{ y: -8, opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 top-14 w-[min(92vw,420px)] overflow-hidden rounded-2xl border border-border bg-background shadow-2xl shadow-foreground/15"
                >
                  <div className="p-3">
                    <div className="flex items-start justify-between gap-3 px-1 pb-3">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Funzip Kashmir Tour and Travels
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          Tap the map to open directions.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setMapOpen(false)}
                        aria-label="Close map"
                        className="rounded-full p-1 text-muted-foreground transition hover:bg-secondary hover:text-foreground"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="overflow-hidden rounded-xl bg-secondary">
                      <iframe
                        title="Funzip Kashmir Tour and Travels location"
                        src={mapEmbedSrc}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        className="aspect-[4/3] w-full border-0"
                      />
                    </div>
                  </div>
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          {renderThemeToggle()}
          <a
            href="/contact"
            className="inline-flex items-center rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
          >
            Plan My Trip
          </a>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          {renderThemeToggle()}
          <button
            type="button"
            aria-label="Toggle menu"
            onClick={() => {
              setOpen((value) => !value)
              setMapOpen(false)
            }}
            className={cn(
              "flex h-10 w-10 items-center justify-center rounded-full",
              scrolled ? "text-foreground" : "text-white",
            )}
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-white/30 bg-background/95 backdrop-blur-xl lg:hidden"
          >
            <div className="flex flex-col gap-1 px-4 py-4 sm:px-6">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={closeMobileMenu}
                  className="rounded-lg px-3 py-3 text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
                >
                  {link.label}
                </a>
              ))}
              <button
                type="button"
                onClick={() => setMapOpen((value) => !value)}
                aria-expanded={mapOpen}
                className="flex items-center justify-between rounded-lg px-3 py-3 text-left text-base font-medium text-foreground/80 transition-colors hover:bg-secondary hover:text-primary"
              >
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-primary" />
                  Find Us on Map
                </span>
                <span className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  {mapOpen ? "Hide" : "Open"}
                </span>
              </button>
              <AnimatePresence initial={false}>
                {mapOpen ? (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25 }}
                    className="overflow-hidden"
                  >
                    <div className="mx-3 mb-2 overflow-hidden rounded-2xl border border-border bg-card p-2 shadow-sm">
                      <iframe
                        title="Funzip Kashmir Tour and Travels location"
                        src={mapEmbedSrc}
                        loading="lazy"
                        allowFullScreen
                        referrerPolicy="no-referrer-when-downgrade"
                        className="aspect-[4/3] w-full rounded-xl border-0"
                      />
                    </div>
                  </motion.div>
                ) : null}
              </AnimatePresence>
              <a
                href="/contact"
                onClick={closeMobileMenu}
                className="mt-2 inline-flex items-center justify-center rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground"
              >
                Plan My Trip
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
