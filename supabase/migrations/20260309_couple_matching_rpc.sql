-- 1. 새로운 커플 그룹을 생성하고 6자리 초대 코드를 발급하는 함수
-- 사용자가 마이페이지에서 '초대코드 생성' 버튼을 누를 때 호출됩니다.
CREATE OR REPLACE FUNCTION public.create_couple_and_get_code()
RETURNS VARCHAR AS $$
DECLARE
  new_couple_id UUID;
  new_invite_code VARCHAR(6);
  is_unique BOOLEAN := false;
BEGIN
  -- 1) 사용자에게 이미 couple_id 가 있는지 확인 (있으면 에러 방지 혹은 기존 코드 반환)
  SELECT couple_id INTO new_couple_id FROM public.users WHERE id = auth.uid();
  IF new_couple_id IS NOT NULL THEN
    SELECT invite_code INTO new_invite_code FROM public.couples WHERE id = new_couple_id;
    RETURN new_invite_code;
  END IF;

  -- 2) 겹치지 않는 6자리 영문 대문자+숫자 난수 생성 루프
  WHILE NOT is_unique LOOP
    new_invite_code := substring(md5(random()::text) from 1 for 6);
    new_invite_code := upper(new_invite_code);
    
    IF NOT EXISTS (SELECT 1 FROM public.couples WHERE invite_code = new_invite_code) THEN
      is_unique := true;
    END IF;
  END LOOP;

  -- 3) 커플 테이블에 새 그룹 생성
  INSERT INTO public.couples (invite_code)
  VALUES (new_invite_code)
  RETURNING id INTO new_couple_id;

  -- 4) 생성한 유저 본인의 couple_id 를 방금 만든 그룹으로 업데이트
  UPDATE public.users
  SET couple_id = new_couple_id, updated_at = now()
  WHERE id = auth.uid();

  RETURN new_invite_code;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. 파트너가 코드를 입력했을 때, 해당 코드의 주인이 누구인지(닉네임 등) 확인만 해주는 함수
-- 연결 직전 "A님과 연결하시겠습니까?" 팝업을 띄우기 위해 사용
CREATE OR REPLACE FUNCTION public.get_partner_info_by_code(p_invite_code VARCHAR)
RETURNS JSON AS $$
DECLARE
  target_couple_id UUID;
  partner_record RECORD;
BEGIN
  -- 1) 코드로 couple_id 찾기
  SELECT id INTO target_couple_id
  FROM public.couples
  WHERE invite_code = upper(p_invite_code);

  IF target_couple_id IS NULL THEN
    RAISE EXCEPTION '유효하지 않은 초대 코드입니다. (Invalid Code)';
  END IF;

  -- 2) 해당 couple_id에 속해있는 (가장 먼저 가입한 = 초대자) 유저 정보 찾기
  SELECT nickname, role 
  INTO partner_record 
  FROM public.users 
  WHERE couple_id = target_couple_id 
  ORDER BY created_at ASC 
  LIMIT 1;

  IF NOT FOUND THEN
    RAISE EXCEPTION '이 코드에 해당하는 파트너 정보를 찾을 수 없습니다.';
  END IF;

  RETURN json_build_object(
    'couple_id', target_couple_id,
    'nickname', partner_record.nickname,
    'role', partner_record.role
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 3. 파트너와 최종적으로 커플 데이터를 동기화(병합)하는 함수
-- 팝업에서 [연결 동의]를 눌렀을 때 호출
CREATE OR REPLACE FUNCTION public.link_couple(p_couple_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  -- 내 프로필에 couple_id 삽입
  UPDATE public.users
  SET couple_id = p_couple_id, updated_at = now()
  WHERE id = auth.uid();
  
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
