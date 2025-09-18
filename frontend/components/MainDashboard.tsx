import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { CheckCircle, Circle, Heart, Calendar, DollarSign, Users } from 'lucide-react';
import Link from 'next/link';

export default function MainDashboard() {
  const quickStats = [
    {
      title: "완료된 작업",
      value: "12",
      total: "24",
      icon: CheckCircle,
      color: "text-green-600",
      href: "/checklist"
    },
    {
      title: "남은 일수",
      value: "127",
      unit: "일",
      icon: Calendar,
      color: "text-blue-600",
      href: "/timeline"
    },
    {
      title: "예산 사용",
      value: "₩3,200,000",
      total: "₩5,000,000",
      icon: DollarSign,
      color: "text-purple-600",
      href: "/budget"
    },
    {
      title: "초대 현황",
      value: "45",
      total: "60",
      icon: Users,
      color: "text-pink-600",
      href: "/invite"
    }
  ];

  const recentTasks = [
    { id: 1, title: "웨딩드레스 선택", completed: true, dueDate: "2024-01-15" },
    { id: 2, title: "예식장 예약", completed: true, dueDate: "2024-01-20" },
    { id: 3, title: "사진 촬영 예약", completed: false, dueDate: "2024-02-05" },
    { id: 4, title: "초대장 발송", completed: false, dueDate: "2024-02-10" }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">대시보드</h1>
        <p className="text-muted-foreground">
          결혼 준비 진행 상황을 한눈에 확인하세요
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {quickStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Link key={index} href={stat.href}>
              <Card className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stat.value}
                    {stat.unit && <span className="text-sm font-normal ml-1">{stat.unit}</span>}
                  </div>
                  {stat.total && (
                    <p className="text-xs text-muted-foreground">
                      총 {stat.total}
                    </p>
                  )}
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      <div className="grid gap-4 md:grid-cols-7">
        {/* Recent Tasks */}
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>최근 작업</CardTitle>
            <CardDescription>
              최근 추가되거나 업데이트된 작업들입니다
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentTasks.map((task) => (
                <div key={task.id} className="flex items-center space-x-3">
                  {task.completed ? (
                    <CheckCircle className="h-4 w-4 text-green-600" />
                  ) : (
                    <Circle className="h-4 w-4 text-gray-300" />
                  )}
                  <div className="flex-1">
                    <p className={`text-sm font-medium ${
                      task.completed ? 'line-through text-muted-foreground' : ''
                    }`}>
                      {task.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      마감: {task.dueDate}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-4">
              <Link href="/checklist">
                <Button variant="outline" className="w-full">
                  모든 작업 보기
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>빠른 작업</CardTitle>
            <CardDescription>
              자주 사용하는 기능들
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Link href="/checklist">
              <Button className="w-full justify-start" variant="ghost">
                <CheckCircle className="mr-2 h-4 w-4" />
                체크리스트 관리
              </Button>
            </Link>
            <Link href="/budget">
              <Button className="w-full justify-start" variant="ghost">
                <DollarSign className="mr-2 h-4 w-4" />
                예산 추가
              </Button>
            </Link>
            <Link href="/timeline">
              <Button className="w-full justify-start" variant="ghost">
                <Calendar className="mr-2 h-4 w-4" />
                일정 확인
              </Button>
            </Link>
            <Link href="/invite">
              <Button className="w-full justify-start" variant="ghost">
                <Users className="mr-2 h-4 w-4" />
                초대장 관리
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Wedding Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Heart className="h-5 w-5 text-pink-600" />
            <span>결혼 준비 진행률</span>
          </CardTitle>
          <CardDescription>
            전체 준비 과정의 50%가 완료되었습니다
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-primary h-2 rounded-full transition-all duration-300" style={{ width: '50%' }}></div>
          </div>
          <div className="flex justify-between text-sm text-muted-foreground mt-2">
            <span>50% 완료</span>
            <span>D-127</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}