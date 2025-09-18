import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Checkbox } from './ui/checkbox';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from './ui/dialog';
import { Plus, Calendar, CheckCircle, Circle } from 'lucide-react';
import { db, auth } from '../lib/firebaseClient';
import {
  collection,
  addDoc,
  doc,
  updateDoc,
  onSnapshot,
  query,
  where,
  orderBy,
  serverTimestamp
} from 'firebase/firestore';

interface ChecklistItem {
  id: string;
  title: string;
  status: 'pending' | 'done';
  category: string;
  createdAt: any;
  dueText?: string;
}

export default function ChecklistManager() {
  const [items, setItems] = useState<ChecklistItem[]>([]);
  const [activeTab, setActiveTab] = useState('essential');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [loading, setLoading] = useState(true);
  const [coupleId, setCoupleId] = useState<string | null>(null);

  const uid = typeof window !== 'undefined' ? auth.currentUser?.uid : undefined;

  useEffect(() => {
    const load = async () => {
      if (!uid) return;
      try {
        const uref = doc(db, 'users', uid);
        const { getDoc } = await import('firebase/firestore');
        const snap = await getDoc(uref);
        const data = snap.data();
        if (data && data.coupleId) setCoupleId(data.coupleId);
      } catch (e) {
        console.error('Failed to load user profile', e);
      }
    };
    load();
  }, [uid]);

  const listQuery = useMemo(() => {
    if (!coupleId) return null;
    const col = collection(db, 'checklists');
    return query(
      col,
      where('coupleId', '==', coupleId),
      where('category', '==', activeTab),
      orderBy('createdAt', 'asc')
    );
  }, [db, coupleId, activeTab]);

  useEffect(() => {
    if (!listQuery) return;
    setLoading(true);
    const unsub = onSnapshot(listQuery, (snap) => {
      const next: ChecklistItem[] = [];
      snap.forEach((d) => next.push({ id: d.id, ...d.data() } as ChecklistItem));
      setItems(next);
      setLoading(false);
    });
    return () => unsub();
  }, [listQuery]);

  const onAdd = async () => {
    if (!uid || !coupleId) return;
    const title = newTitle.trim();
    if (!title) return;
    await addDoc(collection(db, 'checklists'), {
      coupleId,
      title,
      status: 'pending',
      category: activeTab,
      createdAt: serverTimestamp()
    });
    setNewTitle('');
    setShowModal(false);
  };

  const toggleDone = async (id: string, nextDone: boolean) => {
    const ref = doc(db, 'checklists', id);
    await updateDoc(ref, { status: nextDone ? 'done' : 'pending' });
  };

  const tabs = [
    { key: 'essential', label: '필수 항목' },
    { key: 'optional', label: '선택 항목' },
    { key: 'byTime', label: '시기별' }
  ];

  const completedCount = items.filter(item => item.status === 'done').length;
  const totalCount = items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">체크리스트</h1>
          <p className="text-muted-foreground">
            결혼 준비를 위한 체계적인 할 일 관리
          </p>
        </div>
        <Dialog open={showModal} onOpenChange={setShowModal}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              작업 추가
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>새 작업 추가</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Input
                placeholder="작업 제목을 입력하세요"
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowModal(false)}>
                취소
              </Button>
              <Button onClick={onAdd}>추가</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {/* Progress Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>진행 상황</span>
            <span className="text-sm font-normal text-muted-foreground">
              {completedCount}/{totalCount}
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="w-full bg-secondary rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
          <p className="text-sm text-muted-foreground mt-2">
            {progressPercentage.toFixed(0)}% 완료
          </p>
        </CardContent>
      </Card>

      {/* Tabs */}
      <div className="border-b border-border">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.key
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      <Card>
        <CardContent className="p-6">
          {loading ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">로딩 중...</p>
            </div>
          ) : items.length === 0 ? (
            <div className="text-center py-8">
              <Circle className="mx-auto h-12 w-12 text-gray-300 mb-4" />
              <p className="text-muted-foreground">아직 작업이 없습니다.</p>
              <p className="text-sm text-muted-foreground">첫 번째 작업을 추가해보세요!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map((item) => {
                const done = item.status === 'done';
                return (
                  <div key={item.id} className="flex items-center space-x-3 p-3 rounded-lg border bg-card hover:bg-accent/50 transition-colors">
                    <Checkbox
                      checked={done}
                      onCheckedChange={(checked) => toggleDone(item.id, !!checked)}
                    />
                    <div className="flex-1">
                      <p className={`font-medium ${done ? 'line-through text-muted-foreground' : ''}`}>
                        {item.title}
                      </p>
                      {item.dueText && (
                        <p className="text-xs text-muted-foreground mt-1">
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {item.dueText}
                        </p>
                      )}
                    </div>
                    {done && (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}