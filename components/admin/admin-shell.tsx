import Link from "next/link"
import {
  BarChart3,
  FileText,
  GalleryHorizontalEnd,
  Home,
  Image,
  Inbox,
  LogOut,
  Settings,
  Sparkles,
} from "lucide-react"
import { logoutAction } from "@/app/admin/actions"

const navItems = [
  { label: "Dashboard", href: "/admin", icon: BarChart3 },
  { label: "Hero Images", href: "/admin/hero", icon: Image },
  { label: "Gallery", href: "/admin/gallery", icon: GalleryHorizontalEnd },
  { label: "Packages", href: "/admin/packages", icon: Sparkles },
  { label: "Blogs", href: "/admin/blogs", icon: FileText },
  { label: "Leads", href: "/admin/leads", icon: Inbox },
  { label: "SEO Settings", href: "/admin/seo", icon: Home },
  { label: "Site Settings", href: "/admin/settings", icon: Settings },
]

export function AdminShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-border bg-card/90 p-5 lg:block">
        <Link href="/admin" className="block">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            Funzip CMS
          </p>
          <h1 className="mt-2 font-heading text-3xl font-semibold">
            Admin Panel
          </h1>
        </Link>

        <nav className="mt-8 flex flex-col gap-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-foreground/75 transition-colors hover:bg-secondary hover:text-foreground"
            >
              <item.icon className="h-4 w-4 text-primary" />
              {item.label}
            </Link>
          ))}
        </nav>

        <form action={logoutAction} className="absolute inset-x-5 bottom-5">
          <button
            type="submit"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-border px-4 py-2.5 text-sm font-semibold transition-colors hover:bg-secondary"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </form>
      </aside>

      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-border bg-background/85 px-5 py-4 backdrop-blur lg:hidden">
          <div className="flex items-center justify-between">
            <Link href="/admin" className="font-heading text-2xl font-semibold">
              Funzip CMS
            </Link>
            <form action={logoutAction}>
              <button
                type="submit"
                aria-label="Logout"
                className="rounded-full border border-border p-2"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </form>
          </div>
          <nav className="no-scrollbar mt-4 flex gap-2 overflow-x-auto">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="shrink-0 rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main className="mx-auto min-h-screen max-w-7xl px-5 py-8 lg:px-8">
          {children}
        </main>
      </div>
    </div>
  )
}
