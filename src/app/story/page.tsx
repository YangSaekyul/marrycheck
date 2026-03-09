'use client'

import { Plus, Camera, MapPin, Heart, Share2, MessageCircle } from 'lucide-react'

const MOCK_STORIES = [
  {
    id: '1',
    date: '2023. 10. 15',
    d_day: 'D-120',
    location: '강남 시그니처 웨딩홀',
    content: '드디어 우리가 부부가 될 첫 번째 단추를 꿰었다! 상담하시는 매니저님도 너무 친절하시고, 채플홀의 따뜻한 분위기가 딱 우리가 원하던 느낌 ✨',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=800',
    likes: 12,
    comments: 3,
    tags: ['#웨딩홀투어', '#계약완료', '#채플웨딩']
  },
  {
    id: '2',
    date: '2023. 09. 28',
    d_day: 'D-137',
    location: '청담동 반지마을',
    content: '우리의 웨딩 밴드 투어 💍 3군데 돌아보고 결정장애 올 뻔했지만... 결국 가장 심플하고 클래식한 디자인으로 결정했다. 빨리 나왔으면 좋겠어!',
    image: 'https://images.unsplash.com/photo-1605100804763-247f66156e94?auto=format&fit=crop&q=80&w=800',
    likes: 24,
    comments: 5,
    tags: ['#웨딩밴드', '#결혼반지']
  },
  {
    id: '3',
    date: '2023. 09. 10',
    d_day: 'D-155',
    location: '서울숲 레스토랑',
    content: '양가 부모님 처음 모시고 식사하는 자리. 너무 떨렸지만 다들 화기애애하게 대화 나누셔서 마음이 놓였다. 든든한 가족이 두 배로 늘어나는 기분 👨‍👩‍👦‍👦',
    likes: 38,
    comments: 8,
    tags: ['#상견례', '#화기애애', '#떨림']
  }
]

export default function StoryPage() {
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
          
          {MOCK_STORIES.map((story) => (
            <div key={story.id} className="relative pl-6">
              {/* Timeline Dot */}
              <div className="absolute -left-[9px] top-6 w-4 h-4 rounded-full bg-purple-400 border-4 border-white shadow-sm" />
              
              {/* Date & D-Day */}
              <div className="flex items-center space-x-2 mb-2 pt-5">
                <span className="text-sm font-bold text-gray-800">{story.date}</span>
                <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 text-xs font-semibold">
                  {story.d_day}
                </span>
              </div>

              {/* Story Card */}
              <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow">
                
                {/* Location */}
                <div className="flex items-center space-x-1.5 px-5 py-3 border-b border-gray-50 bg-gray-50/50">
                  <MapPin size={14} className="text-gray-400" />
                  <span className="text-xs font-medium text-gray-600">{story.location}</span>
                </div>

                {/* Optional Image */}
                {story.image && (
                  <div className="w-full h-48 sm:h-56 relative overflow-hidden">
                    <img 
                      src={story.image} 
                      alt="Story moment" 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                    />
                  </div>
                )}

                {/* Content */}
                <div className="p-5">
                  <p className="text-sm text-gray-700 leading-relaxed mb-3">
                    {story.content}
                  </p>
                  
                  {/* Tags */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {story.tags.map(tag => (
                      <span key={tag} className="text-xs font-medium text-purple-500">
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-3 border-t border-gray-50">
                    <div className="flex space-x-4">
                      <button className="flex items-center space-x-1.5 text-gray-400 hover:text-pink-500 transition-colors">
                        <Heart size={18} />
                        <span className="text-xs font-medium">{story.likes}</span>
                      </button>
                      <button className="flex items-center space-x-1.5 text-gray-400 hover:text-blue-500 transition-colors">
                        <MessageCircle size={18} />
                        <span className="text-xs font-medium">{story.comments}</span>
                      </button>
                    </div>
                    <button className="text-gray-400 hover:text-gray-600">
                      <Share2 size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

        </div>
      </div>

      {/* FAB - Add new memory */}
      <div className="fixed bottom-20 right-6 max-w-lg mx-auto z-20">
        <button className="w-14 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl hover:scale-105 active:scale-95 transition-all">
          <Plus size={24} />
        </button>
      </div>
    </main>
  )
}
