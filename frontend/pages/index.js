import MainDashboard from '../components/MainDashboard'

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto py-6">
        <MainDashboard />
      </div>
    </div>
  )
}

Dashboard.requiresAuth = true
