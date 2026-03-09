-- 1. Couples 테이블 생성 (공유 데이터의 중심)
CREATE TABLE public.couples (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  wedding_date DATE, -- '미정'일 경우 null
  invite_code VARCHAR(10) UNIQUE NOT NULL, -- 상대방을 초대하기 위한 난수 코드
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Users 테이블 생성 (가입자 상세 정보)
-- Supabase의 내장 auth.users 테이블과 1:1 매칭되는 커스텀 프로필 테이블입니다.
CREATE TABLE public.users (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  profile_image TEXT,
  birthdate DATE,
  role VARCHAR(20) CHECK (role IN ('bride', 'groom')),
  couple_id UUID REFERENCES public.couples(id) ON DELETE SET NULL,
  temp_partner_name VARCHAR(255),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS (Row Level Security) 설정 (보안)
ALTER TABLE public.couples ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Users 테이블 정책: 누구나 가입 시 자신의 row 삽입 가능. 같은 커플만 조회 가능.
CREATE POLICY "Users can insert their own profile."
  ON public.users FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS 무한 루프(Infinite Recursion) 방지를 위한 커플 ID 조회 함수
CREATE OR REPLACE FUNCTION public.get_my_couple_id()
RETURNS UUID AS $$
  SELECT couple_id FROM public.users WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

CREATE POLICY "Users can view their own profile and partner's profile."
  ON public.users FOR SELECT
  USING (
    auth.uid() = id OR 
    (couple_id IS NOT NULL AND couple_id = public.get_my_couple_id())
  );

CREATE POLICY "Users can update their own profile."
  ON public.users FOR UPDATE
  USING (auth.uid() = id);

-- Couples 테이블 정책: 같은 couple_id를 가진 유저만 접근 가능
CREATE POLICY "Users can insert a couple group."
  ON public.couples FOR INSERT
  WITH CHECK (true); -- 누구나(로그인한) 첫 커플 그룹 생성 가능

CREATE POLICY "Users can view their own couple group."
  ON public.couples FOR SELECT
  USING (id = (SELECT couple_id FROM public.users WHERE id = auth.uid()));

CREATE POLICY "Users can update their own couple group."
  ON public.couples FOR UPDATE
  USING (id = (SELECT couple_id FROM public.users WHERE id = auth.uid()));

-- Supabase Auth 가입 시 자동으로 users 테이블에 빈 row 생성해주는 트리거
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email)
  VALUES (NEW.id, NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
