import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Rivian News & Support Tracker',
  description: 'Track Rivian and Scout news, rumors, and support documentation changes',
  keywords: ['Rivian', 'Scout', 'electric vehicles', 'news', 'support', 'tracking'],
  authors: [{ name: 'Rivian News Tracker' }],
  openGraph: {
    title: 'Rivian News & Support Tracker',
    description: 'Track Rivian and Scout news, rumors, and support documentation changes',
    type: 'website',
    locale: 'en_US',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rivian News & Support Tracker',
    description: 'Track Rivian and Scout news, rumors, and support documentation changes',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  )
}
