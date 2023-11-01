import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Theme } from '@radix-ui/themes'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Roulette Casino Game',
  description: 'Developed By samuel Befikadu',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Theme>{children}</Theme>
      </body>
    </html>
  )
}
