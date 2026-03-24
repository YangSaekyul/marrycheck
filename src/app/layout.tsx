import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/contexts/AuthContext'
import { ModalProvider } from '@/contexts/ModalContext'
import BottomNav from '@/components/BottomNav'
import KakaoBrowserRedirect from '@/components/KakaoBrowserRedirect'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Marry Check',
  description: '결혼 준비의 모든 순간이 소중한 추억이 되도록',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko">
      <head>
        {/* Polyfill MUST load synchronously before Next.js async chunks */}
        <script src="/polyfill.js" />
      </head>
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <KakaoBrowserRedirect />
        <ModalProvider>
          <AuthProvider>
            <div className="mx-auto max-w-lg min-h-screen bg-white shadow-xl relative pb-16">

              {children}
              <BottomNav />
            </div>
          </AuthProvider>
        </ModalProvider>
      </body>
    </html>
  )
}