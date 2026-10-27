# Codegram 프런트엔드

React와 Vite로 만든 코딩 학습 화면입니다. 시작 화면, 언어별 학습 여정, 개념 문제, 코드 실습, 오답 노트를 제공합니다.

## 실행과 검증

```bash
npm ci
npm run dev
```

개발 서버 주소는 Vite가 터미널에 표시합니다. 검증에는 `npm run lint`, `npm test`, `npm run build`를 사용합니다.

## 화면

- `/`, `/auth`, `/login`: 시작 및 Google 로그인 화면
- `/journeys/html/fundamentals`: HTML 여정과 웹 미리보기가 있는 실습
- `/journeys/javascript/fundamentals`, `/journeys/python/fundamentals`, `/journeys/java/fundamentals`: 언어별 여정과 코드 실습
- 각 여정의 사이드 메뉴 `오답 노트`: 틀린 개념 문제 복습과 코드 문제 재방문

학습 화면에서는 선택형, 빈칸 채우기, 순서 맞추기, 단답형 문제를 코드 실습 전에 풀 수 있습니다. 문제 조회와 제출은 `/api/problems/{mcq|blank|parsons|short}`를 사용하며, 개발 서버는 `/api` 요청을 `https://codegram.me`로 전달합니다. 서버 응답이 없으면 예시 문제를 표시합니다.

## 소스 구조

- `src/app/App.jsx`, `src/app/routes.js`: 인증·학습 경로 연결
- `src/components/auth/`, `src/pages/AuthPage.jsx`: 시작 화면과 Google 로그인
- `src/components/home/`: 학습 지도, 오답 노트, 언어 선택
- `src/components/lesson/`: 코드 편집기와 문제 유형별 컴포넌트
- `src/data/`: 언어별 커리큘럼과 예시 문제
- `src/api/`: 인증 요청과 공통 Axios 클라이언트를 통한 문제 서버 통신
- `src/lib/`: 진행 상태, 오답 기록, 편집기 지원 기능

컴포넌트 스타일은 해당 컴포넌트와 같은 폴더의 CSS 파일에 둡니다. 진행 상태, 코드 초안, 오답 기록은 현재 브라우저의 저장소에 보관됩니다. 다른 기기와 동기화되지는 않습니다.
