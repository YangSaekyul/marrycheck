'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { parseSafeDate } from '@/utils/date'
import { sendDiscordNotification } from '@/utils/discord'

interface UserProfile {
  email: string
  nickname?: string
  profile_image?: string
  role?: 'bride' | 'groom' | null
  couple_id?: string | null
  gender?: string
  birthdate?: string
  temp_partner_name?: string
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  loading: boolean
  signInWithKakao: () => Promise<void>
  logout: () => Promise<void>
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

interface AuthProviderProps {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  
  // 클라이언트 측에서 싱글톤처럼 동작하여 무한 재렌더링 방지
  const [supabase] = useState(() => createClient())

  useEffect(() => {
    // 1. 초기 세션 확인
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        // 유저 정보가 있다면 프로필(메타데이터) 처리
        if (currentUser) {
           // 1. 기본 메타데이터로 즉시 UI 렌더링 해제 (Blocking 방지)
           const baseProfile: UserProfile = {
             email: currentUser.email || '',
             nickname: currentUser.user_metadata?.nickname || currentUser.user_metadata?.full_name || '',
             profile_image: currentUser.user_metadata?.profile_image || currentUser.user_metadata?.avatar_url || '',
             role: currentUser.user_metadata?.role || null,
             couple_id: currentUser.user_metadata?.couple_id || null,
             gender: currentUser.user_metadata?.gender || 'female',
             birthdate: currentUser.user_metadata?.birthdate,
             temp_partner_name: currentUser.user_metadata?.temp_partner_name,
             createdAt: parseSafeDate(currentUser.created_at) || new Date(),
             updatedAt: parseSafeDate(currentUser.updated_at || currentUser.created_at) || new Date(),
           }
           setUserProfile(baseProfile)
           setLoading(false) // 여기서 바로 로딩 해제 (무한 로딩 픽스)

           // 2. 비동기로 DB 최신 데이터 가져와서 조용히 덮어쓰기 (Background sync)
           const syncDb = async () => {
             try {
                const { data: dbUser } = await supabase.from('users').select('*').eq('id', currentUser.id).single()
                if (dbUser) {
                  setUserProfile(prev => prev ? {
                    ...prev,
                    nickname: dbUser.nickname || prev.nickname,
                    profile_image: dbUser.profile_image || prev.profile_image,
                    role: dbUser.role || prev.role,
                    couple_id: dbUser.couple_id || prev.couple_id,
                    gender: dbUser.gender || prev.gender,
                    birthdate: dbUser.birthdate || prev.birthdate,
                    temp_partner_name: dbUser.temp_partner_name || prev.temp_partner_name,
                    updatedAt: parseSafeDate(dbUser.updated_at) || prev.updatedAt
                  } : null)
                }
             } catch (err) {
               console.error('Background DB sync error:', err)
             }
           }
           syncDb()

        } else {
           setUserProfile(null)
           setLoading(false)
        }

      } catch (error) {
        console.error('Error checking session:', error)
        setLoading(false)
      }
    }

    checkSession()

