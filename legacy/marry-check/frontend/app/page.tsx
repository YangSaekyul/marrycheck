import { MainDashboard } from "@/components/main-dashboard"
import ProtectedRoute from '@/components/ProtectedRoute'

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      <ProtectedRoute>
        <MainDashboard />
      </ProtectedRoute>
    </main>
  )
}
