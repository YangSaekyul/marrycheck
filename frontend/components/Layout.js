export default function Layout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-pink-50 via-white to-purple-50">
      {/* 헤더 */}
      <header className="flex items-center justify-between whitespace-nowrap border-b border-pink-100 px-4 sm:px-6 lg:px-10 py-3 bg-white/80 backdrop-blur-sm sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 text-primary">
            {/* 로고 SVG */}
            <svg fill="none" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
              <path clipRule="evenodd" d="M12.0799 24L4 19.2479L9.95537 8.75216L18.04 13.4961L18.0446 4H29.9554L29.96 13.4961L38.0446 8.75216L44 19.2479L35.92 24L44 28.7521L38.0446 39.2479L29.96 34.5039L29.9554 44H18.0446L18.04 34.5039L9.95537 39.2479L4 28.7521L12.0799 24Z" fill="#f04299" fillRule="evenodd"></path>
            </svg>
          </div>
          <h1 className="text-xl font-bold text-gray-800">메리 체크</h1>
        </div>
        <div className="flex items-center gap-4">
          <button aria-label="알림" title="알림" className="flex items-center justify-center rounded-full h-10 w-10 bg-pink-50 hover:bg-pink-100 transition-colors">
            <span className="material-symbols-outlined text-gray-600">알림</span>
          </button>
          {/* 사용자 프로필 이미지 자리 표시자 */}
          <div className="w-10 h-10 rounded-full bg-gray-200"></div>
        </div>
      </header>
      
      {/* 메인 콘텐츠 */}
      <main className="flex-grow justify-center py-8 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl">
          {children}
        </div>
      </main>

      {/* 모바일 하단 네비게이션 */}
      <footer className="sticky bottom-0 bg-white/80 backdrop-blur-sm border-t border-pink-100 md:hidden">
        <nav className="grid grid-cols-4 items-center justify-items-center gap-2 px-4 py-2">
          <a className="flex flex-col items-center gap-1 text-primary" href="#">
            <div className="flex items-center justify-center rounded-full bg-primary/10 p-2.5">
              <span className="material-symbols-outlined">홈</span>
            </div>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors" href="#">
            <div className="flex items-center justify-center rounded-full p-2.5">
              <span className="material-symbols-outlined">체크리스트</span>
            </div>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors" href="#">
            <div className="flex items-center justify-center rounded-full p-2.5">
              <span className="material-symbols-outlined">예산</span>
            </div>
          </a>
          <a className="flex flex-col items-center gap-1 text-gray-500 hover:text-primary transition-colors" href="#">
            <div className="flex items-center justify-center rounded-full p-2.5">
              <span className="material-symbols-outlined">설정</span>
            </div>
          </a>
        </nav>
      </footer>
    </div>
  )
}
