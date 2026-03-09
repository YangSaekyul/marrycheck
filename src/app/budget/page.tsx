'use client'

import { useState, useEffect } from 'react'
import { Plus, Wallet2, TrendingUp, AlertCircle, ShoppingBag, Utensils, Home as HomeIcon, Video, Settings2 } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'

// 고정 카테고리 목록
const CATEGORIES = [
  { name: '예식장', icon: Utensils, color: 'bg-orange-100 text-orange-600', allocated: 25000000 },
  { name: '스드메', icon: Video, color: 'bg-pink-100 text-pink-600', allocated: 5000000 },
  { name: '혼수', icon: HomeIcon, color: 'bg-blue-100 text-blue-600', allocated: 15000000 },
  { name: '기타', icon: ShoppingBag, color: 'bg-purple-100 text-purple-600', allocated: 5000000 },
]

interface Transaction {
  id: string
  title: string
  amount: number
  category: string
  date: string
}

export default function BudgetPage() {
  const { userProfile } = useAuth()
  const supabase = createClient()

  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [totalSpent, setTotalSpent] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  // 1. 총 예산 상태 (DB 연동 또는 기본값)
  const [totalBudget, setTotalBudget] = useState(50000000)
  const [isSettingBudget, setIsSettingBudget] = useState(false)
  const [newBudgetStr, setNewBudgetStr] = useState('')

  // 2. 새 지출 폼 상태
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newAmount, setNewAmount] = useState('')
  const [selectedCategory, setSelectedCategory] = useState(CATEGORIES[3].name)

  const fetchTransactions = async () => {
    if (!userProfile?.couple_id) {
      setIsLoading(false)
      return
    }
    setIsLoading(true)

    // A. 예산 정보 불러오기 시도 (total_budget 컬럼이 없다면 fallback 발동)
    const { data: coupleData, error: coupleErr } = await supabase
      .from('couples')
      .select('total_budget')
      .eq('id', userProfile.couple_id)
      .single()
      
    if (!coupleErr && coupleData?.total_budget) {
      setTotalBudget(coupleData.total_budget)
    }

    // B. 거래 내역 불러오기
    const { data, error } = await supabase
      .from('transactions')
      .select('*')
      .eq('couple_id', userProfile.couple_id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (data && !error) {
      setTransactions(data)
      const spent = data.reduce((acc, curr) => acc + (curr.amount || 0), 0)
      setTotalSpent(spent)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    if (userProfile !== undefined) {
      fetchTransactions()
    }
  }, [userProfile?.couple_id])

  // 총 예산 수정 제출
  const handleUpdateBudget = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userProfile?.couple_id) return

    const newBudget = parseInt(newBudgetStr.replace(/,/g, ''), 10)
    if (isNaN(newBudget) || newBudget <= 0) {
      alert('숫자로 된 올바른 총 예산 금액을 입력하세요.')
      return
    }

    // DB 업데이트 시도
    const { error } = await supabase
      .from('couples')
      .update({ total_budget: newBudget })
      .eq('id', userProfile.couple_id)

    if (error) {
      alert('저장 실패 (DB에 total_budget 컬럼이 필요합니다): ' + error.message)
      // UI 강제 반영
      setTotalBudget(newBudget)
    } else {
      setTotalBudget(newBudget)
    }
    setIsSettingBudget(false)
  }

  // 지출 내역 추가
  const handleAddTransaction = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newAmount) {
      alert('지출처와 금액을 모두 입력해주세요.')
      return
    }
    if (!userProfile?.couple_id) {
       alert('데이터 동기화가 필요합니다. 화면을 새로고침(F5)하시거나, 로그아웃 후 다시 로그인해주세요!')
       return
    }

    const amountNum = parseInt(newAmount.replace(/,/g, ''), 10)
    if (isNaN(amountNum) || amountNum <= 0) {
      alert('올바른 금액을 입력하세요.')
      return
    }

    const { error } = await supabase
      .from('transactions')
      .insert({
        couple_id: userProfile.couple_id,
        title: newTitle,
        amount: amountNum,
        category: selectedCategory,
        type: 'expense',
        date: new Date().toISOString().split('T')[0] // 오늘 날짜
      })

    if (error) {
      alert('저장 실패 (네트워크/DB 권한 확인): ' + error.message)
    } else {
      setNewTitle('')
      setNewAmount('')
      setIsAdding(false)
      fetchTransactions() // 목록 갱신
    }
  }

  const percentSpent = totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-12 pb-24 rounded-b-[2.5rem] shadow-md relative">
        <h1 className="text-2xl font-bold text-white mb-6">스마트 예산 관리</h1>
        
        <div className="flex justify-between items-center mb-1">
          <div className="text-white/80 text-sm font-medium">총 결혼 예산</div>
          <button 
             onClick={() => {
                setNewBudgetStr(totalBudget.toString())
                setIsSettingBudget(true)
             }}
             className="text-white/70 hover:text-white transition-colors"
          >
             <Settings2 size={16} />
          </button>
        </div>
        <div className="text-3xl font-bold text-white mb-6 flex items-center">
          {formatCurrency(totalBudget)}
        </div>

        {/* Floating Summary Card */}
        <div className="absolute left-6 right-6 -bottom-16 bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">현재까지 지출</div>
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(totalSpent)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg mb-1 inline-block">남은 예산</div>
              <div className="text-sm font-bold text-gray-600">{formatCurrency(Math.max(0, totalBudget - totalSpent))}</div>
            </div>
          </div>
          
          <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden">
            <div 
              className="absolute left-0 top-0 h-full bg-gradient-to-r from-blue-400 to-indigo-500 rounded-full transition-all duration-1000"
              style={{ width: `${percentSpent}%` }}
            />
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-400 font-medium">
            <span>0%</span>
            <span>{percentSpent}% (적정 수준)</span>
            <span>100%</span>
          </div>
        </div>
      </div>

      <div className="pt-24 px-6 space-y-6">
        
        {/* Category Breakdown */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">카테고리별 현황</h2>
            <button className="text-sm text-blue-500 font-medium hover:text-blue-600">수정</button>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CATEGORIES.map(cat => {
              // 카테고리별 지출액 합산
              const catSpent = transactions
                .filter(t => t.category.includes(cat.name) || cat.name.includes(t.category))
                .reduce((acc, curr) => acc + curr.amount, 0)
              
              const catPercent = Math.round((catSpent / cat.allocated) * 100)
              const Icon = cat.icon
              return (
                <div key={cat.name} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{formatCurrency(catSpent)} 사용</p>
                  
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all ${catPercent > 100 ? 'bg-red-500' : 'bg-gray-800'}`}
                      style={{ width: `${Math.min(catPercent, 100)}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* Recent Transactions */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800">최근 지출 내역</h2>
            <button className="text-sm text-gray-500 font-medium hover:text-gray-700">전체보기</button>
          </div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden min-h-[140px]">
            {isLoading ? (
              <div className="p-8 text-center text-sm text-gray-400 animate-pulse flex flex-col items-center justify-center h-full space-y-2">
                 <span>데이터를 불러오는 중...</span>
              </div>
            ) : transactions.length === 0 ? (
              <div className="p-12 text-center bg-gray-50/50 flex flex-col items-center justify-center h-full">
                 <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-4 text-blue-500">
                   <Wallet2 size={24} />
                 </div>
                 <p className="text-gray-800 font-bold text-lg mb-2">아직 지출 내역이 없어요!</p>
                 <p className="text-sm text-gray-500 mb-6">첫 번째 지출 기록을 추가하고<br/>우리 커플의 예산 관리를 시작해보세요.</p>
                 <button 
                   onClick={() => setIsAdding(true)}
                   className="inline-flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors shadow-sm"
                 >
                   <Plus size={18} />
                   <span>첫 지출 기록하기</span>
                 </button>
              </div>
            ) : (
              transactions.map((tx, idx) => (
                <div key={tx.id} className={`flex items-center justify-between p-4 ${idx !== transactions.length -1 ? 'border-b border-gray-50' : ''}`}>
                  <div className="flex items-center space-x-4">
                    <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                      <TrendingUp size={18} className="text-gray-400" />
                    </div>
                    <div>
                      <h4 className="text-sm font-semibold text-gray-800">{tx.title}</h4>
                      <p className="text-xs text-gray-400 mt-0.5">{tx.date} • {tx.category}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-gray-700">
                    -{formatCurrency(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </section>
      </div>

       {/* 1. 예산 설정 모달 */}
       {isSettingBudget && (
         <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm">
           <form onSubmit={handleUpdateBudget} className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
              <h3 className="text-lg font-bold text-gray-800 mb-4">총 예산 수정</h3>
              <p className="text-xs text-gray-500 mb-6">계획하고 있는 전체 결혼 예산 금액을 입력해주세요.</p>
              
              <div className="mb-6">
                 <label className="text-xs font-semibold text-gray-600 mb-1 block">새로운 예산 (원)</label>
                 <input 
                   autoFocus type="number" value={newBudgetStr} onChange={e => setNewBudgetStr(e.target.value)}
                   placeholder="ex) 50000000" 
                   className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg font-bold"
                 />
              </div>

              <div className="flex space-x-3">
                 <button type="button" onClick={() => setIsSettingBudget(false)} className="flex-1 py-3 text-gray-500 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200">취소</button>
                 <button type="submit" disabled={!newBudgetStr} className="flex-1 py-3 text-white font-semibold bg-blue-600 disabled:opacity-50 rounded-xl hover:bg-blue-700">변경 저장</button>
              </div>
           </form>
         </div>
       )}

       {/* 2. 지출 추가 폼 모달 */}
       {isAdding && (
         <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4">
           <form onSubmit={handleAddTransaction} className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
              <h3 className="text-lg font-bold text-gray-800 mb-4">새 지출 기록하기</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">지출처 (내역)</label>
                  <input 
                    autoFocus type="text" value={newTitle} onChange={e => setNewTitle(e.target.value)}
                    placeholder="예) 예식장 계약금" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">금액 (원)</label>
                  <input 
                    type="number" value={newAmount} onChange={e => setNewAmount(e.target.value)}
                    placeholder="1000000" 
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-600 mb-1 block">카테고리</label>
                  <select 
                    value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}
                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {CATEGORIES.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                  </select>
                </div>
              </div>

              <div className="flex space-x-3">
                 <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-gray-500 font-semibold bg-gray-100 rounded-xl">취소</button>
                 <button type="submit" disabled={!newTitle.trim() || !newAmount} className="flex-1 py-3 text-white font-semibold bg-blue-600 disabled:opacity-50 rounded-xl hover:bg-blue-700">저장</button>
              </div>
           </form>
         </div>
      )}

      {/* FAB */}
      <div className="fixed bottom-20 right-6 max-w-lg mx-auto z-20">
        <button onClick={() => setIsAdding(true)} className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </div>
    </main>
  )
}
