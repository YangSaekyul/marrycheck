import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Heart, Calendar, CheckCircle, DollarSign, Users, Clock, BookOpen } from "lucide-react"
import Link from "next/link"

export function MainDashboard() {
  // Mock data - will be replaced with real data later
  const daysUntilWedding = 127
  const overallProgress = 68
  const budgetUsed = 4200000
  const totalBudget = 8000000
  const budgetPercentage = (budgetUsed / totalBudget) * 100

  const todayTasks = [
    { id: 1, title: "웨딩드레스 피팅 예약", priority: "high", assignee: "bride" },
    { id: 2, title: "예식장 최종 확인", priority: "medium", assignee: "both" },
    { id: 3, title: "혼주 정장 선택", priority: "low", assignee: "groom" },
  ]

  const recentActivity = [
    { id: 1, message: "신부가 웨딩드레스 예약을 완료했어요!", time: "2시간 전" },
    { id: 2, message: "신랑이 예식장 계약서를 업로드했어요", time: "1일 전" },
  ]

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-md">
      {/* Hero Section */}
      <div className="text-center space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">신랑</span>
          </div>
          <Heart className="w-8 h-8 text-primary fill-primary" />
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-lg font-semibold text-primary">신부</span>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-center space-x-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">결혼식까지</span>
          </div>
          <div className="text-4xl font-bold text-primary">D-{daysUntilWedding}</div>
          <p className="text-sm text-muted-foreground">2024년 12월 24일</p>
        </div>

        <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium">전체 준비도</span>
              <span className="text-sm font-bold text-primary">{overallProgress}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="space-y-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>오늘 해야 할 일</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {todayTasks.map((task) => (
              <div key={task.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex-1">
                  <p className="text-sm font-medium">{task.title}</p>
                  <div className="flex items-center space-x-2 mt-1">
                    <Badge
                      variant={
                        task.priority === "high" ? "destructive" : task.priority === "medium" ? "default" : "secondary"
                      }
                      className="text-xs"
                    >
                      {task.priority === "high" ? "긴급" : task.priority === "medium" ? "보통" : "낮음"}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {task.assignee === "both" ? "함께" : task.assignee === "bride" ? "신부" : "신랑"}
                    </span>
                  </div>
                </div>
                <Button size="sm" variant="ghost">
                  <CheckCircle className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <DollarSign className="w-5 h-5 text-primary" />
              <span>예산 현황</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">사용 금액</span>
                <span className="font-semibold">{budgetUsed.toLocaleString()}원</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-muted-foreground">전체 예산</span>
                <span className="font-semibold">{totalBudget.toLocaleString()}원</span>
              </div>
              <Progress value={budgetPercentage} className="h-2" />
              <p className="text-xs text-muted-foreground text-center">{(100 - budgetPercentage).toFixed(1)}% 남음</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary" />
              <span>최근 활동</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-3">
                <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                <div className="flex-1">
                  <p className="text-sm">{activity.message}</p>
                  <div className="flex items-center space-x-1 mt-1">
                    <Clock className="w-3 h-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Navigation Hub */}
      <div className="grid grid-cols-2 gap-4">
        <Link href="/checklist">
          <Button size="lg" className="h-16 flex-col space-y-2 w-full">
            <CheckCircle className="w-6 h-6" />
            <span>체크리스트</span>
          </Button>
        </Link>
        <Link href="/budget">
          <Button size="lg" variant="outline" className="h-16 flex-col space-y-2 bg-transparent w-full">
            <DollarSign className="w-6 h-6" />
            <span>예산 관리</span>
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Link href="/together">
          <Button
            size="lg"
            variant="secondary"
            className="h-16 flex-col space-y-2 w-full bg-gradient-to-r from-primary/10 to-secondary/10"
          >
            <Heart className="w-6 h-6" />
            <span>투게더 모드</span>
          </Button>
        </Link>
        <Link href="/timeline">
          <Button
            size="lg"
            variant="secondary"
            className="h-16 flex-col space-y-2 w-full bg-gradient-to-r from-secondary/10 to-primary/10"
          >
            <BookOpen className="w-6 h-6" />
            <span>우리 이야기</span>
          </Button>
        </Link>
      </div>
    </div>
  )
}
