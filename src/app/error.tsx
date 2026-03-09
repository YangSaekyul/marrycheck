'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Global Error Boundary caught:', error)
  }, [error])

  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] px-4 py-16 text-center">
      <div className="bg-red-50 text-red-600 p-4 rounded-full mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-900 mb-2">오류가 발생했습니다</h2>
      <p className="text-gray-600 mb-8 max-w-sm">
        일시적인 오류이거나 지원하지 않는 브라우저(예: 카카오톡 인앱 브라우저)일 수 있습니다.
      </p>
      
      <div className="space-y-4 w-full max-w-xs">
        <button
          onClick={() => reset()}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white font-medium py-3 px-4 rounded-xl transition-colors shadow-sm"
        >
          다시 시도하기
        </button>
        
        <p className="text-sm text-gray-500 mt-6">
          계속 오류가 발생한다면 링크를 복사하여<br />
          <span className="font-semibold text-gray-700">사파리(Safari)</span>나 <span className="font-semibold text-gray-700">크롬(Chrome)</span> 앱에서 열어주세요.
        </p>
      </div>
    </div>
  )
}
