"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Heart, Trophy, Bell, MessageCircle, CheckCircle, Target, Smile, Meh, Frown } from "lucide-react"
import { useRouter } from "next/navigation"

interface Mission {
  id: string
  title: string
  description: string
  type: "couple" | "individual"
  assignee?: "bride" | "groom" | "both"
  status: "active" | "completed"
  deadline: string
  reward: string
  progress: number
}

interface Notification {
  id: string
  message: string
  time: string
  type: "completion" | "update" | "reminder"
  from: "bride" | "groom"
}

interface EmotionalCheckIn {
  id: string
  date: string
  mood: "happy" | "neutral" | "stressed"
  stressLevel: number
  note?: string
  user: "bride" | "groom"
}

const mockMissions: Mission[] = [
  {
    id: "1",
    title: "이번 주 예식장 3곳 방문하기",
    description: "함께 예식장을 둘러보고 각자의 의견을 나눠보세요",
    type: "couple",
    assignee: "both",
    status: "active",
    deadline: "2024-09-25",
    reward: "커플 배지",
    progress: 33,
  },
  {
    id: "2",
    title: "각자 정장/드레스 후보 5개씩 찾기",
    description: "서로의 취향을 알아보는 시간을 가져보세요",
    type: "individual",
    status: "active",
    deadline: "2024-09-30",
    reward: "패션 배지",
    progress: 60,
  },
  {
    id: "3",
    title: "혼주 예복 함께 선택하기",
    description: "양가 부모님과 함께 예복을 선택해보세요",
    type: "couple",
    assignee: "both",
    status: "completed",
    deadline: "2024-09-15",
    reward: "가족 배지",
    progress: 100,
  },
]

const mockNotifications: Notification[] = [
  {
    id: "1",
    message: "신부가 웨딩드레스 예약을 완료했어요! 확인해보세요 💕",
    time: "2시간 전",
    type: "completion",
    from: "bride",
  },
  {
    id: "2",
    message: "신랑이 예식장 계약서를 업로드했어요",
    time: "1일 전",
    type: "update",
    from: "groom",
  },
  {
    id: "3",
    message: "오늘은 웨딩촬영 상담 예약일이에요!",
    time: "3시간 전",
    type: "reminder",
    from: "bride",
  },
]

const mockEmotionalCheckIns: EmotionalCheckIn[] = [
  {
    id: "1",
    date: "2024-09-18",
    mood: "happy",
    stressLevel: 3,
    note: "오늘 예식장을 확정해서 기분이 좋아요!",
    user: "bride",
  },
  {
    id: "2",
    date: "2024-09-17",
    mood: "stressed",
    stressLevel: 7,
    note: "예산 관리가 생각보다 복잡해요",
    user: "groom",
  },
  {
    id: "3",
    date: "2024-09-16",
    mood: "neutral",
    stressLevel: 5,
    user: "bride",
  },
]

