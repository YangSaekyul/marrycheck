"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, Calendar, Heart, Camera, MapPin, Download, Share, Clock, Star } from "lucide-react"
import { useRouter } from "next/navigation"

interface TimelineEvent {
  id: string
  date: string
  title: string
  description: string
  category: "venue" | "dress" | "photo" | "planning" | "family" | "other"
  photos?: string[]
  location?: string
  participants: ("bride" | "groom" | "both")[]
  milestone: boolean
  mood: "excited" | "happy" | "nervous" | "accomplished"
}

interface Story {
  id: string
  title: string
  coverPhoto: string
  events: TimelineEvent[]
  createdDate: string
  description: string
}

const mockTimelineEvents: TimelineEvent[] = [
  {
    id: "1",
    date: "2024-06-15",
    title: "프로포즈 성공!",
    description: "드디어 프로포즈를 받았어요! 한강공원에서 일몰을 보며 평생 잊지 못할 순간이었습니다.",
    category: "other",
    photos: ["/romantic-proposal-at-sunset.jpg"],
    location: "한강공원",
    participants: ["both"],
    milestone: true,
    mood: "excited",
  },
  {
    id: "2",
    date: "2024-07-20",
    title: "예식장 투어 시작",
    description: "첫 번째 예식장 방문! 생각보다 선택할 것이 많아서 놀랐어요.",
    category: "venue",
    photos: ["/elegant-wedding-venue-hall.jpg"],
    location: "드림웨딩홀",
    participants: ["both"],
    milestone: false,
    mood: "nervous",
  },
  {
    id: "3",
    date: "2024-08-10",
    title: "예식장 확정!",
    description: "드디어 예식장을 결정했어요! 12월 24일, 크리스마스 이브 결혼식이 확정되었습니다.",
    category: "venue",
    photos: ["/wedding-venue-contract-signing.jpg"],
    location: "드림웨딩홀",
    participants: ["both"],
    milestone: true,
    mood: "accomplished",
  },
  {
    id: "4",
    date: "2024-08-25",
    title: "웨딩드레스 쇼핑",
    description: "첫 번째 드레스 피팅! 생각보다 어려운 선택이네요.",
    category: "dress",
    photos: ["/bride-trying-wedding-dress.jpg"],
    location: "브라이덜샵",
    participants: ["bride"],
    milestone: false,
    mood: "excited",
  },
  {
    id: "5",
    date: "2024-09-05",
    title: "웨딩촬영 예약",
    description: "스튜디오 촬영과 야외 촬영 모두 예약했어요. 10월이 기대됩니다!",
    category: "photo",
    photos: ["/wedding-photography-studio.jpg"],
    location: "로맨틱스튜디오",
    participants: ["both"],
    milestone: false,
    mood: "happy",
  },
  {
    id: "6",
    date: "2024-09-15",
    title: "양가 상견례",
    description: "양가 부모님이 처음 만나시는 날! 다행히 분위기가 좋았어요.",
    category: "family",
    photos: ["/family-meeting-dinner.jpg"],
    location: "한정식집",
    participants: ["both"],
    milestone: true,
    mood: "accomplished",
  },
]

const mockStories: Story[] = [
  {
    id: "1",
    title: "우리의 시작",
    coverPhoto: "/romantic-proposal-at-sunset.jpg",
    events: mockTimelineEvents.slice(0, 2),
    createdDate: "2024-07-20",
    description: "프로포즈부터 예식장 찾기까지",
  },
  {
    id: "2",
    title: "예식 준비",
    coverPhoto: "/wedding-venue-contract-signing.jpg",
    events: mockTimelineEvents.slice(2, 5),
    createdDate: "2024-09-05",
    description: "예식장 확정과 드레스 선택",
  },
  {
    id: "3",
    title: "가족과 함께",
    coverPhoto: "/family-meeting-dinner.jpg",
    events: mockTimelineEvents.slice(5),
    createdDate: "2024-09-15",
    description: "양가 상견례와 가족 모임",
  },
]

