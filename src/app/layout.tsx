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
        {/* Polyfill: .at() for older Safari/iOS (< 15.4) — required by @supabase/ssr */}
        <script dangerouslySetInnerHTML={{ __html: `
          if (!Array.prototype.at) {
            Array.prototype.at = function(n) {
              n = Math.trunc(n) || 0;
              if (n < 0) n += this.length;
              if (n < 0 || n >= this.length) return undefined;
              return this[n];
            };
          }
          if (!String.prototype.at) {
            String.prototype.at = function(n) {
              n = Math.trunc(n) || 0;
              if (n < 0) n += this.length;
              if (n < 0 || n >= this.length) return undefined;
              return this[n];
            };
          }
        `}} />
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