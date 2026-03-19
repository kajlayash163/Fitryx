import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: 'Fitryx — Find & Compare Premium Gyms',
  description: 'Discover, compare and choose the best gyms in your city. Fitryx brings every gym together in one premium platform.',
  generator: 'Fitryx',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark" data-scroll-behavior="smooth">
      <body className={`${inter.variable} font-sans antialiased`}>
        {children}
        <Toaster richColors theme="dark" />
      </body>
    </html>
  )
}