export function TimelineStories() {
  const router = useRouter()
  const [events, setEvents] = useState<TimelineEvent[]>(mockTimelineEvents)
  const [stories, setStories] = useState<Story[]>(mockStories)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)

  const getCategoryIcon = (category: TimelineEvent["category"]) => {
    switch (category) {
      case "venue":
        return "🏛️"
      case "dress":
        return "👗"
      case "photo":
        return "📸"
      case "planning":
        return "📋"
      case "family":
        return "👨‍👩‍👧‍👦"
      default:
        return "💕"
    }
  }

  const getCategoryColor = (category: TimelineEvent["category"]) => {
    switch (category) {
      case "venue":
        return "bg-blue-500"
      case "dress":
        return "bg-pink-500"
      case "photo":
        return "bg-purple-500"
      case "planning":
        return "bg-green-500"
      case "family":
        return "bg-orange-500"
      default:
        return "bg-primary"
    }
  }

  const getMoodColor = (mood: TimelineEvent["mood"]) => {
    switch (mood) {
      case "excited":
        return "text-yellow-500"
      case "happy":
        return "text-green-500"
      case "nervous":
        return "text-blue-500"
      case "accomplished":
        return "text-purple-500"
    }
  }

  const sortedEvents = [...events].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
  const milestoneEvents = events.filter((event) => event.milestone)

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로
        </Button>
        <h1 className="text-xl font-bold">우리의 이야기</h1>
        <Button size="sm" variant="outline">
          <Share className="w-4 h-4" />
        </Button>
      </div>

      {/* Stats Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{events.length}</div>
              <div className="text-xs text-muted-foreground">총 추억</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{milestoneEvents.length}</div>
              <div className="text-xs text-muted-foreground">주요 순간</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{stories.length}</div>
              <div className="text-xs text-muted-foreground">스토리</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="timeline" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="timeline">타임라인</TabsTrigger>
          <TabsTrigger value="stories">스토리</TabsTrigger>
        </TabsList>

        <TabsContent value="timeline" className="space-y-4">
          {/* Timeline */}
          <div className="space-y-4">
            {sortedEvents.map((event, index) => (
              <div key={event.id} className="relative">
                {/* Timeline line */}
                {index < sortedEvents.length - 1 && <div className="absolute left-6 top-12 w-0.5 h-16 bg-border"></div>}

                <Card className={event.milestone ? "border-primary shadow-md" : ""}>
                  <CardContent className="p-4">
                    <div className="flex space-x-4">
                      {/* Timeline dot */}
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center text-white text-lg flex-shrink-0 ${getCategoryColor(event.category)}`}
                      >
                        {getCategoryIcon(event.category)}
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-start justify-between">
                          <div>
                            <h3 className="font-semibold flex items-center space-x-2">
                              <span>{event.title}</span>
                              {event.milestone && <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />}
                            </h3>
                            <div className="flex items-center space-x-2 text-xs text-muted-foreground mt-1">
                              <Calendar className="w-3 h-3" />
                              <span>{event.date}</span>
                              {event.location && (
                                <>
                                  <MapPin className="w-3 h-3" />
                                  <span>{event.location}</span>
                                </>
                              )}
                            </div>
                          </div>
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setSelectedEvent(event)}
                                className="flex-shrink-0"
                              >
                                <Camera className="w-4 h-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-sm">
                              <DialogHeader>
                                <DialogTitle>{event.title}</DialogTitle>
                              </DialogHeader>
                              <div className="space-y-4">
                                {event.photos && event.photos.length > 0 && (
                                  <div className="space-y-2">
                                    {event.photos.map((photo, idx) => (
                                      <img
                                        key={idx}
                                        src={photo || "/placeholder.svg"}
                                        alt={event.title}
                                        className="w-full h-48 object-cover rounded-lg"
                                      />
                                    ))}
                                  </div>
                                )}
                                <p className="text-sm text-muted-foreground">{event.description}</p>
                                <div className="flex items-center justify-between text-xs">
                                  <div className="flex items-center space-x-2">
                                    <Calendar className="w-3 h-3" />
                                    <span>{event.date}</span>
                                  </div>
                                  {event.location && (
                                    <div className="flex items-center space-x-1">
                                      <MapPin className="w-3 h-3" />
                                      <span>{event.location}</span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </DialogContent>
                          </Dialog>
                        </div>

                        <p className="text-sm text-muted-foreground">{event.description}</p>

                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="text-xs">
                            {event.category === "venue"
                              ? "예식장"
                              : event.category === "dress"
                                ? "드레스"
                                : event.category === "photo"
                                  ? "촬영"
                                  : event.category === "planning"
                                    ? "계획"
                                    : event.category === "family"
                                      ? "가족"
                                      : "기타"}
                          </Badge>
                          <div className="flex items-center space-x-1">
                            {event.participants.includes("bride") && (
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="bg-pink-100 text-pink-600 text-xs">신</AvatarFallback>
                              </Avatar>
                            )}
                            {event.participants.includes("groom") && (
                              <Avatar className="w-5 h-5">
                                <AvatarFallback className="bg-blue-100 text-blue-600 text-xs">신</AvatarFallback>
                              </Avatar>
                            )}
                          </div>
                          <Heart className={`w-4 h-4 ${getMoodColor(event.mood)}`} />
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="stories" className="space-y-4">
          {/* Stories */}
          {stories.map((story) => (
            <Card key={story.id}>
              <CardContent className="p-4">
                <div className="flex space-x-4">
                  <img
                    src={story.coverPhoto || "/placeholder.svg"}
                    alt={story.title}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold">{story.title}</h3>
                        <p className="text-sm text-muted-foreground">{story.description}</p>
                      </div>
                      <Button size="sm" variant="outline">
                        <Download className="w-4 h-4" />
                      </Button>
                    </div>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center space-x-1">
                        <Clock className="w-3 h-3" />
                        <span>{story.createdDate}</span>
                      </div>
                      <span>{story.events.length}개 추억</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Create Story Button */}
          <Card className="border-dashed border-2 border-muted-foreground/25">
            <CardContent className="p-8 text-center">
              <Button variant="ghost" className="flex-col space-y-2 h-auto">
                <Camera className="w-8 h-8 text-muted-foreground" />
                <span className="text-muted-foreground">새 스토리 만들기</span>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
