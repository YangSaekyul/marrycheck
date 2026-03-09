'use client'

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
// import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
// import { doc, setDoc, getDoc } from 'firebase/firestore'
// import { auth, db } from '@/lib/firebase'

// Firebase의 User 타입을 대체할 임시 Mock 타입
interface MockUser {
  uid: string
  email: string | null
}

interface UserProfile {
  email: string
  gender?: string
  age?: number
  createdAt: Date
  updatedAt: Date
}

interface AuthContextType {
  user: MockUser | null
  userProfile: UserProfile | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
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

// --- MOCK 구현 ---
// 백엔드를 임시로 제거하고 로컬 상태로만 돌아가도록 조작된 Provider입니다.
export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<MockUser | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)

  // 앱 로드 시 로컬 스토리지에 저장된 값이 있는지 확인 (자동 로그인 흉내)
  useEffect(() => {
    const checkLoginInfo = async () => {
      setLoading(true)
      await new Promise((resolve) => setTimeout(resolve, 800)) // 초기 로딩 깜빡임 모사

      const savedEmail = localStorage.getItem('marrycheck_mock_email')
      const savedProfile = localStorage.getItem('marrycheck_mock_profile')

      if (savedEmail) {
        setUser({ uid: 'mock_uid_123', email: savedEmail })
        if (savedProfile) {
          setUserProfile(JSON.parse(savedProfile))
        } else {
          const defaultProfile = {
            email: savedEmail,
            gender: 'female', // 홈화면을 바로 볼 수 있도록 기본값 셋팅
            age: 28,
            createdAt: new Date(),
            updatedAt: new Date(),
          }
          setUserProfile(defaultProfile)
          localStorage.setItem('marrycheck_mock_profile', JSON.stringify(defaultProfile))
        }
      } else {
        setUser(null)
        setUserProfile(null)
      }
      setLoading(false)
    }

    checkLoginInfo()
  }, [])

  const signIn = async (email: string, password: string) => {
    // 1초간 서버와 통신하는 척 딜레이 구성
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (password === 'fail') {
        // 일부러 비밀번호를 fail 입력시 에러 뿜뿜 확인용 (auth/user-not-found 코드 전달해 회원가입유도)
        const error: any = new Error("가입되지 않은 이메일입니다.")
        error.code = 'auth/user-not-found'
        throw error
    }

    // 성공 처리
    localStorage.setItem('marrycheck_mock_email', email)
    setUser({ uid: 'mock_uid_123', email })
    
    // 이전에 저장된 프로필이 없다면 생성
    const savedProfile = localStorage.getItem('marrycheck_mock_profile')
    if (savedProfile) {
      setUserProfile(JSON.parse(savedProfile))
    } else {
      const newProfile = {
        email,
        createdAt: new Date(),
        updatedAt: new Date(),
      }
      setUserProfile(newProfile)
      localStorage.setItem('marrycheck_mock_profile', JSON.stringify(newProfile))
    }
  }

  const signUp = async (email: string, password: string) => {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    
    // 회원가입 직후 바로 로그인 처리
    localStorage.setItem('marrycheck_mock_email', email)
    setUser({ uid: 'mock_uid_123', email })

    const newProfile = {
      email,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    setUserProfile(newProfile)
    localStorage.setItem('marrycheck_mock_profile', JSON.stringify(newProfile))
  }

  const logout = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    localStorage.removeItem('marrycheck_mock_email')
    // localStorage.removeItem('marrycheck_mock_profile') // 프로필은 임시로 냅둠 (원하면 지워도 됨)
    setUser(null)
    setUserProfile(null)
  }

  const updateProfile = async (profileUpdate: Partial<UserProfile>) => {
    await new Promise((resolve) => setTimeout(resolve, 800))
    if (!user || !userProfile) return

    const updatedProfile = {
      ...userProfile,
      ...profileUpdate,
      updatedAt: new Date(),
    } as UserProfile

    setUserProfile(updatedProfile)
    localStorage.setItem('marrycheck_mock_profile', JSON.stringify(updatedProfile))
  }

  const value = {
    user,
    userProfile,
    loading,
    signIn,
    signUp,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}