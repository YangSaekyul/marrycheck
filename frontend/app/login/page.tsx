"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth'
import { auth } from '@/lib/firebase'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const kakaoKey = process.env.NEXT_PUBLIC_KAKAO_JS_KEY

  const onKakaoLogin = () => {
    const redirectUri = `${window.location.origin}/auth/kakao/callback`
    const url = `https://kauth.kakao.com/oauth/authorize?client_id=${kakaoKey}&redirect_uri=${encodeURIComponent(
      redirectUri
    )}&response_type=code`
    window.location.href = url
  }

  const onEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      await signInWithEmailAndPassword(auth, email, password)
      router.push('/')
    } catch (err: any) {
      setError(err.message || '로그인에 실패했습니다')
    }
  }

  const onDevLogin = async () => {
    try {
      await signInAnonymously(auth)
      router.push('/')
    } catch (err: any) {
      setError(err.message || '개발용 로그인 실패')
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        <h1 className="text-2xl font-bold text-center">Marry Check 로그인</h1>

        <button
          onClick={onKakaoLogin}
          className="w-full py-3 bg-yellow-400 rounded-md font-semibold"
        >
          카카오로 로그인
        </button>

        <form onSubmit={onEmailLogin} className="space-y-3">
          <input
            className="w-full p-3 border rounded"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="w-full p-3 border rounded"
            placeholder="비밀번호"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="w-full py-2 bg-primary text-white rounded">
            이메일로 로그인
          </button>
        </form>

        <div className="text-center">
          <button onClick={onDevLogin} className="text-sm text-muted-foreground underline">
            개발용 로그인(익명)
          </button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
    </main>
  )
}
