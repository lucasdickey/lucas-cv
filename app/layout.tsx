import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Lucas Dickey - Product Leader & Serial Founder',
  description: '20+ years as PM and product leader. Co-founder at Fernish ($45M raised), Founder at DeepCast, Former Amazon MP3 PM ($0 to $300M). Expert in 0→1 and 1→10 execution.',
  generator: 'Lucas Dickey',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
