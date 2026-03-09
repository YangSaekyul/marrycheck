'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { ChevronRight, CalendarHeart, CheckCircle2, Wallet, ImageIcon } from 'lucide-react'
import Link from 'next/link'

export default function Home() {
  const { user, userProfile, loading, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && userProfile && (!userProfile.gender || !userProfile.age)) {
      router.push('/profile')
    }
  }, [user, userProfile, loading, router])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-12 pb-8 px-6 rounded-b-[2rem] shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              {userProfile?.gender === 'female' ? '지은' : '민수'} ❤️ {userProfile?.gender === 'female' ? '민수' : '지은'}
            </h1>
            <p className="text-sm font-medium text-pink-600 mt-1">우리 결혼하는 날 D-120</p>
          </div>
          <button onClick={logout} className="text-xs text-gray-400 font-medium hover:text-gray-600">
            로그아웃
          </button>
        </div>

        {/* Progress Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100/50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">결혼 준비 진행률</span>
            <span className="text-lg font-bold text-pink-600">45%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-pink-400 to-purple-400 w-[45%] rounded-full transition-all duration-1000 ease-out"></div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-6 space-y-4">
        {/* Today's Briefing */}
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-800 flex items-center">
              오늘의 브리핑
            </h2>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            <Link href="/checklist" className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-pink-200 transition-colors">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-pink-50 rounded-xl">
                  <CheckCircle2 size={18} className="text-pink-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">할 일</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                3<span className="text-sm font-normal text-gray-400 ml-1">개</span>
              </p>
            </Link>

            <Link href="/budget" className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Wallet size={18} className="text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">예산 확인</span>
              </div>
              <p className="text-2xl font-bold text-gray-800 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                1<span className="text-sm font-normal text-gray-400 ml-1">건</span>
              </p>
            </Link>
          </div>
        </section>

        {/* Quick Menu */}
        <section className="pt-2">
          <h2 className="text-base font-bold text-gray-800 mb-3">바로가기</h2>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <Link href="/story" className="flex items-center justify-between p-4 border-b border-gray-50 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-purple-50 rounded-xl">
                  <ImageIcon size={20} className="text-purple-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">우리의 스토리 기록</h3>
                  <p className="text-xs text-gray-500 mt-0.5">상견례 사진 올려볼까요?</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
            
            <Link href="/checklist" className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-orange-50 rounded-xl">
                  <CalendarHeart size={20} className="text-orange-500" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-800">디데이 일정표</h3>
                  <p className="text-xs text-gray-500 mt-0.5">다음 주 드레스 가봉 일정 확인</p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
