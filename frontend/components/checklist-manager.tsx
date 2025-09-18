"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ArrowLeft, CheckCircle, Circle, Star, User, Heart, Camera, MessageSquare, Plus, Trash2, LogOut } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import {
  collection,
  query,
  where,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  orderBy
} from "firebase/firestore"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

interface ChecklistItem {
  id: string
  title: string
  category: "essential" | "optional"
  timeline: "6months" | "3months" | "1month" | "1week"
  priority: "high" | "medium" | "low"
  assignee: "bride" | "groom" | "both"
  status: "todo" | "in-progress" | "completed"
  notes?: string
  photos?: string[]
  dueDate?: string
  ownerUid: string
  createdAt?: any
  updatedAt?: any
}

export function ChecklistManager() {
  const router = useRouter()
  const { user } = useAuth()
  const [items, setItems] = useState<ChecklistItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<"all" | "essential" | "optional">("all")
  const [selectedTimeline, setSelectedTimeline] = useState<"all" | "6months" | "3months" | "1month" | "1week">("all")
  const [selectedItem, setSelectedItem] = useState<ChecklistItem | null>(null)
  const [newItemTitle, setNewItemTitle] = useState("")
  const [loading, setLoading] = useState(true)
  const [noteText, setNoteText] = useState("")

  // Firestore에서 실시간으로 데이터 가져오기
  useEffect(() => {
    if (!user?.uid) {
      setItems([])
      setLoading(false)
      return
    }

    const q = query(
      collection(db, "checklists"),
      where("ownerUid", "==", user.uid),
      orderBy("createdAt", "desc")
    )

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const checklistItems: ChecklistItem[] = []
      querySnapshot.forEach((doc) => {
        checklistItems.push({
          id: doc.id,
          ...doc.data()
        } as ChecklistItem)
      })
      setItems(checklistItems)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [user?.uid])

  const filteredItems = items.filter((item) => {
    const categoryMatch = selectedCategory === "all" || item.category === selectedCategory
    const timelineMatch = selectedTimeline === "all" || item.timeline === selectedTimeline
    return categoryMatch && timelineMatch
  })

  const completedItems = items.filter((item) => item.status === "completed").length
  const totalItems = items.length
  const progressPercentage = totalItems === 0 ? 0 : (completedItems / totalItems) * 100

  const toggleItemStatus = async (itemId: string, currentStatus: ChecklistItem["status"]) => {
    const newStatus = currentStatus === "completed" ? "todo" : currentStatus === "todo" ? "in-progress" : "completed"

    try {
      await updateDoc(doc(db, "checklists", itemId), {
        status: newStatus,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error("상태 업데이트 실패:", error)
    }
  }

  const deleteItem = async (itemId: string) => {
    try {
      await deleteDoc(doc(db, "checklists", itemId))
    } catch (error) {
      console.error("항목 삭제 실패:", error)
    }
  }

  const updateItemNotes = async (itemId: string, notes: string) => {
    try {
      await updateDoc(doc(db, "checklists", itemId), {
        notes: notes,
        updatedAt: serverTimestamp()
      })
    } catch (error) {
      console.error("메모 업데이트 실패:", error)
    }
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      router.push('/login')
    } catch (error) {
      console.error("로그아웃 실패:", error)
    }
  }

  const addNewItem = async () => {
    if (!newItemTitle.trim() || !user?.uid) return

    try {
      await addDoc(collection(db, "checklists"), {
        title: newItemTitle,
        category: "optional",
        timeline: "1month",
        priority: "medium",
        assignee: "both",
        status: "todo",
        ownerUid: user.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      })
      setNewItemTitle("")
    } catch (error) {
      console.error("할 일 추가 실패:", error)
    }
  }

  const getStatusIcon = (status: ChecklistItem["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-primary fill-primary" />
      case "in-progress":
        return <Circle className="w-5 h-5 text-blue-500 fill-blue-100" />
      default:
        return <Circle className="w-5 h-5 text-muted-foreground" />
    }
  }

  const getAssigneeIcon = (assignee: ChecklistItem["assignee"]) => {
    switch (assignee) {
      case "both":
        return <Heart className="w-4 h-4 text-primary" />
      case "bride":
        return <User className="w-4 h-4 text-pink-500" />
      case "groom":
        return <User className="w-4 h-4 text-blue-500" />
    }
  }

  const getPriorityColor = (priority: ChecklistItem["priority"]) => {
    switch (priority) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
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
        <h1 className="text-xl font-bold">체크리스트</h1>
        <Button variant="ghost" size="sm" onClick={handleLogout}>
          <LogOut className="w-4 h-4 mr-2" />
          로그아웃
        </Button>
      </div>

      {/* Progress Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">전체 진행률</span>
            <span className="text-sm font-bold text-primary">{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-3 mb-2" />
          <p className="text-xs text-muted-foreground text-center">
            {completedItems}개 완료 / 총 {totalItems}개
          </p>
        </CardContent>
      </Card>

      {/* Filters */}
      <Tabs value={selectedCategory} onValueChange={(value) => setSelectedCategory(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="essential">필수</TabsTrigger>
          <TabsTrigger value="optional">선택</TabsTrigger>
        </TabsList>
      </Tabs>

      <Tabs value={selectedTimeline} onValueChange={(value) => setSelectedTimeline(value as any)}>
        <TabsList className="grid w-full grid-cols-4 text-xs">
          <TabsTrigger value="all">전체</TabsTrigger>
          <TabsTrigger value="6months">6개월전</TabsTrigger>
          <TabsTrigger value="3months">3개월전</TabsTrigger>
          <TabsTrigger value="1month">1개월전</TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Add New Item */}
      <Card>
        <CardContent className="p-4">
          <div className="flex space-x-2">
            <Input
              placeholder="새 할 일 추가..."
              value={newItemTitle}
              onChange={(e) => setNewItemTitle(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addNewItem()}
            />
            <Button size="sm" onClick={addNewItem}>
              <Plus className="w-4 h-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Checklist Items */}
      <div className="space-y-3">
        {loading ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">로딩 중...</p>
            </CardContent>
          </Card>
        ) : !user ? (
          <Card>
            <CardContent className="p-8 text-center">
              <p className="text-muted-foreground">로그인이 필요합니다</p>
            </CardContent>
          </Card>
        ) : filteredItems.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <CheckCircle className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">할 일이 없습니다. 새로운 할 일을 추가해보세요!</p>
            </CardContent>
          </Card>
        ) : (
          filteredItems.map((item) => (
            <Card key={item.id} className={`transition-all ${item.status === "completed" ? "opacity-60" : ""}`}>
              <CardContent className="p-4">
                <div className="flex items-start space-x-3">
                  <button onClick={() => toggleItemStatus(item.id, item.status)} className="mt-0.5">
                    {getStatusIcon(item.status)}
                  </button>

                  <div className="flex-1 space-y-2">
                    <div className="flex items-start justify-between">
                      <h3
                        className={`font-medium ${item.status === "completed" ? "line-through text-muted-foreground" : ""}`}
                      >
                        {item.title}
                      </h3>
                      <div className="flex items-center space-x-1">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" onClick={() => {
                              setSelectedItem(item)
                              setNoteText(item.notes || "")
                            }}>
                              <MessageSquare className="w-4 h-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>{item.title}</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="flex items-center space-x-2">
                                {getAssigneeIcon(item.assignee)}
                                <span className="text-sm">
                                  {item.assignee === "both" ? "함께" : item.assignee === "bride" ? "신부" : "신랑"}
                                </span>
                              </div>
                              {item.dueDate && <p className="text-sm text-muted-foreground">마감일: {item.dueDate}</p>}
                              {item.notes && (
                                <div>
                                  <h4 className="text-sm font-medium mb-1">메모</h4>
                                  <p className="text-sm text-muted-foreground">{item.notes}</p>
                                </div>
                              )}
                              <div className="space-y-2">
                                <h4 className="text-sm font-medium">메모 편집</h4>
                                <Textarea
                                  placeholder="메모를 입력하세요..."
                                  value={noteText}
                                  onChange={(e) => setNoteText(e.target.value)}
                                />
                                <Button
                                  size="sm"
                                  onClick={() => {
                                    updateItemNotes(item.id, noteText)
                                    setSelectedItem(null)
                                    setNoteText("")
                                  }}
                                >
                                  메모 저장
                                </Button>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => deleteItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Badge variant={getPriorityColor(item.priority)} className="text-xs">
                        {item.priority === "high" ? "긴급" : item.priority === "medium" ? "보통" : "낮음"}
                      </Badge>

                      <Badge variant="outline" className="text-xs">
                        {item.category === "essential" ? "필수" : "선택"}
                      </Badge>

                      <div className="flex items-center space-x-1">
                        {getAssigneeIcon(item.assignee)}
                        <span className="text-xs text-muted-foreground">
                          {item.assignee === "both" ? "함께" : item.assignee === "bride" ? "신부" : "신랑"}
                        </span>
                      </div>

                      {item.priority === "high" && <Star className="w-3 h-3 text-yellow-500 fill-yellow-500" />}
                    </div>

                    {item.dueDate && <p className="text-xs text-muted-foreground">마감: {item.dueDate}</p>}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
