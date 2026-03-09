'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/contexts/AuthContext'
import { Camera, Calendar as CalendarIcon, Heart, User as UserIcon } from 'lucide-react'

type Step = 'role' | 'date' | 'profile' | 'partner'

export default function OnboardingPage() {
  const router = useRouter()
  const { user, userProfile, updateProfile } = useAuth()
  
  const [step, setStep] = useState<Step>('role')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // 1. 역할 선택
  const [role, setRole] = useState<'bride' | 'groom' | null>(null)
  
  // 2. 결혼 날짜
  const [isDateKnown, setIsDateKnown] = useState<boolean>(true)
  const [weddingDate, setWeddingDate] = useState<string>('')
  
  // 3. 내 프로필 (카카오에서 가져온 기본값 세팅)
  const [nickname, setNickname] = useState(user?.user_metadata?.full_name || '')
  // Note: 카카오 프로필 이미지는 user.user_metadata.avatar_url 에 주로 담깁니다.
  const [profileImage, setProfileImage] = useState(user?.user_metadata?.avatar_url || '')
  
  // 4. 파트너 임시 애칭
  const [partnerName, setPartnerName] = useState('')

  const handleNextStep = async () => {
    if (step === 'role') {
      if (!role) return setError('역할을 선택해주세요.')
      setError('')
      setStep('date')
    } else if (step === 'date') {
      if (isDateKnown && !weddingDate) return setError('결혼 예정일을 선택해주세요.')
      setError('')
      setStep('profile')
    } else if (step === 'profile') {
      if (!nickname) return setError('이름이나 애칭을 적어주세요.')
      setError('')
      setStep('partner')
    } else if (step === 'partner') {
      if (!partnerName) return setError('상대방의 애칭을 적어주세요.')
      setError('')
      await submitOnboarding()
    }
  }

  const submitOnboarding = async () => {
    setLoading(true)
    setError('')
    try {
      // 1. 유저 메타데이터에 프로필 정보 갱신
      await updateProfile({
        role,
        nickname,
        profile_image: profileImage,
      })

      // 2. 이후 서버 액션 또는 DB Insert 로직 (향후 구현 예정)
      // fetch('/api/users/onboarding', { ... })

      // 완료 후 메인 홈 이동
      router.push('/')
    } catch (err: any) {
      console.error(err)
      setError(err.message || '정보 저장 중 문제가 발생했습니다.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-between pb-8">
      
      {/* Header Progress */}
      <div className="pt-12 px-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">기본 정보 입력</h1>
          <span className="text-sm font-medium text-purple-500">
            {step === 'role' ? '1/4' : step === 'date' ? '2/4' : step === 'profile' ? '3/4' : '4/4'}
          </span>
        </div>
        <div className="w-full bg-gray-200 h-2 rounded-full overflow-hidden">
          <div 
            className="bg-gradient-to-r from-pink-400 to-purple-500 h-full transition-all duration-300"
            style={{ 
              width: step === 'role' ? '25%' : step === 'date' ? '50%' : step === 'profile' ? '75%' : '100%' 
            }}
          />
        </div>
      </div>

      {/* Main Content Areas */}
      <div className="flex-1 px-6 pt-10">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-600 rounded-2xl text-sm text-center">
            {error}
          </div>
        )}

        {/* STEP 1: ROLE */}
        {step === 'role' && (
          <div className="space-y-6 animate-fade-in">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight leading-tight">
              어느 분이신가요? <br/>
              <span className="text-purple-600">환영합니다!</span>
            </h2>
            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                onClick={() => setRole('bride')}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${
                  role === 'bride' 
                  ? 'border-pink-400 bg-pink-50 text-pink-600 shadow-md' 
                  : 'border-gray-100 bg-white text-gray-400 hover:border-pink-200 hover:bg-pink-50/50'
                }`}
              >
                <span className="text-4xl">👰‍♀️</span>
                <span className="font-bold text-lg">신부</span>
              </button>
              <button 
                onClick={() => setRole('groom')}
                className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center space-y-3 transition-all ${
                  role === 'groom' 
                  ? 'border-blue-400 bg-blue-50 text-blue-600 shadow-md' 
                  : 'border-gray-100 bg-white text-gray-400 hover:border-blue-200 hover:bg-blue-50/50'
                }`}
              >
                <span className="text-4xl">🤵‍♂️</span>
                <span className="font-bold text-lg">신랑</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: DATE */}
        {step === 'date' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight leading-tight mb-2">
              결혼 예정일이 <br/>
              <span className="text-pink-600">언제인가요?</span>
            </h2>
            <p className="text-gray-500 mb-8">디데이를 계산해 유용한 알림을 드려요.</p>

            <div className="space-y-4">
              <button 
                onClick={() => setIsDateKnown(true)}
                className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${
                  isDateKnown ? 'border-purple-400 bg-purple-50' : 'border-gray-100 bg-white'
                }`}
              >
                <span className={`font-semibold ${isDateKnown ? 'text-purple-700' : 'text-gray-600'}`}>날짜가 정해졌어요</span>
                <input 
                  type="date"
                  disabled={!isDateKnown}
                  value={weddingDate}
                  onChange={(e) => setWeddingDate(e.target.value)}
                  className="bg-transparent text-gray-800 font-medium focus:outline-none"
                />
              </button>

              <button 
                onClick={() => {
                  setIsDateKnown(false)
                  setWeddingDate('')
                }}
                className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${
                  !isDateKnown ? 'border-purple-400 bg-purple-50 text-purple-700' : 'border-gray-100 bg-white text-gray-600'
                }`}
              >
                <span className="font-semibold text-lg">아직 고민 중이에요 (미정)</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: PROFILE */}
        {step === 'profile' && (
          <div className="space-y-6 animate-fade-in text-center">
            <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight leading-tight mb-8">
              프로필을 <br/>
              <span className="text-pink-500">확인해볼까요?</span>
            </h2>
            
            <div className="relative inline-block mb-4">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg bg-gray-100 mx-auto">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <UserIcon size={48} />
                  </div>
                )}
              </div>
              <button className="absolute bottom-0 right-0 p-3 bg-purple-500 text-white rounded-full shadow-lg hover:bg-purple-600 transition-colors">
                <Camera size={20} />
              </button>
            </div>

            <div className="text-left space-y-2 max-w-xs mx-auto">
              <label className="text-sm font-semibold text-gray-600 ml-1">내 이름 또는 애칭</label>
              <input 
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                placeholder="지은"
                className="w-full text-center text-xl font-bold py-4 px-6 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
              <p className="text-xs text-gray-400 text-center mt-2">
                카카오에서 가져온 프로필입니다. 원하시면 수정하실 수 있어요!
              </p>
            </div>
          </div>
        )}

        {/* STEP 4: PARTNER */}
        {step === 'partner' && (
          <div className="space-y-6 animate-fade-in">
             <h2 className="text-3xl font-extrabold text-gray-800 tracking-tight leading-tight">
              사랑하는 반려자의 <br/>
              <span className="text-pink-600">애칭은 무엇인가요?</span>
            </h2>
            <p className="text-gray-500 mb-8">상대방이 앱과 연결되기 전까지 화면에 표시될 이름이에요.</p>

            <div className="space-y-2">
              <input 
                type="text"
                value={partnerName}
                onChange={(e) => setPartnerName(e.target.value)}
                placeholder="예: 민수, 사랑하는 사람 등"
                className="w-full text-xl font-bold py-4 px-6 bg-pink-50 border border-pink-100 text-pink-700 placeholder-pink-300 rounded-2xl focus:ring-2 focus:ring-pink-400 focus:border-transparent transition-all"
              />
            </div>
            
            <div className="mt-8 p-5 bg-purple-50 rounded-2xl border border-purple-100 flex items-start space-x-3">
              <div className="p-2 bg-purple-100 rounded-full text-purple-500">
                <Heart size={20} />
              </div>
              <p className="text-sm text-purple-700 leading-relaxed font-medium">
                가입을 마치고 나면 상대방에게 <span className="font-bold underline">초대 코드</span>를 보내 두 분의 앱 데이터를 하나로 동기화 할 수 있습니다!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Button */}
      <div className="px-6 w-full">
        <button
          onClick={handleNextStep}
          disabled={loading}
          className="w-full bg-gray-900 text-white rounded-2xl py-4 font-bold text-lg hover:bg-gray-800 hover:shadow-lg transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? '처리 중...' : step === 'partner' ? 'Marry Check 시작하기 ✨' : '다음으로'}
        </button>
      </div>
    </div>
  )
}
