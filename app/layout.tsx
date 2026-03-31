import type { Metadata } from 'next'
import { Space_Grotesk, Orelega_One, Outfit } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

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
      <body className={`${spaceGrotesk.variable} ${orelegaOne.variable} ${outfit.variable}`}>
        {children}
      </body>
    </html>
  )
}
