'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, CheckCircle2, Circle, Clock, MoreVertical, Sparkles } from 'lucide-react'

// Mock Data Type
interface TodoItem {
  id: string
  title: string
  assignee: 'bride' | 'groom' | 'together'
  isCompleted: boolean
  dueDate?: string
  category: string
}

const MOCK_TODOS: TodoItem[] = [
  { id: '1', title: '웨딩홀 투어 및 계약', assignee: 'together', isCompleted: true, dueDate: '2023-11-20', category: '예식장' },
  { id: '2', title: '스드메 업체 선정', assignee: 'bride', isCompleted: false, dueDate: 'D-150', category: '스드메' },
  { id: '3', title: '예물 시계 알아보기', assignee: 'groom', isCompleted: false, dueDate: 'D-100', category: '예물/예단' },
  { id: '4', title: '신혼여행 패키지 예약', assignee: 'together', isCompleted: false, dueDate: 'D-90', category: '허니문' },
  { id: '5', title: '청첩장 디자인 고르기', assignee: 'bride', isCompleted: false, dueDate: 'D-60', category: '초대' },
]

export default function ChecklistPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [filter, setFilter] = useState<'all' | 'bride' | 'groom' | 'together'>('all')

  useEffect(() => {
    // Load from local storage or use mock data
    const saved = localStorage.getItem('marrycheck_mock_todos')
    if (saved) {
      setTodos(JSON.parse(saved))
    } else {
      setTodos(MOCK_TODOS)
      localStorage.setItem('marrycheck_mock_todos', JSON.stringify(MOCK_TODOS))
    }
  }, [])

  const toggleTodo = (id: string) => {
    const updated = todos.map(todo =>
      todo.id === id ? { ...todo, isCompleted: !todo.isCompleted } : todo
    )
    setTodos(updated)
    localStorage.setItem('marrycheck_mock_todos', JSON.stringify(updated))
  }

  const filteredTodos = todos.filter(todo => filter === 'all' || todo.assignee === filter)

  const getAssigneeColor = (assignee: string) => {
    switch (assignee) {
      case 'bride': return 'bg-pink-100 text-pink-700'
      case 'groom': return 'bg-blue-100 text-blue-700'
      case 'together': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getAssigneeLabel = (assignee: string) => {
    switch (assignee) {
      case 'bride': return '신부'
      case 'groom': return '신랑'
      case 'together': return '함께'
      default: return assignee
    }
  }

  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-800">투게더 체크리스트</h1>
        <p className="text-sm text-gray-500 mt-1 flex items-center">
          <Sparkles size={14} className="text-yellow-500 mr-1" />
          총 {todos.length}개의 할 일이 있어요
        </p>

        {/* Filters */}
        <div className="flex space-x-2 mt-6 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => setFilter('all')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'all' ? 'bg-gray-800 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            전체보기
          </button>
          <button
            onClick={() => setFilter('together')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'together' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
            }`}
          >
            함께 ({(todos.filter(t => t.assignee === 'together').length)})
          </button>
          <button
            onClick={() => setFilter('bride')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'bride' ? 'bg-pink-500 text-white' : 'bg-pink-50 text-pink-600 hover:bg-pink-100'
            }`}
          >
            신부 ({(todos.filter(t => t.assignee === 'bride').length)})
          </button>
          <button
            onClick={() => setFilter('groom')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'groom' ? 'bg-blue-500 text-white' : 'bg-blue-50 text-blue-600 hover:bg-blue-100'
            }`}
          >
            신랑 ({(todos.filter(t => t.assignee === 'groom').length)})
          </button>
        </div>
      </div>

      {/* Todo List */}
      <div className="px-6 py-4 space-y-3">
        {filteredTodos.map((todo) => (
          <div
            key={todo.id}
            onClick={() => toggleTodo(todo.id)}
            className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
              todo.isCompleted 
                ? 'bg-gray-50 border-gray-100' 
                : 'bg-white border-gray-200 hover:border-pink-200 shadow-sm'
            }`}
          >
            <div className="flex items-center space-x-4">
              <button className="flex-shrink-0 focus:outline-none">
                {todo.isCompleted ? (
                  <CheckCircle2 size={24} className="text-gray-300" />
                ) : (
                  <Circle size={24} className="text-gray-300 group-hover:text-pink-400 transition-colors" />
                )}
              </button>
              
              <div className="flex flex-col">
                <span className={`text-base font-medium transition-colors ${
                  todo.isCompleted ? 'text-gray-400 line-through' : 'text-gray-800'
                }`}>
                  {todo.title}
                </span>
                
                <div className="flex items-center mt-1.5 space-x-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${getAssigneeColor(todo.assignee)}`}>
                    {getAssigneeLabel(todo.assignee)}
                  </span>
                  <span className="text-xs text-gray-400 font-medium">{todo.category}</span>
                  {todo.dueDate && (
                    <span className="flex items-center text-[10px] text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                      <Clock size={10} className="mr-1" />
                      {todo.dueDate}
                    </span>
                  )}
                </div>
              </div>
            </div>
            
            <button className="text-gray-300 hover:text-gray-500 p-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <MoreVertical size={18} />
            </button>
          </div>
        ))}

        {filteredTodos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">할 일이 없습니다.</p>
          </div>
        )}
      </div>

      {/* FAB (Floating Action Button) */}
      <div className="fixed bottom-20 right-6 max-w-lg mx-auto z-20">
        <button className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </div>
    </main>
  )
}
