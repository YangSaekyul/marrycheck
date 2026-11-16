# Marry Check

결혼 준비 프로젝트의 단일 개발 저장소: https://github.com/YangSaekyul/marrycheck

`marrycheck`, `marry-check`, `wedding-mate`, `Our-Wedding-Mate`의 코드와 이력을 이 저장소에서 관리합니다.
기준 앱은 루트의 Next.js 앱이며, 이전 구현은 `legacy/`에서 참고합니다.

## 기준 앱

- Next.js 15, React 18, TypeScript, Tailwind CSS
- Supabase 인증·데이터 연동
- 대시보드, 체크리스트, 예산, 스토리, 프로필·커플 연결 화면
- 2026-11-17 통합 시 맥북의 체크리스트 미커밋 작업을 포함했습니다.

## 로컬 실행

```bash
npm ci
npm run dev
```

기존 프로젝트의 `.env.local`을 로컬에서 사용합니다. 인증 정보는 Git에 넣지 않습니다.
실제 로그인과 데이터 저장에는 해당 Supabase 프로젝트 설정이 필요합니다.

## 구조

```text
src/                 # 앞으로 수정할 기준 앱
supabase/            # 기준 앱의 기존 스키마 파일
legacy/              # 이전 앱 소스: 현재 앱 빌드에서 제외
docs/                # 통합 근거와 파일 해시
```

구현별 인증 방식과 DB는 서로 달라 이번 작업은 저장소와 이력 통합입니다.
기능이나 운영 DB를 자동으로 병합하지 않습니다.
이전 프로젝트 구성과 원본 이력은 [legacy 안내](legacy/README.md)를 참고하세요.
