import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Geist_Mono } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
import { getSiteUrl } from '@/lib/cms/utils'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})
const siteUrl = getSiteUrl()

const themeScript = `
(() => {
  try {
    const theme = localStorage.getItem("funzip-theme") === "dark" ? "dark" : "light";
    const root = document.documentElement;
    root.classList.toggle("dark", theme === "dark");
    root.classList.toggle("light", theme === "light");
    root.style.colorScheme = theme;
  } catch (_) {}
})();
`

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Funzip | Premium Kashmir Tour & Travel Packages',
  description:
    'Discover Kashmir with Funzip. Handcrafted Kashmir tour packages for families, couples, honeymooners, and adventure travelers. Hotels, transport, and sightseeing included.',
  keywords: [
    'Kashmir tour packages',
    'Srinagar Gulmarg Pahalgam',
    'Kashmir honeymoon package',
    'Gurez valley tour',
    'Kashmir family tour',
    'Funzip travel',
  ],
  applicationName: 'Funzip Kashmir Tour & Travels',
  alternates: {
    types: {
      'text/plain': '/llms.txt',
    },
  },
}

export const viewport: Viewport = {
  themeColor: '#f7f5fb',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} light bg-background`}
    >
      <body className="font-sans antialiased">
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
