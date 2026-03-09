'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { MessageCircle } from 'lucide-react'

export default function LoginForm() {
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const { user, userProfile, signInWithKakao } = useAuth()
  const router = useRouter()

  // 로그인 성공 시 통과 여부 확인 후 리다이렉트
  useEffect(() => {
    if (user) {
      if (userProfile && userProfile.role) {
        // 이미 롤(신부/신랑)이 정해진 완전한 가입자면 홈으로
        router.push('/')
      } else {
        // 처음 로그인한 유저면 온보딩(정보입력) 페이지로
        router.push('/onboarding')
      }
    }
  }, [user, userProfile, router])

  const handleKakaoLogin = async () => {
    setError('')
    setLoading(true)

    try {
      await signInWithKakao()
      // OAuth 리다이렉트가 발생하므로, 이하 코드는 사실상 도달하지 않음
    } catch (error: any) {
      setError(error.message || '카카오 로그인에 실패했습니다')
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex flex-col items-center justify-center px-6">
      <div className="max-w-md w-full flex flex-col items-center">
        
        {/* App Logo & Title */}
        <div className="text-center mb-12">
          <div className="w-20 h-20 bg-gradient-to-tr from-pink-400 to-purple-500 rounded-3xl mx-auto mb-6 shadow-lg flex items-center justify-center transform rotate-3">
             <span className="text-4xl">💍</span>
          </div>
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-purple-600 mb-3 tracking-tight">
            Marry Check
          </h1>
          <p className="text-gray-500 font-medium">우리의 결혼 준비를 하나의 공간에서</p>
        </div>

        {/* Login Form Box */}
        <div className="w-full bg-white/80 backdrop-blur-md rounded-[2rem] p-8 shadow-xl shadow-pink-100/50 border border-white">
          
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-2xl text-sm mb-6 text-center font-medium">
              {error}
            </div>
          )}

          <div className="space-y-4">
            <button
              onClick={handleKakaoLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-[#FEE500] hover:bg-[#FDD800] text-[#000000] py-4 px-6 rounded-2xl font-bold shadow-sm transition-all duration-200 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageCircle size={22} className="fill-current" />
              <span className="text-[17px]">카카오톡으로 3초 만에 시작하기</span>
            </button>
            <p className="text-xs text-center text-gray-400 mt-4 leading-relaxed">
              가입 시 Marry Check의 이용약관 및 <br/> 개인정보 처리방침에 동의하게 됩니다.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}