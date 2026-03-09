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
      <body className={`${inter.className} bg-gray-50 text-gray-900`}>
        <script
          dangerouslySetInnerHTML={{
             __html: `
               window.onerror = function(msg, url, line, col, error) {
                 var el = document.createElement('div');
                 el.style.cssText = 'position:fixed;top:0;left:0;right:0;background:red;color:white;z-index:9999;padding:10px;font-size:12px;overflow-wrap:break-word;word-break:break-all;';
                 el.innerHTML = 'Global Error: ' + msg + '<br/>Line: ' + line + '<br/>Col: ' + col + '<br/>Stack: ' + (error ? error.stack : '');
                 document.body.prepend(el);
               };
               
               var originalConsoleError = console.error;
               console.error = function() {
                 var args = Array.prototype.slice.call(arguments);
                 originalConsoleError.apply(console, args);
                 var el = document.createElement('div');
                 el.style.cssText = 'position:fixed;bottom:0;left:0;right:0;background:orange;color:black;z-index:9998;padding:10px;font-size:12px;max-height:30%;overflow:auto;word-break:break-all;';
                 el.innerHTML = 'Console Error: ' + args.map(a => typeof a === 'object' ? JSON.stringify(a) : a).join(' ');
                 document.body.append(el);
               };
             `
          }}
        />
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