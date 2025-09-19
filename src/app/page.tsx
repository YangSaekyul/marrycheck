export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50">
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 opacity-10" style={{backgroundImage: "url('https://readdy.ai/api/search-image?query=romantic%20wedding%20preparation%20background%20with%20soft%20pink%20rose%20petals%20and%20delicate%20white%20flowers%20scattered%20on%20marble%20surface%20dreamy%20atmosphere%20warm%20lighting%20elegant%20minimal%20design&amp;width=1200&amp;height=800&amp;seq=hero-bg&amp;orientation=landscape')", backgroundSize: 'cover', backgroundPosition: 'center'}}></div>
        <div className="relative px-6 pt-8 pb-12">
          <div className="max-w-4xl mx-auto">
            {/* Couple Profiles */}
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-8">
                <div className="text-center">
                  <div className="relative">
                    <img alt="지은" className="w-20 h-20 rounded-full border-4 border-pink-200 shadow-lg object-cover object-top" src="https://via.placeholder.com/80" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-pink-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 font-semibold text-gray-800">지은</p>
                  <p className="text-sm text-pink-600">신부</p>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 bg-gradient-to-r from-pink-400 to-purple-400 rounded-full flex items-center justify-center shadow-lg animate-pulse">
                    <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mt-2 text-xs text-gray-500 font-medium">Together</div>
                </div>
                <div className="text-center">
                  <div className="relative">
                    <img alt="민수" className="w-20 h-20 rounded-full border-4 border-blue-200 shadow-lg object-cover object-top" src="https://via.placeholder.com/80" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                  <p className="mt-3 font-semibold text-gray-800">민수</p>
                  <p className="text-sm text-blue-600">신랑</p>
                </div>
              </div>
            </div>

            {/* Wedding Date & Progress */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">우리의 결혼식</h3>
                  <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="text-center">
                  <div className="mb-4">
                    <span className="text-6xl font-bold bg-gradient-to-r from-pink-500 to-purple-600 bg-clip-text text-transparent">D--126</span>
                  </div>
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-gray-800">2025년 5월 15일 목요일</p>
                    <p className="text-sm text-gray-600">결혼을 축하드려요!</p>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-800">준비 진행률</h3>
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                    </svg>
                  </div>
                </div>
                <div className="flex items-center justify-center">
                  <div className="relative">
                    <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-gray-200"></circle>
                      <circle cx="50" cy="50" r="45" stroke="currentColor" strokeWidth="8" fill="transparent" strokeDasharray="282.7433388230814" strokeDashoffset="90.47786842338604" className="text-gradient-to-r from-green-400 to-blue-500 transition-all duration-1000 ease-in-out"></circle>
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-3xl font-bold text-gray-800">68%</span>
                      <span className="text-sm text-gray-600">완료</span>
                    </div>
                  </div>
                </div>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">절반 이상 완료했어요! 💪</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Today's Tasks */}
        <div className="px-6 py-8">
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-800">오늘 해야 할 일</h3>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">3개 남음</span>
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">웨딩드레스 최종 피팅</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500">오후 2:00</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-pink-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-gray-500">신부</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-600 border-red-200">긴급</span>
                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group-hover:bg-blue-100">
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">예식장 최종 메뉴 선택</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500">오후 4:30</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-purple-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-gray-500">함께</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium border bg-yellow-100 text-yellow-600 border-yellow-200">보통</span>
                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group-hover:bg-blue-100">
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 bg-white rounded-2xl border border-gray-100 hover:shadow-md transition-all duration-200 cursor-pointer group">
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <svg className="w-5 h-5 text-orange-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                      </svg>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold text-gray-800 group-hover:text-gray-900 transition-colors">하객 명단 최종 정리</h4>
                      <div className="flex items-center space-x-3 mt-1">
                        <span className="text-sm text-gray-500">저녁 7:00</span>
                        <div className="w-1 h-1 bg-gray-300 rounded-full"></div>
                        <div className="flex items-center space-x-1">
                          <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                          </svg>
                          <span className="text-xs text-gray-500">신랑</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="px-2 py-1 rounded-full text-xs font-medium border bg-red-100 text-red-600 border-red-200">긴급</span>
                    <button className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors group-hover:bg-blue-100">
                      <svg className="w-4 h-4 text-gray-600 group-hover:text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-gray-100">
                <button className="w-full py-3 text-center text-blue-600 hover:text-blue-700 font-medium text-sm hover:bg-blue-50 rounded-xl transition-colors whitespace-nowrap">전체 할 일 보기</button>
              </div>
            </div>

            {/* Budget Overview & Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">예산 현황</h3>
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                  </div>
                </div>
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-sm text-gray-600">전체 사용률</span>
                    <span className="text-lg font-bold text-gray-800">68.0%</span>
                  </div>
                  <div className="relative">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div className="h-3 rounded-full transition-all duration-500 bg-gradient-to-r from-blue-400 to-purple-500" style={{width: '68%'}}></div>
                    </div>
                  </div>
                  <div className="flex items-center justify-between mt-3 text-sm">
                    <span className="text-gray-600">사용: 1360만원</span>
                    <span className="text-gray-600">남은 예산: 640만원</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <h4 className="font-semibold text-gray-800 mb-3">카테고리별 현황</h4>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-pink-500"></div>
                        <span className="text-sm font-medium text-gray-700">스튜디오</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">80%</span>
                        <div className="text-xs text-gray-500">500만원</div>
                      </div>
                    </div>
                    <div className="w-full bg-pink-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-pink-500 transition-all duration-500" style={{width: '80%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-purple-500"></div>
                        <span className="text-sm font-medium text-gray-700">예식비용</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">60%</span>
                        <div className="text-xs text-gray-500">700만원</div>
                      </div>
                    </div>
                    <div className="w-full bg-purple-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-purple-500 transition-all duration-500" style={{width: '60%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-blue-500"></div>
                        <span className="text-sm font-medium text-gray-700">드레스</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">40%</span>
                        <div className="text-xs text-gray-500">300만원</div>
                      </div>
                    </div>
                    <div className="w-full bg-blue-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-blue-500 transition-all duration-500" style={{width: '40%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-green-500"></div>
                        <span className="text-sm font-medium text-gray-700">피로연</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">0%</span>
                        <div className="text-xs text-gray-500">400만원</div>
                      </div>
                    </div>
                    <div className="w-full bg-green-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-green-500 transition-all duration-500" style={{width: '0%'}}></div>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                        <span className="text-sm font-medium text-gray-700">기타</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-semibold text-gray-800">20%</span>
                        <div className="text-xs text-gray-500">100만원</div>
                      </div>
                    </div>
                    <div className="w-full bg-yellow-100 rounded-full h-2">
                      <div className="h-2 rounded-full bg-yellow-500 transition-all duration-500" style={{width: '20%'}}></div>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <button className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 font-medium text-sm whitespace-nowrap">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                      <span>상세 보기</span>
                    </button>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl text-sm font-medium transition-colors whitespace-nowrap">지출 추가</button>
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-semibold text-gray-800">최근 활동</h3>
                  <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="relative">
                    <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-200"></div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-green-500 bg-green-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-800"><span className="font-semibold text-blue-600">신랑이</span> <span>웨딩슈트 예약을 완료했어요!</span></p>
                          <p className="text-xs text-gray-500">2시간 전</p>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-200"></div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-pink-500 bg-pink-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-800"><span className="font-semibold text-pink-600">신부가</span> <span>드레스 피팅 사진을 업로드했어요</span></p>
                          <p className="text-xs text-gray-500">5시간 전</p>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="absolute left-6 top-12 w-0.5 h-6 bg-gray-200"></div>
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-purple-500 bg-purple-100">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-800"><span className="font-semibold text-purple-600">우리가</span> <span>예식장 방문 일정을 잡았어요</span></p>
                          <p className="text-xs text-gray-500">어제</p>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="relative">
                    <div className="flex items-start space-x-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 text-red-500 bg-red-100">
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="space-y-1">
                          <p className="text-sm text-gray-800"><span className="font-semibold text-purple-600">우리가</span> <span>드디어 50% 진행률을 달성했어요! 🎉</span></p>
                          <p className="text-xs text-gray-500">2일 전</p>
                        </div>
                      </div>
                      <button className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors flex-shrink-0">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100">
                  <button className="w-full py-3 text-center text-gray-600 hover:text-gray-800 font-medium text-sm hover:bg-gray-50 rounded-xl transition-colors whitespace-nowrap">모든 활동 보기</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Access & Together Mode */}
        <div className="px-6 pb-8">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button className="bg-gradient-to-br from-pink-400 to-pink-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group whitespace-nowrap">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-2xl font-bold mb-2">체크리스트</h3>
                      <p className="text-white/80">할 일 관리</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                </button>
                <button className="bg-gradient-to-br from-blue-400 to-blue-600 rounded-3xl p-8 text-white shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 group whitespace-nowrap">
                  <div className="flex items-center justify-between">
                    <div className="text-left">
                      <h3 className="text-2xl font-bold mb-2">예산 관리</h3>
                      <p className="text-white/80">지출 현황</p>
                    </div>
                    <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center group-hover:bg-white/30 transition-colors">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
              <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20">
                <h3 className="text-lg font-semibold text-gray-800 mb-6">빠른 접근</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <button className="flex flex-col items-center p-6 rounded-2xl hover:bg-gray-50 transition-colors group whitespace-nowrap">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform bg-purple-100 text-purple-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">일정</span>
                  </button>
                  <button className="flex flex-col items-center p-6 rounded-2xl hover:bg-gray-50 transition-colors group whitespace-nowrap">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform bg-green-100 text-green-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">하객</span>
                  </button>
                  <button className="flex flex-col items-center p-6 rounded-2xl hover:bg-gray-50 transition-colors group whitespace-nowrap">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform bg-orange-100 text-orange-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">공유</span>
                  </button>
                  <button className="flex flex-col items-center p-6 rounded-2xl hover:bg-gray-50 transition-colors group whitespace-nowrap">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-3 group-hover:scale-110 transition-transform bg-gray-100 text-gray-600">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-700">설정</span>
                  </button>
                </div>
              </div>
              <div className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-600 rounded-3xl p-8 text-white shadow-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-bold mb-2">투게더 모드</h3>
                    <p className="text-white/90 mb-4">실시간으로 서로의 진행 상황을 확인하고<br />함께 결혼 준비를 완성해보세요!</p>
                    <button className="bg-white/20 hover:bg-white/30 px-6 py-3 rounded-xl font-medium transition-colors whitespace-nowrap">지금 시작하기</button>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center">
                      <svg className="w-10 h-10" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}