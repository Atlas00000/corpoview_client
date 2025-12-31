import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import ErrorTrackingProvider from '@/components/providers/ErrorTrackingProvider'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
  weight: ['400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'CorpoView - Corporate Data Storytelling Dashboard',
  description: 'A comprehensive business intelligence dashboard that visualizes real-time business, financial, and market data',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className={`h-full ${inter.variable} ${jetbrainsMono.variable}`}>
      <body className="h-full font-sans">
        <ErrorTrackingProvider>
          {children}
        </ErrorTrackingProvider>
      </body>
    </html>
  )
}

