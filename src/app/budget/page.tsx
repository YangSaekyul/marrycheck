'use client'

import { Plus, Wallet2, TrendingUp, AlertCircle, ShoppingBag, Utensils, Home as HomeIcon, Video } from 'lucide-react'

const MOCK_BUDGET = {
  total: 50000000,
  spent: 18500000,
  categories: [
    { id: '1', name: '예식장/식대', allocated: 25000000, spent: 10000000, icon: Utensils, color: 'bg-orange-100 text-orange-600' },
    { id: '2', name: '스드메', allocated: 5000000, spent: 3500000, icon: Video, color: 'bg-pink-100 text-pink-600' },
    { id: '3', name: '혼수/가전', allocated: 15000000, spent: 5000000, icon: HomeIcon, color: 'bg-blue-100 text-blue-600' },
    { id: '4', name: '기타/예비비', allocated: 5000000, spent: 0, icon: ShoppingBag, color: 'bg-purple-100 text-purple-600' },
  ],
  recentTransactions: [
    { id: '1', date: '오늘', item: '웨딩홀 계약금', amount: 1000000, category: '예식장' },
    { id: '2', date: '어제', item: '스튜디오 촬영 잔금', amount: 1500000, category: '스드메' },
    { id: '3', date: '3일 전', item: '신혼집 냉장고 결제', amount: 2800000, category: '혼수' },
  ]
}

export default function BudgetPage() {
  const percentSpent = Math.round((MOCK_BUDGET.spent / MOCK_BUDGET.total) * 100)
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('ko-KR').format(amount) + '원'
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-500 to-indigo-600 px-6 pt-12 pb-24 rounded-b-[2.5rem] shadow-md relative">
        <h1 className="text-2xl font-bold text-white mb-6">스마트 예산 관리</h1>
        
        <div className="text-white/80 text-sm font-medium mb-1">총 결혼 예산</div>
        <div className="text-3xl font-bold text-white mb-6 flex items-center">
          {formatCurrency(MOCK_BUDGET.total)}
        </div>

        {/* Floating Summary Card */}
        <div className="absolute left-6 right-6 -bottom-16 bg-white rounded-3xl p-6 shadow-xl border border-gray-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <div className="text-sm font-medium text-gray-500 mb-1">현재까지 지출</div>
              <div className="text-2xl font-bold text-gray-800">{formatCurrency(MOCK_BUDGET.spent)}</div>
            </div>
            <div className="text-right">
              <div className="text-xs font-semibold text-blue-500 bg-blue-50 px-2 py-1 rounded-lg mb-1 inline-block">남은 예산</div>
              <div className="text-sm font-bold text-gray-600">{formatCurrency(MOCK_BUDGET.total - MOCK_BUDGET.spent)}</div>
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
            {MOCK_BUDGET.categories.map(cat => {
              const catPercent = Math.round((cat.spent / cat.allocated) * 100)
              const Icon = cat.icon
              return (
                <div key={cat.id} className="bg-white p-4 rounded-2xl border border-gray-100 shadow-sm relative overflow-hidden group">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${cat.color}`}>
                    <Icon size={20} />
                  </div>
                  <h3 className="text-sm font-semibold text-gray-800 mb-1">{cat.name}</h3>
                  <p className="text-xs text-gray-500 mb-3">{formatCurrency(cat.spent)} 사용</p>
                  
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
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {MOCK_BUDGET.recentTransactions.map((tx, idx) => (
              <div key={tx.id} className={`flex items-center justify-between p-4 ${idx !== MOCK_BUDGET.recentTransactions.length -1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex items-center space-x-4">
                  <div className="w-10 h-10 bg-gray-50 rounded-full flex items-center justify-center">
                    <TrendingUp size={18} className="text-gray-400" />
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-800">{tx.item}</h4>
                    <p className="text-xs text-gray-400 mt-0.5">{tx.date} • {tx.category}</p>
                  </div>
                </div>
                <div className="text-sm font-bold text-gray-700">
                  -{formatCurrency(tx.amount)}
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      {/* FAB */}
      <div className="fixed bottom-20 right-6 max-w-lg mx-auto z-20">
        <button className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-blue-700 hover:scale-105 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </div>
    </main>
  )
}
