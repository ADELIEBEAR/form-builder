# 폼 빌더 — 설치 & 배포 가이드

구글 로그인 + 폼 저장 + HTML 다운로드가 가능한 무료 폼 빌더입니다.
**Netlify + Supabase 조합으로 완전 무료로 운영 가능합니다.**

---

## 전체 흐름

1. GitHub에 코드 올리기
2. Supabase 프로젝트 생성 + DB 설정
3. Google OAuth 앱 등록
4. Netlify에 배포
5. 환경변수 설정

---

## STEP 1 — GitHub 저장소 만들기

1. https://github.com 접속 → New repository
2. 저장소 이름 입력 (예: `form-builder`) → Create
3. 이 폴더 전체를 업로드하거나 git으로 push

```bash
git init
git add .
git commit -m "init"
git remote add origin https://github.com/아이디/form-builder.git
git push -u origin main
```

---

## STEP 2 — Supabase 설정

### 2-1. 프로젝트 생성
1. https://supabase.com 접속 → 구글로 가입
2. New project 클릭
3. 프로젝트 이름, DB 비밀번호 입력 → Create project (1~2분 대기)

### 2-2. DB 테이블 만들기
1. 왼쪽 메뉴 → **SQL Editor**
2. `supabase_schema.sql` 파일 내용을 전체 복사해서 붙여넣기
3. **Run** 클릭

### 2-3. API 키 복사
1. 왼쪽 메뉴 → **Settings** → **API**
2. 아래 두 값을 복사해 두세요:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon public** 키 → `VITE_SUPABASE_ANON_KEY`

### 2-4. 구글 로그인 활성화 (잠깐 보류 — STEP 3 완료 후)
- 왼쪽 메뉴 → **Authentication** → **Providers** → **Google** 활성화
- Google Client ID / Secret은 STEP 3에서 받아옵니다

---

## STEP 3 — Google OAuth 앱 등록

1. https://console.cloud.google.com 접속 (구글 계정 로그인)
2. 상단 프로젝트 선택 → **새 프로젝트** 만들기
3. 왼쪽 메뉴 → **API 및 서비스** → **OAuth 동의 화면**
   - User Type: **외부** 선택 → 만들기
   - 앱 이름, 이메일 입력 → 저장
4. 왼쪽 메뉴 → **사용자 인증 정보** → **+ 사용자 인증 정보 만들기** → **OAuth 클라이언트 ID**
   - 애플리케이션 유형: **웹 애플리케이션**
   - 승인된 리디렉션 URI에 아래 추가:
     ```
     https://여기에Supabase프로젝트ID.supabase.co/auth/v1/callback
     ```
     (Supabase URL에서 프로젝트 ID 부분만 확인)
5. **만들기** → **클라이언트 ID**와 **클라이언트 보안 비밀번호** 복사

### Supabase에 구글 키 등록
1. Supabase → Authentication → Providers → **Google**
2. Enable 토글 ON
3. Client ID / Client Secret 붙여넣기 → Save

---

## STEP 4 — Netlify 배포

1. https://netlify.com 접속 → 구글로 가입
2. **Add new site** → **Import an existing project**
3. **GitHub** 선택 → 저장소 선택
4. 빌드 설정:
   - Build command: `npm run build`
   - Publish directory: `dist`
5. **Deploy site** 클릭 (1~2분 소요)
6. 배포 완료되면 `https://랜덤이름.netlify.app` 주소 생성됨

---

## STEP 5 — 환경변수 설정

### Netlify에 환경변수 추가
1. Netlify 대시보드 → 사이트 선택 → **Site settings**
2. **Environment variables** → **Add a variable**
3. 아래 두 개 추가:

| Key | Value |
|-----|-------|
| `VITE_SUPABASE_URL` | `https://xxx.supabase.co` |
| `VITE_SUPABASE_ANON_KEY` | `eyJ...` (anon 키) |

4. **Deploys** 탭 → **Trigger deploy** → **Deploy site** (재배포)

### Google OAuth 리디렉션 URI 업데이트
1. Google Cloud Console → 사용자 인증 정보 → 아까 만든 OAuth 클라이언트
2. 승인된 리디렉션 URI에 Netlify 주소도 추가:
   ```
   https://여러분의앱.netlify.app
   ```
3. Supabase → Authentication → URL Configuration
   - Site URL: `https://여러분의앱.netlify.app`
   - Redirect URLs에 `https://여러분의앱.netlify.app/dashboard` 추가

---

## 로컬에서 개발할 때

```bash
# 패키지 설치
npm install

# .env 파일 만들기 (.env.example 복사)
cp .env.example .env
# .env 파일에 Supabase URL과 키 입력

# 개발 서버 실행
npm run dev
# → http://localhost:5173 에서 확인
```

---

## 파일 구조

```
formbuilder/
├── src/
│   ├── pages/
│   │   ├── Landing.jsx       # 메인(랜딩) 페이지
│   │   ├── Login.jsx         # 구글 로그인 페이지
│   │   ├── Dashboard.jsx     # 내 폼 목록
│   │   └── Builder.jsx       # 폼 에디터
│   ├── hooks/
│   │   └── useAuth.jsx       # 로그인 상태 관리
│   ├── lib/
│   │   ├── supabase.js       # Supabase 연동
│   │   └── generateHTML.js   # 폼 HTML 생성
│   ├── App.jsx               # 라우터
│   └── main.jsx              # 진입점
├── supabase_schema.sql       # DB 테이블 생성 SQL
├── netlify.toml              # Netlify SPA 설정
├── .env.example              # 환경변수 예시
└── package.json
```

---

## 문제 해결

**로그인 후 대시보드로 안 넘어가요**
→ Supabase Authentication → URL Configuration에서 Redirect URLs 확인

**폼 저장이 안 돼요**
→ Supabase SQL Editor에서 schema.sql 다시 실행했는지 확인

**배포 후 새로고침하면 404 에러**
→ netlify.toml 파일이 루트에 있는지 확인
