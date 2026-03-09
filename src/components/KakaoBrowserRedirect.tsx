'use client'

import { useEffect, useState } from 'react'
import { Copy, Navigation, X } from 'lucide-react'

export default function KakaoBrowserRedirect() {
  const [showModal, setShowModal] = useState(false)
  
  useEffect(() => {
    // 브라우저 환경이 아닐 경우 리턴
    if (typeof window === 'undefined') return
    
    const isKakaoTalk = /KAKAOTALK/i.test(navigator.userAgent)
    const isIOS = /iPhone|iPad|iPod/i.test(navigator.userAgent)
    const isAndroid = /Android/i.test(navigator.userAgent)
    
    // 카카오톡 브라우저인 경우
    if (isKakaoTalk) {
      const targetUrl = window.location.href

      // 모달 표시
      setShowModal(true)

      // 안드로이드의 경우 intent 방식을 사용하여 크롬이나 기본 브라우저로 자동 실행 시도
      if (isAndroid) {
        window.location.href = `intent://${targetUrl.replace(/https?:\/\//i, '')}#Intent;scheme=https;package=com.android.chrome;end`
      } 
      // iOS의 경우 카카오톡 브라우저에서 외부 사파리로 자동 전환하는 것이 막혀있으므로
      // 수동으로 링크를 복사하거나 사파리로 열도록 안내해야 함.
      else if (isIOS) {
        // iOS는 자동으로 열 수 없으므로 모달 안내 유지
      }
    }
  }, [])

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href)
      alert('링크가 복사되었습니다. 사파리(Safari)나 크롬(Chrome)에서 열어주세요!')
    } catch (err) {
      console.error('Failed to copy link', err)
      alert('링크 복사에 실패했습니다. 주소창에서 직접 복사해주세요.')
    }
  }

  if (!showModal) return null

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 p-4">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl relative">
        <button 
          onClick={() => setShowModal(false)}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex flex-col items-center text-center mt-2">
          <div className="bg-yellow-100 p-3 rounded-full mb-4">
            <Navigation className="w-8 h-8 text-yellow-600" />
          </div>
          
          <h3 className="text-xl font-bold text-gray-900 mb-2">원활한 사용을 위해 <br/>외부 브라우저를 이용해주세요</h3>
          
          <p className="text-gray-600 text-sm mb-6 leading-relaxed">
            카카오톡 브라우저에서는<br/>로그인 및 기능이 정상 작동하지 않을 수 있습니다.
          </p>

          <button
            onClick={handleCopyLink}
            className="w-full bg-gray-900 hover:bg-gray-800 text-white font-medium py-3.5 px-4 rounded-xl flex items-center justify-center gap-2 transition-colors"
          >
            <Copy className="w-4 h-4" />
            <span>링크 복사하고 외부 브라우저로 열기</span>
          </button>
        </div>
      </div>
    </div>
  )
}
