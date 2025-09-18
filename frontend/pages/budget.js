export default function Budget() {
  return (
    <div className="space-y-6">
      <section>
        <h1 className="text-2xl font-bold">예산</h1>
        <p className="text-gray-500 mt-1">예산을 관리하고 지출을 추적하세요.</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/80 rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-bold">예산 요약</h4>
          <p className="text-sm text-gray-500 mt-2">잔액: 640만원</p>
        </div>
        <div className="bg-white/80 rounded-xl p-6 shadow-sm">
          <h4 className="text-lg font-bold">최근 지출</h4>
          <p className="text-sm text-gray-500 mt-2">드레스샵 잔금 결제</p>
        </div>
      </section>
    </div>
  )
}

Budget.requiresAuth = true
