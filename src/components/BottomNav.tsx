'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Home, CheckSquare, Wallet, Camera } from 'lucide-react'

export default function BottomNav() {
  const pathname = usePathname()
  const { user, userProfile } = useAuth()

  // 로그인하지 않았거나, 프로필 설정 중이거나, 로그인 화면일 때는 탭바를 숨김
  if (!user || !userProfile?.gender || pathname === '/login' || pathname === '/profile') {
    return null
  }

  const navItems = [
    { href: '/', label: '대시보드', icon: Home },
    { href: '/checklist', label: '체크리스트', icon: CheckSquare },
    { href: '/budget', label: '예산현황', icon: Wallet },
    { href: '/story', label: '스토리', icon: Camera },
  ]

  return (
    <nav className="fixed bottom-0 left-0 right-0 max-w-lg mx-auto bg-white/80 backdrop-blur-md border-t border-gray-200 pb-safe shadow-[0_-4px_20px_-10px_rgba(0,0,0,0.1)] z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href))

          return (
            <Link
              key={item.href}
              href={item.href}
              className="relative flex flex-col items-center justify-center w-full h-full space-y-1 transition-colors duration-200"
            >
              <div
                className={`flex flex-col items-center justify-center w-12 h-12 rounded-xl transition-all duration-300 ${
                  isActive
                    ? 'text-pink-600'
                    : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                <Icon
                  size={isActive ? 24 : 22}
                  strokeWidth={isActive ? 2.5 : 2}
                  className={`transition-all duration-300 ${
                    isActive ? 'scale-110 drop-shadow-sm' : ''
                  }`}
                />
                <span
                  className={`mt-1 text-[10px] font-medium transition-all duration-300 ${
                    isActive ? 'opacity-100 scale-100' : 'opacity-70 scale-95'
                  }`}
                >
                  {item.label}
                </span>
                {isActive && (
                  <span className="absolute top-1 right-2 w-1.5 h-1.5 bg-pink-500 rounded-full" />
                )}
              </div>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
