'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { createClient } from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'

interface UserProfile {
  email: string
  gender?: string
  age?: number
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
  const supabase = createClient()

  useEffect(() => {
    // 1. 초기 세션 확인
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        const currentUser = session?.user ?? null
        setUser(currentUser)
        
        // 유저 정보가 있다면 프로필(메타데이터) 처리
        if (currentUser) {
           const profile: UserProfile = {
             email: currentUser.email || '',
             gender: currentUser.user_metadata?.gender || 'female',
             createdAt: new Date(currentUser.created_at),
             updatedAt: new Date(currentUser.updated_at || currentUser.created_at),
           }
           setUserProfile(profile)
        } else {
           setUserProfile(null)
        }

      } catch (error) {
        console.error('Error checking session:', error)
      } finally {
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
           const profile: UserProfile = {
             email: currentUser.email || '',
             gender: currentUser.user_metadata?.gender || 'female',
             createdAt: new Date(currentUser.created_at),
             updatedAt: new Date(currentUser.updated_at || currentUser.created_at),
           }
           setUserProfile(profile)
        } else {
           setUserProfile(null)
        }
        setLoading(false)
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
    if (!user || !userProfile) return
    
    // Supabase User Metadata 업데이트
    const { error } = await supabase.auth.updateUser({
      data: profileUpdate
    })

    if (error) {
      console.error('Profile update error:', error.message)
      return
    }

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