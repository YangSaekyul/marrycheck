'use client'

import { useState, useEffect } from 'react'
import { useAuth } from '@/contexts/AuthContext'
import { useModal } from '@/contexts/ModalContext'
import { useRouter } from 'next/navigation'
import { createClient } from '@/utils/supabase/client'

export default function ProfileSetup() {
  const { user, userProfile, updateProfile } = useAuth()
  const { showAlert, showConfirm } = useModal()
  const router = useRouter()
  const supabase = createClient()

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

  // 커플 연동 관련 상태
  const [myInviteCode, setMyInviteCode] = useState('')
  const [inputCode, setInputCode] = useState('')
  const [linking, setLinking] = useState(false)
  const [weddingDate, setWeddingDate] = useState('') // 커플 공동 결혼일

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

  // 매직 링크(URL)을 통해 접속한 경우 초대 코드 자동 세팅
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const searchParams = new URLSearchParams(window.location.search)
      const code = searchParams.get('inviteCode')
      if (code && code.length === 6) {
        setInputCode(code.toUpperCase())
        setActiveTab('couple')
      }
    }
  }, [])

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

  // ------------- 커플 연동 관련 함수들 -------------
  
  // 1. 내 원래 초대코드 가져오거나 새로 발급받기
  const generateOrGetCode = async () => {
    try {
      setLinking(true)
      const { data, error } = await supabase.rpc('create_couple_and_get_code')
      if (error) throw error
      if (data) setMyInviteCode(data)
    } catch (err: any) {
      showAlert({ 
        title: '코드 발급 실패', 
        message: err.message || '알 수 없는 오류가 발생했습니다.' 
      })
    } finally {
      setLinking(false)
    }
  }

  // 탭 변경 시 이미 couple_id가 있다면 기존 코드 및 결혼일 불러오기 시도
  useEffect(() => {
    if (activeTab === 'couple' && userProfile?.couple_id) {
      const fetchCoupleData = async () => {
        const { data } = await supabase.from('couples').select('invite_code, wedding_date').eq('id', userProfile.couple_id).single()
        if (data) {
          setMyInviteCode(data.invite_code)
          if (data.wedding_date) setWeddingDate(data.wedding_date)
        }
      }
      fetchCoupleData()
    }
  }, [activeTab, userProfile?.couple_id])

  // 커플 정보(결혼일) 업데이트
  const handleUpdateCouple = async () => {
    if(!userProfile?.couple_id) return
    setLoading(true)
    const { error } = await supabase.from('couples').update({ wedding_date: weddingDate }).eq('id', userProfile.couple_id)
    if(error) {
       showAlert({ title: '오류', message: '저장에 실패했습니다: ' + error.message })
    } else {
       showAlert({ title: '저장 완료', message: '우리의 결혼일이 성공적으로 저장되었습니다. 🎉' })
    }
    setLoading(false)
  }

  // 2. 파트너 코드 입력 후 확인
  const handleCheckPartnerCode = async () => {
    if (!inputCode.trim()) return
    try {
      setLinking(true)
      const { data, error } = await supabase.rpc('get_partner_info_by_code', { p_invite_code: inputCode })
      if (error) throw error
      
      if (data) {
        showConfirm({
          title: '파트너를 찾았습니다! 👩‍❤️‍👨',
          message: `${data.nickname} 님과\n데이터를 연결하시겠습니까?`,
          confirmText: '동의 및 연결',
          onConfirm: () => handleConfirmLink(data.couple_id, data.nickname)
        })
      }
    } catch (err: any) {
      showAlert({ 
        title: '코드 조회 실패', 
        message: err.message || '상대방을 찾을 수 없습니다.' 
      })
    } finally {
      setLinking(false)
    }
  }

  // 3. 최종 연동 동의 (매칭 합체)
  const handleConfirmLink = async (partnerCoupleId: string, partnerNickname: string) => {
    try {
      setLinking(true)
      const { error: linkError } = await supabase.rpc('link_couple', { p_couple_id: partnerCoupleId })
      if (linkError) throw linkError
      
      showAlert({
        title: '연결 완료 🎉',
        message: `성공적으로 ${partnerNickname} 님과 연결되었습니다!`
      })
      
      // 알림 확인 후 이동
      setTimeout(() => {
        window.location.href = '/'
      }, 2000)

    } catch (err: any) {
      showAlert({
        title: '연결 오류',
        message: '연결 중 오류가 발생했습니다: ' + err.message
      })
    } finally {
      setLinking(false)
    }
  }

  // -------------------------------------------------

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
              커플 연동 및 설정
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
            <div className="py-6 text-center space-y-4 animate-in fade-in zoom-in duration-300">
               
               {/* 1. 커플 정보 (결혼일) 설정 */}
               {userProfile?.couple_id ? (
                  <div className="bg-pink-50/50 p-6 rounded-2xl border border-pink-100 mb-8 mt-2">
                     <h3 className="text-lg font-bold text-gray-800 mb-4 text-left">💍 우리의 결혼 예정일</h3>
                     <div className="flex space-x-2">
                       <input
                         type="date"
                         value={weddingDate}
                         onChange={(e) => setWeddingDate(e.target.value)}
                         className="flex-1 px-4 py-3 border border-pink-200 rounded-xl focus:ring-2 focus:ring-pink-500 focus:border-transparent transition-colors bg-white font-medium"
                       />
                       <button
                         onClick={handleUpdateCouple}
                         disabled={loading || !weddingDate}
                         className="px-6 py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600 transition-colors disabled:opacity-50 shadow-sm"
                       >
                         {loading ? '저장...' : '저장하기'}
                       </button>
                     </div>
                  </div>
               ) : (
                  <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100 mb-8 mt-2">
                     <p className="text-sm text-gray-500 font-medium">코드를 발급받아 커플 연동을 시작하세요!</p>
                  </div>
               )}

               <div className="w-16 h-16 bg-purple-100 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl border-4 border-white shadow-sm mt-8">
                 🔗
               </div>
               <h3 className="text-xl font-bold text-gray-800">우리의 고유 초대 코드</h3>
               <p className="text-gray-500 text-sm pb-4">상대방에게 이 코드를 전달해 데이터를 연결하세요.</p>
               
               <div 
                 onClick={myInviteCode ? undefined : generateOrGetCode}
                 className={`p-4 rounded-2xl border border-dashed transition-colors ${
                   myInviteCode ? 'bg-pink-50 border-pink-200' : 'bg-gray-100 border-gray-300 hover:bg-gray-200 cursor-pointer'
                 }`}
               >
                  {linking && !myInviteCode ? (
                    <span className="text-gray-500 font-medium tracking-wide">생성 중...</span>
                  ) : myInviteCode ? (
                    <span className="text-3xl font-mono font-bold text-pink-600 tracking-widest">{myInviteCode}</span>
                  ) : (
                    <span className="text-gray-500 font-medium">코드 생성하기 (터치)</span>
                  )}
               </div>
               {myInviteCode && (
                 <p className="text-xs text-pink-500 mt-2 font-medium cursor-pointer flex items-center justify-center gap-1 hover:text-pink-600" onClick={() => {
                   const inviteLink = `${window.location.origin}/profile?inviteCode=${myInviteCode}`;
                   navigator.clipboard.writeText(inviteLink);
                   showAlert('초대 링크가 복사되었습니다!\n상대방에게 카카오톡으로 보내주세요.');
                 }}>
                   초대 링크 복사하기 🔗
                 </p>
               )}
               
               <div className="pt-8 border-t border-gray-100 mt-8">
                 <p className="text-sm font-semibold text-gray-600 mb-3 block text-left">또는 받은 코드가 있으신가요?</p>
                 <div className="flex space-x-2">
                    <input 
                      type="text" 
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                      placeholder="코드 붙여넣기" 
                      className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-400 outline-none uppercase font-mono tracking-widest text-sm" 
                      maxLength={6}
                    />
                    <button 
                      onClick={handleCheckPartnerCode}
                      disabled={linking || inputCode.length < 6}
                      className="bg-gray-800 disabled:opacity-50 text-white px-6 rounded-xl font-medium hover:bg-gray-700 transition-colors whitespace-nowrap shadow-sm"
                    >
                       조회
                    </button>
                 </div>
               </div>
            </div>
          )}

          {/* 커스텀 모달은 RootLayout의 ModalProvider에서 전역 관리되므로 로컬 팝업 컴포넌트 전체 삭제 완료 */}
        </div>
      </div>
    </div>
  )
}