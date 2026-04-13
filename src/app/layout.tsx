import type { Metadata, Viewport } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { Toaster } from 'react-hot-toast'
import './globals.css'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: '#16a34a', // tailwind green-600
}

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'),
  title: {
    default: 'Next.js Clean Architecture | Quản lý DataGrid',
    template: '%s | N-Starter',
  },
  description:
    'Hệ thống quản lý dữ liệu hiệu suất cao trang bị Atomic Design, Next.js App Router, Zod validation và React Data Grid.',
  keywords: ['Next.js', 'React', 'DataGrid', 'Atomic Design', 'Zod', 'Dashboard'],
  authors: [{ name: 'N-Starter Team' }],
  creator: 'N-Starter',
  openGraph: {
    type: 'website',
    locale: 'vi_VN',
    url: '/',
    title: 'Next.js Clean Architecture | Quản lý DataGrid',
    description:
      'Hệ thống quản lý dữ liệu hiệu suất cao trang bị Atomic Design, Next.js App Router, Zod validation và React Data Grid.',
    siteName: 'N-Starter Platform',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Next.js Clean Architecture | Quản lý DataGrid',
    description:
      'Hệ thống quản lý dữ liệu hiệu suất cao trang bị Atomic Design, Next.js App Router, Zod validation và React Data Grid.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="vi" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>
        {children}
        <Toaster position="top-center" />
      </body>
    </html>
  )
}
