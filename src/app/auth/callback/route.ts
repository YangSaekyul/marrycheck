import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  // 인증 후 리다이렉트할 경로 (기본값 설정)
  const next = searchParams.get('next') ?? '/'

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      // 인증 성공 시 지정된 경로(또는 홈)로 이동
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // 에러 발생 시(또는 코드가 없는 경우) 에러 페이지/로그아웃 페이지 등으로 이동
  return NextResponse.redirect(`${origin}/login?error=auth_failed`)
}
