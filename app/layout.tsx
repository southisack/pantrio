import type { Metadata } from 'next'
import { Space_Grotesk, Epilogue } from 'next/font/google'
import './globals.css'

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-sans',
})

const epilogue = Epilogue({
  subsets: ['latin'],
  weight: ['800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-display',
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
      <body className={`${spaceGrotesk.variable} ${epilogue.variable}`}>
        {children}
      </body>
    </html>
  )
}
