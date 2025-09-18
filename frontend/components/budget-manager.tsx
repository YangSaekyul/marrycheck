"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Plus, Camera, AlertTriangle, TrendingUp, Receipt } from "lucide-react"
import { useRouter } from "next/navigation"

interface BudgetCategory {
  id: string
  name: string
  icon: string
  budgetAmount: number
  spentAmount: number
  color: string
}

interface Expense {
  id: string
  categoryId: string
  amount: number
  description: string
  date: string
  receipt?: string
  addedBy: "bride" | "groom"
}

const mockBudgetCategories: BudgetCategory[] = [
  {
    id: "studio",
    name: "스튜디오",
    icon: "📸",
    budgetAmount: 5000000,
    spentAmount: 4000000,
    color: "bg-blue-500",
  },
  {
    id: "venue",
    name: "예식비용",
    icon: "💐",
    budgetAmount: 7000000,
    spentAmount: 4200000,
    color: "bg-primary",
  },
  {
    id: "dress",
    name: "드레스",
    icon: "👗",
    budgetAmount: 3000000,
    spentAmount: 1200000,
    color: "bg-pink-500",
  },
  {
    id: "reception",
    name: "피로연",
    icon: "🍰",
    budgetAmount: 4000000,
    spentAmount: 0,
    color: "bg-orange-500",
  },
  {
    id: "other",
    name: "기타",
    icon: "🏠",
    budgetAmount: 1000000,
    spentAmount: 200000,
    color: "bg-gray-500",
  },
]

const mockExpenses: Expense[] = [
  {
    id: "1",
    categoryId: "venue",
    amount: 2000000,
    description: "예식장 계약금",
    date: "2024-08-15",
    addedBy: "groom",
  },
  {
    id: "2",
    categoryId: "studio",
    amount: 1500000,
    description: "웨딩촬영 예약금",
    date: "2024-08-20",
    addedBy: "bride",
  },
  {
    id: "3",
    categoryId: "dress",
    amount: 800000,
    description: "웨딩드레스 1차 결제",
    date: "2024-09-01",
    addedBy: "bride",
  },
]