export function TogetherMode() {
  const router = useRouter()
  const [missions, setMissions] = useState<Mission[]>(mockMissions)
  const [notifications, setNotifications] = useState<Notification[]>(mockNotifications)
  const [emotionalCheckIns, setEmotionalCheckIns] = useState<EmotionalCheckIn[]>(mockEmotionalCheckIns)
  const [newCheckIn, setNewCheckIn] = useState({
    mood: "neutral" as "happy" | "neutral" | "stressed",
    stressLevel: 5,
    note: "",
  })

  const activeMissions = missions.filter((m) => m.status === "active")
  const completedMissions = missions.filter((m) => m.status === "completed")
  const overallProgress = missions.length > 0 ? (completedMissions.length / missions.length) * 100 : 0

  const addEmotionalCheckIn = () => {
    const checkIn: EmotionalCheckIn = {
      id: Date.now().toString(),
      date: new Date().toISOString().split("T")[0],
      mood: newCheckIn.mood,
      stressLevel: newCheckIn.stressLevel,
      note: newCheckIn.note,
      user: "bride", // Mock current user
    }
    setEmotionalCheckIns([checkIn, ...emotionalCheckIns])
    setNewCheckIn({ mood: "neutral", stressLevel: 5, note: "" })
  }

  const getMoodIcon = (mood: "happy" | "neutral" | "stressed") => {
    switch (mood) {
      case "happy":
        return <Smile className="w-5 h-5 text-green-500" />
      case "neutral":
        return <Meh className="w-5 h-5 text-yellow-500" />
      case "stressed":
        return <Frown className="w-5 h-5 text-red-500" />
    }
  }

  const getNotificationIcon = (type: "completion" | "update" | "reminder") => {
    switch (type) {
      case "completion":
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case "update":
        return <MessageCircle className="w-4 h-4 text-blue-500" />
      case "reminder":
        return <Bell className="w-4 h-4 text-orange-500" />
    }
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로
        </Button>
        <h1 className="text-xl font-bold">투게더 모드</h1>
        <div className="w-16"></div>
      </div>

      {/* Couple Status */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-center space-x-4 mb-4">
            <div className="flex flex-col items-center">
              <Avatar className="w-12 h-12 mb-2">
                <AvatarFallback className="bg-pink-100 text-pink-600">신부</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">온라인</span>
              </div>
            </div>
            <Heart className="w-8 h-8 text-primary fill-primary" />
            <div className="flex flex-col items-center">
              <Avatar className="w-12 h-12 mb-2">
                <AvatarFallback className="bg-blue-100 text-blue-600">신랑</AvatarFallback>
              </Avatar>
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-muted-foreground">온라인</span>
              </div>
            </div>
          </div>
          <div className="text-center space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">함께 달성률</span>
              <span className="text-sm font-bold text-primary">{Math.round(overallProgress)}%</span>
            </div>
            <Progress value={overallProgress} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {completedMissions.length}개 완료 / 총 {missions.length}개 미션
            </p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="missions" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="missions">미션</TabsTrigger>
          <TabsTrigger value="notifications">알림</TabsTrigger>
          <TabsTrigger value="emotions">감정체크</TabsTrigger>
        </TabsList>

        <TabsContent value="missions" className="space-y-4">
          {/* Active Missions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Target className="w-5 h-5 text-primary" />
                <span>진행 중인 미션</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeMissions.map((mission) => (
                <div key={mission.id} className="p-3 bg-muted/50 rounded-lg space-y-2">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm">{mission.title}</h4>
                      <p className="text-xs text-muted-foreground mt-1">{mission.description}</p>
                    </div>
                    <Badge variant={mission.type === "couple" ? "default" : "secondary"} className="text-xs">
                      {mission.type === "couple" ? "커플" : "개별"}
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground">진행률</span>
                      <span className="font-medium">{mission.progress}%</span>
                    </div>
                    <Progress value={mission.progress} className="h-2" />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>마감: {mission.deadline}</span>
                      <span>보상: {mission.reward}</span>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Completed Missions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                <span>완료된 미션</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {completedMissions.map((mission) => (
                <div key={mission.id} className="p-3 bg-green-50 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-sm text-green-800">{mission.title}</h4>
                      <p className="text-xs text-green-600 mt-1">완료일: {mission.deadline}</p>
                    </div>
                    <CheckCircle className="w-5 h-5 text-green-500" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Bell className="w-5 h-5 text-primary" />
                <span>실시간 알림</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {notifications.map((notification) => (
                <div key={notification.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="mt-0.5">{getNotificationIcon(notification.type)}</div>
                  <div className="flex-1">
                    <p className="text-sm">{notification.message}</p>
                    <div className="flex items-center space-x-2 mt-1">
                      <span className="text-xs text-muted-foreground">{notification.time}</span>
                      <Badge variant="outline" className="text-xs">
                        {notification.from === "bride" ? "신부" : "신랑"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="emotions" className="space-y-4">
          {/* Add Emotional Check-in */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">오늘의 감정 체크인</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-2 block">기분은 어떠세요?</label>
                <div className="flex space-x-4">
                  {(["happy", "neutral", "stressed"] as const).map((mood) => (
                    <button
                      key={mood}
                      onClick={() => setNewCheckIn({ ...newCheckIn, mood })}
                      className={`p-3 rounded-lg border-2 transition-colors ${
                        newCheckIn.mood === mood ? "border-primary bg-primary/10" : "border-muted"
                      }`}
                    >
                      {getMoodIcon(mood)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">스트레스 지수 (1-10)</label>
                <Input
                  type="range"
                  min="1"
                  max="10"
                  value={newCheckIn.stressLevel}
                  onChange={(e) => setNewCheckIn({ ...newCheckIn, stressLevel: Number.parseInt(e.target.value) })}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>낮음</span>
                  <span className="font-medium">{newCheckIn.stressLevel}</span>
                  <span>높음</span>
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">메모 (선택)</label>
                <Textarea
                  placeholder="오늘의 기분이나 생각을 적어보세요..."
                  value={newCheckIn.note}
                  onChange={(e) => setNewCheckIn({ ...newCheckIn, note: e.target.value })}
                />
              </div>
              <Button onClick={addEmotionalCheckIn} className="w-full">
                체크인 완료
              </Button>
            </CardContent>
          </Card>

          {/* Recent Check-ins */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">최근 감정 기록</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {emotionalCheckIns.slice(0, 5).map((checkIn) => (
                <div key={checkIn.id} className="flex items-start space-x-3 p-3 bg-muted/50 rounded-lg">
                  <div className="mt-0.5">{getMoodIcon(checkIn.mood)}</div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-sm font-medium">{checkIn.date}</span>
                      <Badge variant="outline" className="text-xs">
                        {checkIn.user === "bride" ? "신부" : "신랑"}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-xs text-muted-foreground">스트레스:</span>
                      <div className="flex space-x-1">
                        {Array.from({ length: 10 }, (_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${i < checkIn.stressLevel ? "bg-red-400" : "bg-gray-200"}`}
                          />
                        ))}
                      </div>
                    </div>
                    {checkIn.note && <p className="text-xs text-muted-foreground">{checkIn.note}</p>}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
