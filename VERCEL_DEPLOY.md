# 🚀 Vercel 프론트엔드 배포 가이드

현재 작성된 코드는 이미 깃허브 레포지토리(`YangSaekyul/marrycheck`)에 안전하게 백업되어 있습니다.
이제 **1분 만에** 전 세계 어디서든 휴대폰으로 접속 가능한 라이브 서버를 띄워보겠습니다.

---

## 1단계: Vercel 계정 연동 및 배포

1. [Vercel 공식 홈페이지(vercel.com)](https://vercel.com/) 에 접속하여 깃허브 계정으로 로그인합니다.
2. 메인 대시보드 우측 상단의 검은색 **`[Add New...]` $\rightarrow$ `[Project]`** 버튼을 클릭합니다.
3. 내 깃허브 저장소 목록에서 **`marrycheck`** 옆의 **`[Import]`** 버튼을 누릅니다.
4. **Environment Variables (환경 변수)** 탭을 열고, 로컬에 있던 `.env.local`의 값들을 그대로 복사해 넣습니다.
   - Name: `NEXT_PUBLIC_SUPABASE_URL` 
   - Value: `(본인의 Supabase URL)`
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `(본인의 Supabase Anon Key)`
5. 입력 후 **`[Deploy]`**를 누르면 자동으로 뚝딱 배포가 시작됩니다! (약 1~2분 소요)
6. 배포가 완료되면 `https://marrycheck-XXXX.vercel.app` 과 같은 **나만의 도메인 주소**가 발급됩니다. 

---

## 2단계: 카카오 로그인 "허용 주소" 추가

발급받은 도메인 주소로도 로그인이 막히지 않게 하려면 카카오 쪽에 **이 주소도 내 앱이 맞다**고 허락을 받아야 합니다.

1. [카카오 데벨로퍼스(developers.kakao.com)](https://developers.kakao.com) 내 애플리케이션 $\rightarrow$ "marry-cehck" 에 접속합니다.
2. 좌측 메뉴 **[내 애플리케이션] $\rightarrow$ [앱 설정] $\rightarrow$ [플랫폼]**으로 갑니다.
3. Web 플랫폼 영역을 찾아 **수정** 버튼을 누르고, Vercel에서 방금 발급받은 도메인(예: `https://marrycheck-XXXX.vercel.app`)을 추가합니다.
4. 좌측 메뉴 **[카카오 로그인]** 탭으로 갑니다.
5. 화면 아래쪽 **Redirect URI** 항목에 Vercel 도메인을 포함한 콜백 주소를 추가합니다.
   - 예시: `https://marrycheck-XXXX.vercel.app/auth/callback` (마지막 슬래시 없이 정확히 기입)

---

## 3단계: 휴대폰으로 테스트! 📱

이제 발급받은 `https://marrycheck-XXXX.vercel.app` 링크를 파트너분 카톡으로 공유해 주시고, 
휴대폰 브라우저로 접속하여 **카카오 로그인 $\rightarrow$ 온보딩 4단계 $\rightarrow$ 마이페이지**까지 잘 넘어가는지 터치하며 테스트해 보시면 됩니다!

*(세팅하시다가 막히는 부분이 있다면 도메인 주소나 에러 화면을 바로 말씀해 주세요! 💡)*