    // 2. 세션 변경 사항 실시간 감지
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        if (currentUser) {
           // 1. 기본 메타데이터로 즉시 UI 렌더링 해제
           const baseProfile: UserProfile = {
             email: currentUser.email || '',
             nickname: currentUser.user_metadata?.nickname || currentUser.user_metadata?.full_name || '',
             profile_image: currentUser.user_metadata?.profile_image || currentUser.user_metadata?.avatar_url || '',
             role: currentUser.user_metadata?.role || null,
             couple_id: currentUser.user_metadata?.couple_id || null,
             gender: currentUser.user_metadata?.gender || 'female',
             birthdate: currentUser.user_metadata?.birthdate,
             temp_partner_name: currentUser.user_metadata?.temp_partner_name,
             createdAt: parseSafeDate(currentUser.created_at) || new Date(),
             updatedAt: parseSafeDate(currentUser.updated_at || currentUser.created_at) || new Date(),
           }
           setUserProfile(baseProfile)
           setLoading(false)

           // 2. 비동기 DB 동기화
           const syncDbChange = async () => {
             try {
               const { data: dbUser } = await supabase.from('users').select('*').eq('id', currentUser.id).single()
               if (dbUser) {
                 setUserProfile(prev => prev ? {
                   ...prev,
                   nickname: dbUser.nickname || prev.nickname,
                   profile_image: dbUser.profile_image || prev.profile_image,
                   role: dbUser.role || prev.role,
                   couple_id: dbUser.couple_id || prev.couple_id,
                   gender: dbUser.gender || prev.gender,
                   birthdate: dbUser.birthdate || prev.birthdate,
                   temp_partner_name: dbUser.temp_partner_name || prev.temp_partner_name,
                   updatedAt: parseSafeDate(dbUser.updated_at) || prev.updatedAt
                 } : null)
               }
             } catch (err) {
               console.error('Background DB sync error (auth change):', err)
             }
           }
           syncDbChange()
             
        } else {
           setUserProfile(null)
           setLoading(false)
        }
      }
    )

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  const signInWithKakao = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'kakao',
        options: {
          // 환경에 맞춰 콜백 URL 자동 설정 (현재창 리다이렉트)
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      })
      if (error) throw error
    } catch (error: any) {
      console.error('Kakao login error:', error.message)
      setLoading(false)
      throw error
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    } catch (error: any) {
      console.error('Logout error:', error.message)
      setLoading(false)
    }
  }

  const updateProfile = async (profileUpdate: Partial<UserProfile>) => {
    if (!user) return
    
    // 1. Supabase User Metadata 업데이트 (빠른 UI 연동용)
    const { error: authError } = await supabase.auth.updateUser({
      data: profileUpdate
    })

    if (authError) {
      console.error('Auth Metadata update error:', authError.message)
      return
    }

    // 2. public.users 테이블 업데이트 (실제 DB 매칭 및 저장용)
    // - id가 이미 있을 확률이 높으므로 UPSERT 로 처리하여 무조건 들어가도록 강제함
    const { error: dbError } = await supabase
      .from('users')
      .upsert({
        id: user.id,
        email: user.email,
        nickname: profileUpdate.nickname !== undefined ? profileUpdate.nickname : userProfile?.nickname,
        profile_image: profileUpdate.profile_image !== undefined ? profileUpdate.profile_image : userProfile?.profile_image,
        birthdate: profileUpdate.birthdate !== undefined ? profileUpdate.birthdate : userProfile?.birthdate,
        gender: profileUpdate.gender !== undefined ? profileUpdate.gender : userProfile?.gender,
        role: profileUpdate.role !== undefined ? profileUpdate.role : userProfile?.role,
        temp_partner_name: (profileUpdate as any).temp_partner_name !== undefined ? (profileUpdate as any).temp_partner_name : userProfile?.temp_partner_name,
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' })

    if (dbError) {
       console.error('DB User update/upsert error:', dbError.message)
       throw new Error(dbError.message)
    }

    // 새 프로필 설정 시 디스코드 웹훅 알림 발송 (비동기 처리로 UI 중단 방지)
    const newNickname = profileUpdate.nickname !== undefined ? profileUpdate.nickname : userProfile?.nickname;
    const newGender = profileUpdate.gender !== undefined ? profileUpdate.gender : userProfile?.gender;
    const newRole = profileUpdate.role !== undefined ? profileUpdate.role : userProfile?.role;
    
    if (newNickname) {
      sendDiscordNotification({
        email: user.email || '이메일 없음',
        nickname: newNickname,
        gender: newGender || '미상',
        role: newRole || null
      });
    }

    // 로컬 상태 동기화
    setUserProfile(prev => prev ? { ...prev, ...profileUpdate, updatedAt: new Date() } : null)
  }

  const value = {
    user,
    userProfile,
    loading,
    signInWithKakao,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}