# 파일 확장자 차단 기능

## 실행 방법

### Backend
```bash
cd backend
npm install
npm start
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## 기능

1. 고정 확장자 차단 설정 (bat, cmd, com, cpl, exe, scr, js)
2. 커스텀 확장자 추가/삭제 (최대 200개)
3. 중복 방지 및 입력값 정규화

## API

- `GET /api/fixed-extensions` - 고정 확장자 목록
- `PUT /api/fixed-extensions/:extension` - 차단 상태 변경
- `GET /api/custom-extensions` - 커스텀 확장자 목록
- `POST /api/custom-extensions` - 커스텀 확장자 추가
- `DELETE /api/custom-extensions/:extension` - 커스텀 확장자 삭제

데이터는 `backend/data.json`에 저장됩니다.