export function BudgetManager() {
  const router = useRouter()
  const [categories, setCategories] = useState<BudgetCategory[]>(mockBudgetCategories)
  const [expenses, setExpenses] = useState<Expense[]>(mockExpenses)
  const [newExpense, setNewExpense] = useState({
    categoryId: "",
    amount: "",
    description: "",
    date: new Date().toISOString().split("T")[0],
  })

  const totalBudget = categories.reduce((sum, cat) => sum + cat.budgetAmount, 0)
  const totalSpent = categories.reduce((sum, cat) => sum + cat.spentAmount, 0)
  const totalPercentage = (totalSpent / totalBudget) * 100

  const addExpense = () => {
    if (newExpense.categoryId && newExpense.amount && newExpense.description) {
      const expense: Expense = {
        id: Date.now().toString(),
        categoryId: newExpense.categoryId,
        amount: Number.parseInt(newExpense.amount),
        description: newExpense.description,
        date: newExpense.date,
        addedBy: "bride", // Mock user
      }

      setExpenses([...expenses, expense])

      // Update category spent amount
      setCategories(
        categories.map((cat) =>
          cat.id === newExpense.categoryId ? { ...cat, spentAmount: cat.spentAmount + expense.amount } : cat,
        ),
      )

      setNewExpense({
        categoryId: "",
        amount: "",
        description: "",
        date: new Date().toISOString().split("T")[0],
      })
    }
  }

  const getCategoryById = (id: string) => categories.find((cat) => cat.id === id)

  const getRecentExpenses = () => {
    return expenses.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5)
  }

  const getWarningCategories = () => {
    return categories.filter((cat) => {
      const percentage = (cat.spentAmount / cat.budgetAmount) * 100
      return percentage >= 80
    })
  }

  return (
    <div className="container mx-auto p-4 space-y-6 max-w-md">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          뒤로
        </Button>
        <h1 className="text-xl font-bold">예산 관리</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>지출 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label htmlFor="category">카테고리</Label>
                <Select
                  value={newExpense.categoryId}
                  onValueChange={(value) => setNewExpense({ ...newExpense, categoryId: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="카테고리 선택" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.icon} {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="amount">금액</Label>
                <Input
                  id="amount"
                  type="number"
                  placeholder="금액 입력"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({ ...newExpense, amount: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="description">내용</Label>
                <Input
                  id="description"
                  placeholder="지출 내용"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="date">날짜</Label>
                <Input
                  id="date"
                  type="date"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={addExpense} className="flex-1">
                  추가
                </Button>
                <Button variant="outline" size="sm">
                  <Camera className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Overall Budget Overview */}
      <Card className="bg-gradient-to-r from-primary/5 to-secondary/5">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">전체 예산 사용률</span>
              <span className="text-sm font-bold text-primary">{Math.round(totalPercentage)}%</span>
            </div>
            <Progress value={totalPercentage} className="h-3" />
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">사용: {totalSpent.toLocaleString()}원</span>
              <span className="text-muted-foreground">총 예산: {totalBudget.toLocaleString()}원</span>
            </div>
            <div className="text-center">
              <span className="text-lg font-bold text-primary">
                {(totalBudget - totalSpent).toLocaleString()}원 남음
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Warnings */}
      {getWarningCategories().length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 mb-2">
              <AlertTriangle className="w-5 h-5 text-orange-500" />
              <span className="font-medium text-orange-700">예산 주의</span>
            </div>
            {getWarningCategories().map((cat) => {
              const percentage = (cat.spentAmount / cat.budgetAmount) * 100
              return (
                <p key={cat.id} className="text-sm text-orange-600">
                  {cat.icon} {cat.name}: {Math.round(percentage)}% 사용됨
                </p>
              )
            })}
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="categories">카테고리별</TabsTrigger>
          <TabsTrigger value="expenses">지출 내역</TabsTrigger>
        </TabsList>

        <TabsContent value="categories" className="space-y-4">
          {/* Category Budget Breakdown */}
          {categories.map((category) => {
            const percentage = (category.spentAmount / category.budgetAmount) * 100
            const isWarning = percentage >= 80

            return (
              <Card key={category.id} className={isWarning ? "border-orange-200" : ""}>
                <CardContent className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{category.icon}</span>
                        <span className="font-medium">{category.name}</span>
                      </div>
                      <Badge variant={isWarning ? "destructive" : "secondary"}>{Math.round(percentage)}%</Badge>
                    </div>

                    <Progress value={percentage} className={`h-2 ${isWarning ? "bg-orange-100" : ""}`} />

                    <div className="flex justify-between text-sm text-muted-foreground">
                      <span>{category.spentAmount.toLocaleString()}원 사용</span>
                      <span>{category.budgetAmount.toLocaleString()}원 예산</span>
                    </div>

                    <div className="text-center">
                      <span className={`text-sm font-medium ${isWarning ? "text-orange-600" : "text-primary"}`}>
                        {(category.budgetAmount - category.spentAmount).toLocaleString()}원 남음
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>

        <TabsContent value="expenses" className="space-y-4">
          {/* Recent Expenses */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <Receipt className="w-5 h-5" />
                <span>최근 지출</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {getRecentExpenses().map((expense) => {
                const category = getCategoryById(expense.categoryId)
                return (
                  <div key={expense.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <span>{category?.icon}</span>
                        <span className="font-medium text-sm">{expense.description}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="outline" className="text-xs">
                          {category?.name}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{expense.date}</span>
                        <span className="text-xs text-muted-foreground">
                          {expense.addedBy === "bride" ? "신부" : "신랑"}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-primary">{expense.amount.toLocaleString()}원</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Monthly Trend */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center space-x-2">
                <TrendingUp className="w-5 h-5" />
                <span>이번 달 지출</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center space-y-2">
                <div className="text-2xl font-bold text-primary">
                  {expenses
                    .filter((exp) => exp.date.startsWith("2024-09"))
                    .reduce((sum, exp) => sum + exp.amount, 0)
                    .toLocaleString()}
                  원
                </div>
                <p className="text-sm text-muted-foreground">9월 총 지출</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
