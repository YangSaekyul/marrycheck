'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

export default function ProfileSetup() {
  const { user, userProfile, updateProfile } = useAuth()
  const router = useRouter()

  const [activeTab, setActiveTab] = useState<'profile' | 'couple'>('profile')
  
  // 프로필 정보 (생년월일, 역할, 닉네임, 임시 애칭)
  const [gender, setGender] = useState(userProfile?.gender || '')
  const [birthdate, setBirthdate] = useState(userProfile?.birthdate || '')
  const [nickname, setNickname] = useState(userProfile?.nickname || '')
  const [role, setRole] = useState(userProfile?.role || 'bride')
  const [tempPartnerName, setTempPartnerName] = useState(userProfile?.temp_partner_name || '')
  
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [successMsg, setSuccessMsg] = useState('')

  // userProfile이 뒤늦게 로딩될 경우 대비
  useEffect(() => {
    if (userProfile) {
      setGender(userProfile.gender || '')
      setBirthdate(userProfile.birthdate || '')
      setNickname(userProfile.nickname || '')
      setRole(userProfile.role || 'bride')
      setTempPartnerName(userProfile.temp_partner_name || '')
    }
  }, [userProfile])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      await updateProfile({
        gender,
        birthdate,
        nickname,
        role,
        temp_partner_name: tempPartnerName
      } as any)
      setSuccessMsg('프로필이 성공적으로 저장되었습니다.')
      setTimeout(() => setSuccessMsg(''), 3000)
    } catch (error: any) {
      setError(error.message || '프로필 저장에 실패했습니다')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
          <div className="flex items-center justify-between mb-8">
            <button onClick={() => router.push('/')} className="text-gray-400 hover:text-gray-600">
               ← 뒤로가기
            </button>
            <h1 className="text-2xl font-bold text-gray-800">마이페이지</h1>
            <div className="w-8"></div> {/* 균형용 빈 블럭 */}
          </div>

          {/* 탭 네비게이션 */}
          <div className="flex border-b border-gray-200 mb-6">
            <button 
              onClick={() => setActiveTab('profile')}
              className={`flex-1 pb-3 font-semibold transition-colors ${activeTab === 'profile' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              내 프로필
            </button>
            <button 
               onClick={() => setActiveTab('couple')}
               className={`flex-1 pb-3 font-semibold transition-colors ${activeTab === 'couple' ? 'text-pink-600 border-b-2 border-pink-500' : 'text-gray-400 hover:text-gray-600'}`}
            >
              커플 연동 관리
            </button>
          </div>

          {activeTab === 'profile' ? (
            <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                성별
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setGender('female')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    gender === 'female'
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  👩‍💼 여성
                </button>
                <button
                  type="button"
                  onClick={() => setGender('male')}
                  className={`py-3 px-4 rounded-xl border-2 transition-all ${
                    gender === 'male'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  👨‍💼 남성
                </button>
              </div>
            </div>

            <div>
              <label htmlFor="birthdate" className="block text-sm font-medium text-gray-700 mb-2">
                생년월일
              </label>
              <input
                id="birthdate"
                type="date"
                value={birthdate}
                onChange={(e) => setBirthdate(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
              />
            </div>

            <div className="pt-2">
              <label htmlFor="nickname" className="block text-sm font-medium text-gray-700 mb-2">
                내 이름 (애칭)
              </label>
              <input
                id="nickname"
                type="text"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors"
                placeholder="지은"
              />
            </div>

            <div>
              <label htmlFor="tempPartnerName" className="block text-sm font-medium text-gray-700 mb-2">
                파트너 임시 애칭 (미연결 시 뜸)
              </label>
              <input
                id="tempPartnerName"
                type="text"
                value={tempPartnerName}
                onChange={(e) => setTempPartnerName(e.target.value)}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-pink-50/50"
                placeholder="민수"
              />
              <p className="text-xs text-gray-400 mt-2">
                * 파트너가 직접 앱에 가입하여 연결(매칭)되면, 이 이름 대신 파트너가 진짜로 설정한 닉네임으로 덮어씌워집니다.
              </p>
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl text-sm">
                {error}
              </div>
            )}
            {successMsg && (
              <div className="bg-green-50 border border-green-200 text-green-600 px-4 py-3 rounded-xl text-sm transition-opacity">
                {successMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !gender || !birthdate || !nickname || !tempPartnerName}
              className="w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white py-3 px-4 rounded-xl font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
            >
              {loading ? '저장 중...' : '프로필 수정 완료'}
            </button>
          </form>
          ) : (
            <div className="py-10 text-center space-y-4">
               {/* 커플 연동 탭 영역 (스켈레톤 구조) */}
               <div className="w-16 h-16 bg-pink-100 text-pink-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border-4 border-white shadow-sm">
                 💍
               </div>
               <h3 className="text-xl font-bold text-gray-800">우리의 고유 초대 코드</h3>
               <p className="text-gray-500 text-sm pb-4">상대방에게 이 코드를 전달해 데이터를 연결하세요.</p>
               
               <div className="bg-gray-100 p-4 rounded-2xl border border-gray-200 border-dashed cursor-pointer hover:bg-gray-200 transition-colors">
                  <span className="text-2xl font-mono font-bold text-gray-700 tracking-widest">
                    A1B2C3
                  </span>
               </div>
               
               <div className="pt-6">
                 <p className="text-sm font-semibold text-gray-600 mb-3">또는 받은 코드가 있으신가요?</p>
                 <div className="flex space-x-2">
                    <input type="text" placeholder="코드 붙여넣기" className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none uppercase font-mono tracking-widest text-sm" />
                    <button className="bg-gray-800 text-white px-5 rounded-xl font-medium hover:bg-gray-700 transition-colors whitespace-nowrap">
                       연결
                    </button>
                 </div>
               </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}