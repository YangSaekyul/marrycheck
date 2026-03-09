-- 1. 투게더 체크리스트 (Todos) 테이블 생성
CREATE TABLE public.todos (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  completed BOOLEAN DEFAULT false,
  assignee VARCHAR(50) DEFAULT 'both' CHECK (assignee IN ('bride', 'groom', 'both')),
  category VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. 스마트 예산 관리 (Transactions) 테이블 생성
CREATE TABLE public.transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount INTEGER NOT NULL DEFAULT 0,
  category VARCHAR(100),
  type VARCHAR(20) DEFAULT 'expense' CHECK (type IN ('expense', 'income')),
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. 타임라인 스토리 (Stories) 테이블 생성
CREATE TABLE public.stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  couple_id UUID REFERENCES public.couples(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  content TEXT NOT NULL,
  date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);


-- ======= RLS (Row Level Security) 보안 설정 =======
ALTER TABLE public.todos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stories ENABLE ROW LEVEL SECURITY;

-- 1) Todos 권한: 자신이 속한 커플(couple_id) 데이터만 CRUD 가능
CREATE POLICY "Couples can manage their own todos"
  ON public.todos FOR ALL
  USING (couple_id = public.get_my_couple_id())
  WITH CHECK (couple_id = public.get_my_couple_id());

-- 2) Transactions 권한: 자신이 속한 커플 데이터만 CRUD 가능
CREATE POLICY "Couples can manage their own transactions"
  ON public.transactions FOR ALL
  USING (couple_id = public.get_my_couple_id())
  WITH CHECK (couple_id = public.get_my_couple_id());

-- 3) Stories 권한: 자신이 속한 커플 데이터만 CRUD 가능
CREATE POLICY "Couples can manage their own stories"
  ON public.stories FOR ALL
  USING (couple_id = public.get_my_couple_id())
  WITH CHECK (couple_id = public.get_my_couple_id());
