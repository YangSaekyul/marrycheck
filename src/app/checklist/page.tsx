'use client'

import { useState, useEffect } from 'react'
import { Plus, Search, CheckCircle2, Circle, Clock, MoreVertical, Sparkles } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { createClient } from '@/utils/supabase/client'

// Todo Data Type (Supabase Schema 기반)
interface TodoItem {
  id: string
  couple_id: string
  title: string
  assignee: 'bride' | 'groom' | 'both'
  completed: boolean
  category: string
  created_at: string
  due_date?: string
  due_time?: string
}

export default function ChecklistPage() {
  const [todos, setTodos] = useState<TodoItem[]>([])
  const [filter, setFilter] = useState<'all' | 'bride' | 'groom' | 'both'>('all')
  const [isLoading, setIsLoading] = useState(true)
  const [isAdding, setIsAdding] = useState(false)
  const [newTitle, setNewTitle] = useState('')
  const [newDueDate, setNewDueDate] = useState('')
  const [newDueTime, setNewDueTime] = useState('')

  const { userProfile } = useAuth()
  const supabase = createClient()

  // 1. Supabase에서 투두 리스트 불러오기
  const fetchTodos = async () => {
    if (!userProfile?.couple_id) return
    setIsLoading(true)
    
    const { data, error } = await supabase
      .from('todos')
      .select('*')
      .eq('couple_id', userProfile.couple_id)
      .order('created_at', { ascending: false })

    if (!error && data) {
      setTodos(data as TodoItem[])
    } else {
      console.error('Failed to fetch todos:', error)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchTodos()
  }, [userProfile?.couple_id])

  // 2. 투두 항목 완료 토글 (Real Backend)
  const toggleTodo = async (id: string, currentCompleted: boolean) => {
    // Optimistic UI 업데이트 (화면 먼저 반영)
    setTodos(prev => prev.map(t => t.id === id ? { ...t, completed: !currentCompleted } : t))
    
    // 백엔드 통신
    const { error } = await supabase
      .from('todos')
      .update({ completed: !currentCompleted })
      .eq('id', id)
      
    if (error) {
       // 롤백
       console.error('Toggle error:', error)
       fetchTodos()
    }
  }

  const handleAddTodo = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) {
      alert('할 일 내용을 입력해주세요.')
      return
    }
    if (!userProfile?.couple_id) {
       alert('데이터 동기화가 필요합니다. 화면을 새로고침(F5)하시거나, 로그아웃 후 다시 로그인해주세요!')
       return
    }

    const insertData: any = {
        title: newTitle,
        couple_id: userProfile.couple_id,
        assignee: 'both',
        category: '일반',
    }
    if (newDueDate) insertData.due_date = newDueDate
    if (newDueTime) insertData.due_time = newDueTime

    const { data, error } = await supabase
      .from('todos')
      .insert(insertData)
      .select()
      .single()

    if (error) {
       alert('할 일 추가 실패: ' + error.message)
    } else if (data) {
       setTodos([data as TodoItem, ...todos])
       setNewTitle('')
       setNewDueDate('')
       setNewDueTime('')
       setIsAdding(false)
    }
  }

  const filteredTodos = todos.filter(todo => filter === 'all' || todo.assignee === filter)

  const getAssigneeColor = (assignee: string) => {
    switch (assignee) {
      case 'bride': return 'bg-pink-100 text-pink-700'
      case 'groom': return 'bg-blue-100 text-blue-700'
      case 'both': return 'bg-purple-100 text-purple-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  const getAssigneeLabel = (assignee: string) => {
    switch (assignee) {
      case 'bride': return '신부'
      case 'groom': return '신랑'
      case 'both': return '함께'
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
            onClick={() => setFilter('both')}
            className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              filter === 'both' ? 'bg-purple-500 text-white' : 'bg-purple-50 text-purple-600 hover:bg-purple-100'
            }`}
          >
            함께 ({(todos.filter(t => t.assignee === 'both').length)})
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
      <div className="px-6 py-4 space-y-3 relative">
        {isLoading ? (
          <div className="text-center py-12 text-gray-400 font-medium animate-pulse">
            체크리스트 불러오는 중...
          </div>
        ) : filteredTodos.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-gray-200 shadow-sm mt-4">
            <div className="w-16 h-16 bg-pink-50 rounded-full flex items-center justify-center mx-auto mb-4 text-pink-500">
              <Sparkles size={24} />
            </div>
            <p className="text-gray-800 font-bold text-lg mb-2">아직 등록된 할 일이 없어요!</p>
            <p className="text-sm text-gray-500 mb-8">결혼 준비의 첫 걸음, 새로운 미션을 추가해볼까요?</p>
            <button 
              onClick={() => setIsAdding(true)}
              className="inline-flex items-center space-x-2 bg-gray-900 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-800 transition-colors shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
              <Plus size={20} />
              <span>첫 할 일 작성하기</span>
            </button>
          </div>
        ) : (
          filteredTodos.map((todo) => (
            <div
              key={todo.id}
              onClick={() => toggleTodo(todo.id, todo.completed)}
              className={`group flex items-center justify-between p-4 rounded-2xl border transition-all cursor-pointer ${
                todo.completed 
                  ? 'bg-gray-50 border-gray-100' 
                  : 'bg-white border-gray-200 shadow-sm'
              }`}
            >
              <div className="flex items-center space-x-4">
                <button className="flex-shrink-0 focus:outline-none">
                  {todo.completed ? (
                    <CheckCircle2 size={24} className="text-pink-500/50" />
                  ) : (
                    <Circle size={24} className="text-gray-300" />
                  )}
                </button>
                
                <div className="flex flex-col">
                  <span className={`text-base font-medium transition-colors ${
                    todo.completed ? 'text-gray-400 line-through' : 'text-gray-800'
                  }`}>
                    {todo.title}
                  </span>
                  
                  <div className="flex items-center mt-1.5 space-x-2">
                    <span className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${getAssigneeColor(todo.assignee)}`}>
                      {getAssigneeLabel(todo.assignee)}
                    </span>
                    <span className="text-xs text-gray-400 font-medium">{todo.category}</span>
                    
                    {(todo.due_date || todo.due_time) && (
                      <span className="text-xs text-pink-500 font-medium flex items-center bg-pink-50 px-2 py-0.5 rounded-md">
                        <Clock size={12} className="mr-1" />
                        {todo.due_date && todo.due_date.substring(5).replace('-', '/')} {todo.due_time && todo.due_time.substring(0, 5)}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              <button 
                onClick={(e) => {
                  e.stopPropagation()
                  // TODO: 수정/삭제 메뉴 구현
                }}
                className="text-gray-300 hover:text-gray-500 p-2"
              >
                <MoreVertical size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* 추가 폼 모달 */}
      {isAdding && (
         <div className="fixed inset-0 z-50 bg-black/50 flex items-end sm:items-center justify-center sm:p-4">
           <form onSubmit={handleAddTodo} className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10">
              <h3 className="text-lg font-bold text-gray-800 mb-4">새로운 할 일 등록</h3>
              <input 
                 autoFocus
                 type="text" 
                 value={newTitle}
                 onChange={e => setNewTitle(e.target.value)}
                 placeholder="예) 청첩장 시안 확인하기" 
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <div className="flex space-x-3 mb-6">
                 <div className="flex-1">
                   <label className="text-xs font-semibold text-gray-500 mb-1 block">목표 날짜</label>
                   <input 
                     type="date" 
                     value={newDueDate} onChange={e => setNewDueDate(e.target.value)}
                     className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700 font-medium"
                   />
                 </div>
                 <div className="flex-1">
                   <label className="text-xs font-semibold text-gray-500 mb-1 block">시간 (선택)</label>
                   <input 
                     type="time" 
                     value={newDueTime} onChange={e => setNewDueTime(e.target.value)}
                     className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm text-gray-700 font-medium"
                   />
                 </div>
              </div>
              <div className="flex space-x-3">
                 <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-gray-500 font-semibold bg-gray-100 rounded-xl">취소</button>
                 <button type="submit" disabled={!newTitle.trim()} className="flex-1 py-3 text-white font-semibold bg-pink-500 disabled:opacity-50 rounded-xl">저장</button>
              </div>
           </form>
         </div>
      )}

      {/* FAB (Floating Action Button) */}
      <div className="fixed bottom-20 right-6 max-w-lg mx-auto z-20">
        <button onClick={() => setIsAdding(true)} className="w-14 h-14 bg-gray-900 text-white rounded-full flex items-center justify-center shadow-lg hover:bg-gray-800 hover:scale-105 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </div>
    </main>
  )
}
