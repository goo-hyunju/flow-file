# 배포 가이드

## 배포 방법

### 1. Backend 배포 (Render)

1. [Render](https://render.com)에 가입
2. "New +" → "Web Service" 선택
3. GitHub 저장소 연결
4. 설정:
   - **Name**: `flow-file-backend`
   - **Root Directory**: `backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
5. "Create Web Service" 클릭
6. 배포 완료 후 URL 복사 (예: `https://flow-file-backend.onrender.com`)

### 2. Frontend 배포 (Vercel)

1. [Vercel](https://vercel.com)에 가입
2. "Add New..." → "Project" 선택
3. GitHub 저장소 연결
4. 설정:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
   - **Environment Variables**:
     - `VITE_API_URL`: Backend URL (예: `https://flow-file-backend.onrender.com/api`)
5. "Deploy" 클릭

### 3. 환경변수 설정

#### Frontend (Vercel)
- 프로젝트 → Settings → Environment Variables
- `VITE_API_URL` = `https://flow-file-backend.onrender.com/api`

#### Backend (Render)
- 자동으로 PORT 환경변수 설정됨

## 배포 후 확인

1. Backend API 테스트: `https://flow-file-backend.onrender.com/api/fixed-extensions`
2. Frontend 접속: Vercel에서 제공하는 URL
3. 기능 테스트:
   - 고정 확장자 체크박스 동작
   - 커스텀 확장자 추가/삭제

## 무료 티어 제한

- **Render**: 15분 비활성 시 sleep (첫 요청 시 깨어남)
- **Vercel**: 무제한 (개인 프로젝트)

## 대안: Railway 배포

Railway를 사용하려면:

1. [Railway](https://railway.app) 가입
2. "New Project" → "Deploy from GitHub"
3. `backend` 폴더 선택
4. 자동 배포 완료
