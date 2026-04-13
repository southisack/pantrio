import type { Metadata } from 'next'
import { Orelega_One, Outfit } from 'next/font/google'
import './globals.css'

const orelegaOne = Orelega_One({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-display',
})

const outfit = Outfit({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-ui',
})

export const metadata: Metadata = {
  title: 'Pantrio',
  description: 'What are you cooking with?',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${orelegaOne.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  )
}
