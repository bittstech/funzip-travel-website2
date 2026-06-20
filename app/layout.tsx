import { Analytics } from '@vercel/analytics/next'
import type { Metadata, Viewport } from 'next'
import { Geist } from 'next/font/google'
import { Geist_Mono } from 'next/font/google'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })
const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
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
      className={`${geistSans.variable} ${geistMono.variable} ${cormorant.variable} bg-background`}
    >
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
