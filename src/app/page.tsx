'use client'

import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { ChevronRight, CalendarHeart, CheckCircle2, Wallet, ImageIcon, Settings } from 'lucide-react'
import Link from 'next/link'
import { createClient } from '@/utils/supabase/client'
import { parseSafeDate } from '@/utils/date'

export default function Home() {
  const { user, userProfile, loading, logout } = useAuth()
  const router = useRouter()
  const supabase = createClient()

  const [todoCount, setTodoCount] = useState(0)
  const [txCount, setTxCount] = useState(0)
  
  const [dDay, setDDay] = useState<string | null>(null)
  const [totalBudget, setTotalBudget] = useState(0)
  const [totalSpent, setTotalSpent] = useState(0)
  const [nextTodo, setNextTodo] = useState<{title: string} | null>(null)
  
  // 생일 관련 상태
  const [partnerBirthdate, setPartnerBirthdate] = useState<string | null>(null)

  // 1. 초기 라우팅 제어 (온보딩)
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login')
    } else if (!loading && user && userProfile && (!userProfile.gender || !userProfile.birthdate)) {
      router.push('/profile')
    }
  }, [user, userProfile, loading, router])

  // 2. 대시보드 브리핑 데이터(통계) 패칭
  useEffect(() => {
    if (!userProfile?.couple_id) return

    const fetchDashboardData = async () => {
      // 1) 커플 공통 정보 (결혼일, 총 예산) 패칭 및 D-Day 계산
      const { data: coupleData } = await supabase
        .from('couples')
        .select('wedding_date, total_budget')
        .eq('id', userProfile.couple_id)
        .single()
      
      if (coupleData) {
        setTotalBudget(coupleData.total_budget || 0)
        
        if (coupleData.wedding_date) {
          const target = parseSafeDate(coupleData.wedding_date)
          const today = new Date()
          if (target) {
            target.setHours(0, 0, 0, 0)
            today.setHours(0, 0, 0, 0)
            const diffTime = target.getTime() - today.getTime()
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
            
            if (diffDays > 0) setDDay(`D-${diffDays}`)
            else if (diffDays === 0) setDDay('D-Day')
            else setDDay(`D+${Math.abs(diffDays)}`)
          }
        }
      }

      // 1-1) 파트너 정보(생일 등) 가져오기
      const { data: partnerData } = await supabase
        .from('users')
        .select('birthdate, nickname')
        .eq('couple_id', userProfile.couple_id)
        .neq('id', user?.id || '')
        .single()
        
      if (partnerData?.birthdate) {
        setPartnerBirthdate(partnerData.birthdate)
      }

      // 2) 완료되지 않은 체크리스트 갯수 및 다음 일정(목록의 맨 앞 요소)
      const { data: tData, count: tCount } = await supabase
        .from('todos')
        .select('title', { count: 'exact' })
        .eq('couple_id', userProfile.couple_id)
        .eq('completed', false)
        .order('created_at', { ascending: true })
      
      setTodoCount(tCount || 0)
      if (tData && tData.length > 0) {
        setNextTodo({ title: tData[0].title })
      }

      // 3) 총 지출 건수 및 지출액 합산 (예산 남은 금액 표시용)
      const { data: txData, count: xCount } = await supabase
        .from('transactions')
        .select('amount', { count: 'exact' })
        .eq('couple_id', userProfile.couple_id)

      setTxCount(xCount || 0)
      if (txData) {
        const spent = txData.reduce((acc, curr) => acc + (curr.amount || 0), 0)
        setTotalSpent(spent)
      }
    }

    fetchDashboardData()
  }, [userProfile?.couple_id])

  if (loading || !user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500"></div>
      </div>
    )
  }

  const myName = userProfile?.nickname || '나'
  const partnerName = userProfile?.temp_partner_name || '파트너'

  const getBirthdayDday = (birthStr: string, name: string) => {
    if (!birthStr) return null
    const today = new Date()
    today.setHours(0,0,0,0)
    
    // 생일 문자열(ex: '1995-05-13') 에서 월,일만 추출해 올해 날짜로 만듦
    const bDate = parseSafeDate(birthStr)
    if (!bDate) return null
    
    let nextBday = new Date(today.getFullYear(), bDate.getMonth(), bDate.getDate())
    
    // 이미 지났으면 내년으로
    if (nextBday < today) {
      nextBday.setFullYear(today.getFullYear() + 1)
    }
    
    const diffTime = nextBday.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) return `🎉 오늘 ${name} 생일!`
    return `${name} 생일 D-${diffDays}`
  }

  const myBdayText = userProfile?.birthdate ? getBirthdayDday(userProfile.birthdate, myName) : null
  const partnerBdayText = partnerBirthdate ? getBirthdayDday(partnerBirthdate, partnerName) : null

  return (
    <main className="min-h-screen bg-gray-50 pb-20">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-pink-50 via-white to-purple-50 pt-12 pb-8 px-6 rounded-b-[2rem] shadow-sm">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">
              {myName} ❤️ {partnerName}
            </h1>
            <div className="mt-2 space-y-1">
              <p className="text-sm font-medium text-pink-600 flex items-center">
                 💍 {dDay ? `결혼식 ${dDay}` : '결혼 예정일을 설정해주세요'}
              </p>
              {myBdayText && <p className="text-xs font-semibold text-purple-500">🎂 {myBdayText}</p>}
              {partnerBdayText && <p className="text-xs font-semibold text-blue-500">🎁 {partnerBdayText}</p>}
            </div>
          </div>
          <div className="flex flex-col items-end space-y-2">
            <Link href="/profile" className="p-2 bg-white/50 hover:bg-white/80 rounded-full transition-colors">
              <Settings size={20} className="text-gray-600" />
            </Link>
            <button onClick={logout} className="text-xs text-gray-400 font-medium hover:text-gray-600">
              로그아웃
            </button>
          </div>
        </div>

        {/* Budget & Progress Card */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-pink-100/50">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium text-gray-600">우리의 예산 현황</span>
            <span className="text-lg font-bold text-pink-600">
              {totalBudget > 0 ? `${Math.round((totalSpent/totalBudget)*100)}%` : '0%'}
            </span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-3">
            <div 
              className="h-full bg-gradient-to-r from-pink-400 to-purple-400 rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${totalBudget > 0 ? Math.min((totalSpent/totalBudget)*100, 100) : 0}%` }}
            ></div>
          </div>
          <div className="flex justify-between text-xs">
             <span className="text-gray-500">총 예산: {totalBudget > 0 ? totalBudget.toLocaleString() + '원' : '미설정 (결혼 예산에서 설정)'}</span>
             <span className="text-pink-600 font-medium whitespace-nowrap pl-2">
               남은 예산: {totalBudget > 0 ? Math.max(totalBudget - totalSpent, 0).toLocaleString() + '원' : '-'}
             </span>
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
                <span className="text-sm font-medium text-gray-700">남은 할 일</span>
              </div>
              <p className="text-2xl font-bold text-gray-800">
                {todoCount}<span className="text-sm font-normal text-gray-400 ml-1">개</span>
              </p>
            </Link>

            <Link href="/budget" className="block bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:border-blue-200 transition-colors">
              <div className="flex items-center space-x-2 mb-2">
                <div className="p-2 bg-blue-50 rounded-xl">
                  <Wallet size={18} className="text-blue-500" />
                </div>
                <span className="text-sm font-medium text-gray-700">지출 건수</span>
              </div>
              <p className="text-2xl font-bold text-gray-800 text-transparent bg-clip-text bg-gradient-to-r from-gray-800 to-gray-600">
                {txCount}<span className="text-sm font-normal text-gray-400 ml-1">건</span>
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
              <div className="flex items-center space-x-3 w-[85%]">
                <div className="p-2.5 bg-orange-50 rounded-xl flex-shrink-0">
                  <CalendarHeart size={20} className="text-orange-500" />
                </div>
                <div className="truncate">
                  <h3 className="text-sm font-semibold text-gray-800">다음 우리의 미션</h3>
                  <p className="text-xs text-gray-500 mt-0.5 truncate">
                    {nextTodo ? nextTodo.title : '등록된 할 일이 없어요!'}
                  </p>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-400 flex-shrink-0" />
            </Link>
          </div>
        </section>
      </div>
    </main>
  )
}
