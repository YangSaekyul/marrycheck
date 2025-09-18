import React from 'react'

export default function Home() {
  // 샘플 데이터 (나중에 DB에서 가져올 예정)
  const coupleName = "민수 & 지은";
  const weddingDate = "2025년 5월 15일";
  const dDay = "239";
  const progress = 68;
  const budget = {
    remaining: "640만원",
    lastActivity: "드레스샵 잔금 결제"
  };
  const todos = {
    remaining: 3
  };

  return (
    <div className="space-y-12">
      {/* Section 1: Couple Profile & D-Day */}
      <section className="text-center">
        <h2 className="text-3xl font-bold text-gray-800">{coupleName}</h2>
        <p className="text-gray-500 mt-1">{weddingDate}</p>
      </section>

      {/* Section 2: Progress */}
      <section className="px-4 sm:px-0">
        <div className="flex flex-col gap-3">
          <p className="text-center font-medium">{dDay}일 남았습니다</p>
          <div className="h-3 rounded-full bg-pink-100 overflow-hidden">
            <div className="h-full rounded-full bg-primary" style={{ width: `${progress}%` }}></div>
          </div>
          <p className="text-sm text-center text-gray-500">{progress}% 완료</p>
        </div>
      </section>

      {/* Section 3: Quick Actions */}
      <section>
        <h3 className="text-2xl font-bold px-4 sm:px-0 mb-6">바로가기</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/80 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold">오늘의 할 일</h4>
            <p className="text-gray-500 text-sm mt-1">{todos.remaining}개 남음</p>
          </div>
          <div className="bg-white/80 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold">예산 현황</h4>
            <p className="text-gray-500 text-sm mt-1">잔액: {budget.remaining}</p>
          </div>
          <div className="bg-white/80 rounded-xl p-6 shadow-sm">
            <h4 className="text-lg font-bold">최근 활동</h4>
            <p className="text-gray-500 text-sm mt-1">{budget.lastActivity}</p>
          </div>
        </div>
      </section>

      {/* Section 4: Main Navigation */}
      <section>
        <h3 className="text-2xl font-bold px-4 sm:px-0 mb-6">관리하기</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <a className="group bg-white/80 rounded-xl p-6 flex items-center gap-6 shadow-sm" href="#">
            <div className="bg-primary/10 text-primary p-4 rounded-lg">
              <span className="material-symbols-outlined text-4xl">checklist</span>
            </div>
            <div>
              <h4 className="text-lg font-bold">체크리스트</h4>
              <p className="text-gray-500 text-sm mt-1">결혼 준비 할 일을 관리하세요</p>
            </div>
          </a>
          <a className="group bg-white/80 rounded-xl p-6 flex items-center gap-6 shadow-sm" href="#">
            <div className="bg-primary/10 text-primary p-4 rounded-lg">
              <span className="material-symbols-outlined text-4xl">payments</span>
            </div>
            <div>
              <h4 className="text-lg font-bold">예산</h4>
              <p className="text-gray-500 text-sm mt-1">지출 내역을 추적하세요</p>
            </div>
          </a>
        </div>
      </section>
    </div>
  )
}

Home.requiresAuth = true; // 로그인 필요 페이지로 설정
