import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Anime Avatar - AI Photo to Anime Converter',
  description: 'Transform your photo into stunning anime style avatar with AI. Free to try!',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
