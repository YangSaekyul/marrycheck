// Mock Environment: Firebase 기능을 사용하지 않고 프론트엔드 단독 개발을 위해 주석/비활성화 처리합니다.
// 나중에 백엔드와 연결할 때 이 파일의 주석을 풀고 다시 사용하세요.

// import { initializeApp } from 'firebase/app'
// import { getAuth } from 'firebase/auth'
// import { getFirestore } from 'firebase/firestore'

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
// }

// const app = initializeApp(firebaseConfig)
// export const auth = getAuth(app)
// export const db = getFirestore(app)
// export default app

// Mock 객체로 런타임 에러 방지 (현재 코드 베이스에서는 사용하지 않음)
export const auth = {} as any
export const db = {} as any
export default {} as any