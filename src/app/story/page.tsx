'use client'

import { useState, useEffect } from 'react'
import { Plus, Camera, MapPin, Heart, Share2, MessageCircle } from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { useModal } from '@/contexts/ModalContext'
import { createClient } from '@/utils/supabase/client'

interface Story {
  id: string
  couple_id: string
  content: string
  date: string
  image_url?: string
}

export default function StoryPage() {
  const { userProfile } = useAuth()
  const { showAlert } = useModal()
  const supabase = createClient()
  
  const [stories, setStories] = useState<Story[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // 작성 폼 상태
  const [isAdding, setIsAdding] = useState(false)
  const [newContent, setNewContent] = useState('')
  const [newDate, setNewDate] = useState(new Date().toISOString().split('T')[0])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadFile, setUploadFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const fetchStories = async () => {
    if (!userProfile?.couple_id) return
    setIsLoading(true)
    const { data, error } = await supabase
      .from('stories')
      .select('*')
      .eq('couple_id', userProfile.couple_id)
      .order('date', { ascending: false })
      .order('created_at', { ascending: false })

    if (data && !error) {
      setStories(data)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    fetchStories()
  }, [userProfile?.couple_id])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setUploadFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleAddStory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newContent.trim() || !userProfile?.couple_id) return
    setIsUploading(true)

    try {
      let imageUrl = ''

      // 1. 이미지 파일이 있으면 Storage에 업로드
      if (uploadFile) {
        const fileExt = uploadFile.name.split('.').pop()
        const fileName = `${userProfile.couple_id}/${Math.random()}.${fileExt}`
        
        const { error: uploadError } = await supabase.storage
          .from('stories')
          .upload(fileName, uploadFile)

        if (uploadError) throw uploadError

        // 2. 업로드된 파일의 Public URL 가져오기
        const { data: urlData } = supabase.storage
          .from('stories')
          .getPublicUrl(fileName)
          
        imageUrl = urlData.publicUrl
      }

      // 3. DB에 스토리 기록
      const { error: insertError } = await supabase
        .from('stories')
        .insert({
          couple_id: userProfile.couple_id,
          content: newContent,
          date: newDate,
          image_url: imageUrl || null
        })

      if (insertError) throw insertError

      setNewContent('')
      setUploadFile(null)
      setPreviewUrl(null)
      setIsAdding(false)
      fetchStories()

    } catch (err: any) {
      showAlert('스토리 등록 실패: ' + err.message)
    } finally {
      setIsUploading(false)
    }
  }
  return (
    <main className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <div className="bg-white px-6 pt-12 pb-4 sticky top-0 z-10 border-b border-gray-100 shadow-sm flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">우리의 스토리</h1>
          <p className="text-sm text-gray-500 mt-1">준비 과정의 소중한 순간들을 기록하세요.</p>
        </div>
        <button className="p-2.5 bg-purple-50 rounded-full text-purple-600 hover:bg-purple-100 transition-colors">
          <Camera size={20} />
        </button>
      </div>

      {/* Main Content */}
      <div className="px-6 py-6 max-w-lg mx-auto">
        <div className="relative border-l-2 border-purple-100 ml-4 space-y-8 pb-8">
          
          {isLoading ? (
             <div className="py-20 text-center text-sm font-medium text-gray-400 animate-pulse w-full ml-4">
               우리의 추억을 불러오는 중...
             </div>
          ) : stories.length === 0 ? (
             <div className="py-20 text-center text-sm font-medium text-gray-500 w-full ml-4">
               첫 번째 스토리를 남겨주세요 💕
             </div>
          ) : (
            stories.map((story) => (
              <div key={story.id} className="relative pl-6">
                {/* Timeline Dot */}
                <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-purple-400 border-4 border-white shadow-sm"></div>
                
                {/* Date */}
                <div className="flex items-center space-x-2 mb-2 pt-5">
                  <span className="text-sm font-bold text-gray-800">{story.date}</span>
                </div>

                {/* Story Card */}
                <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-sm transition-shadow">
                  
                  {/* Optional Image */}
                  {story.image_url && (
                    <div className="w-full h-48 sm:h-56 relative overflow-hidden">
                      <img 
                        src={story.image_url} 
                        alt="Story moment" 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      />
                    </div>
                  )}

                  {/* Content */}
                  <div className="p-5">
                    <p className="text-sm text-gray-700 leading-relaxed mb-3 whitespace-pre-wrap">
                      {story.content}
                    </p>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                      <div className="flex space-x-4">
                        <button className="flex items-center space-x-1.5 text-gray-400 hover:text-pink-500 transition-colors">
                          <Heart size={18} />
                          <span className="text-xs font-medium">0</span>
                        </button>
                      </div>
                      <button className="text-gray-400 hover:text-gray-600">
                        <Share2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* 추가 폼 모달 */}
      {isAdding && (
         <div className="fixed inset-0 z-50 bg-black/60 flex items-end sm:items-center justify-center sm:p-4 backdrop-blur-sm">
           <form onSubmit={handleAddStory} className="bg-white w-full max-w-md rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 space-y-4">
              <h3 className="text-lg font-bold text-gray-800 mb-2">새로운 추억 남기기</h3>
              
              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">날짜</label>
                <input 
                  type="date" 
                  value={newDate} onChange={e => setNewDate(e.target.value)}
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">내용</label>
                <textarea 
                  autoFocus rows={4}
                  value={newContent} onChange={e => setNewContent(e.target.value)}
                  placeholder="오늘의 웨딩 준비는 어땠나요?" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-600 mb-1 block">추억의 사진 (선택)</label>
                <div className="flex items-center space-x-4">
                  <label className="flex flex-col items-center justify-center w-24 h-24 bg-gray-50 border-2 border-gray-200 border-dashed rounded-xl cursor-pointer hover:bg-gray-100 transition-colors">
                    <div className="flex flex-col items-center justify-center">
                      <Camera size={24} className="text-gray-400 mb-1" />
                    </div>
                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                  {previewUrl && (
                    <div className="relative w-24 h-24 rounded-xl overflow-hidden border border-gray-200">
                      <img src={previewUrl} alt="Preview" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => { setUploadFile(null); setPreviewUrl(null); }}
                        className="absolute top-1 right-1 w-5 h-5 bg-black/50 text-white rounded-full flex items-center justify-center text-xs"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                 <button type="button" onClick={() => setIsAdding(false)} className="flex-1 py-3 text-gray-500 font-semibold bg-gray-100 rounded-xl hover:bg-gray-200 transition-colors">취소</button>
                 <button type="submit" disabled={!newContent.trim() || isUploading} className="flex-1 py-3 text-white font-semibold flex items-center justify-center space-x-1 bg-gradient-to-r from-purple-500 to-pink-500 disabled:opacity-50 rounded-xl hover:shadow-lg transition-all">
                   {isUploading ? '업로드 중...' : '저장하기'}
                 </button>
              </div>
           </form>
         </div>
      )}

      {/* FAB - Add new memory */}
      <div className="fixed bottom-20 right-6 max-w-lg mx-auto z-20">
        <button onClick={() => setIsAdding(true)} className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </div>
    </main>
  )
}
