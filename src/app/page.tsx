'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
          <p className="text-gray-600">로딩 중...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null // 리다이렉트 중
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('https://readdy.ai/api/search-image?query=romantic%20wedding%20preparation%20background%20with%20soft%20pink%20rose%20petals%20and%20delicate%20white%20flowers%20scattered%20on%20marble%20surface%20dreamy%20atmosphere%20warm%20lighting%20elegant%20minimal%20design&amp;width=1200&amp;height=800&amp;seq=hero-bg&amp;orientation=landscape')", backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        <div className="relative px-6 pt-8 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Header with Logout */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">Marry Check</h1>
                <p className="text-sm text-gray-600">결혼 준비를 함께해요 💕</p>
              </div>
              <button
                onClick={logout}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-sm font-medium transition-colors"
              >
                로그아웃
              </button>
            </div>

            {/* Couple Profiles */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="relative">
                    <img alt="지은" className="w-20 h-20 rounded-full border-4 border-pink-200 shadow-lg object-cover object-top" src="https://via.placeholder.com/80" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 font-semibold text-gray-800">지은</p>
                  <p className="text-sm text-pink-600">신부</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 font-medium">Together</div>
                </div>
                <div className="text-center">
                  <div className="relative">
                    <img alt="민수" className="w-20 h-20 rounded-full border-4 border-blue-200 shadow-lg object-cover object-top" src="https://via.placeholder.com/80" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 font-semibold text-gray-800">민수</p>
                  <p className="text-sm text-blue-600">신랑</p>
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div className="text-center mt-8 mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                환영합니다, {userProfile?.gender === 'female' ? '신부' : userProfile?.gender === 'male' ? '신랑' : '사용자'}님! 🎉
              </h2>
              <p className="text-gray-600">결혼 준비를 시작해보세요</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
