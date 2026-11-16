"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth'
import { auth } from '@/lib/firebase'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Heart } from 'lucide-react'

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
    <main className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <CardTitle className="text-2xl">Marry Check</CardTitle>
          </div>
          <p className="text-sm text-muted-foreground">결혼 준비를 함께 시작해보세요</p>
        </CardHeader>

        <CardContent className="space-y-6">
          <Button
            onClick={onKakaoLogin}
            className="w-full py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-semibold rounded-md"
            size="lg"
          >
            카카오로 로그인
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">또는</span>
            </div>
          </div>

          <form onSubmit={onEmailLogin} className="space-y-4">
            <div className="space-y-2">
              <Input
                placeholder="이메일"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="비밀번호"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full" size="lg">
              이메일로 로그인
            </Button>
          </form>

          <div className="text-center">
            <Button
              onClick={onDevLogin}
              variant="ghost"
              size="sm"
              className="text-muted-foreground hover:text-foreground"
            >
              개발용 로그인(익명)
            </Button>
          </div>

          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
