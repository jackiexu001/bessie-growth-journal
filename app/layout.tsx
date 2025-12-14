import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import './globals.css'
import Navigation from '@/components/Navigation'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

const playfair = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  weight: ['400', '700'],
})

export const metadata: Metadata = {
  title: 'Bessie 的成长日记',
  description: '记录宝宝成长的每一个珍贵瞬间',
  keywords: ['成长记录', '宝宝日记', '家庭相册'],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-CN" className={`${inter.variable} ${playfair.variable}`}>
      <body>
        <Navigation />
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  )
}

