# Codegram

**프로그래밍 언어 학습 웹 서비스**로 코드 선택, 코드오류 수정 등을 넣어 프로그래밍의 지식과 실력을 키우고, 경쟁 시스템을 추가해 사용자 간의 승부욕을 자극하여 공부를 스스로 할 수 있게 만드는 서비스

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

코드 실습은 `GET /api/problems/code?language=html`로 문제 설명·초기 코드·보상을 가져오고, `POST /api/problems/code`에 `{ id, code }`를 제출합니다. 채점 기준 통과 수와 부족한 조건은 서버 응답으로 표시합니다. 정답이면 서버가 제출 기록과 첫 정답 XP를 저장하며, 프론트는 `POST /api/lessons/{lessonId}/complete`가 성공한 뒤 여정의 완료 상태를 갱신합니다. 완료 기록 저장에 실패하면 코드 재제출 없이 저장만 재시도할 수 있습니다.

코드 실습 API 오류나 미등록 언어는 안내 화면으로 표시합니다. 코드를 프론트에서 대신 채점하지 않습니다. HTML 미리보기와 작성 중인 코드 초안은 브라우저에서 처리하며, 서버의 현재 코드 채점 방식은 정규식 조건 검사입니다. 코드 실습 안내는 서버 문제를 사용하고, 개념 확인 단계의 왼쪽 이론은 기존 프론트 콘텐츠를 사용합니다.

## 소스 구조

- `src/app/App.jsx`, `src/app/routes.js`: 인증·학습 경로 연결
- `src/components/auth/`, `src/pages/AuthPage.jsx`: 시작 화면과 Google 로그인
- `src/components/home/`: 학습 지도, 오답 노트, 언어 선택
- `src/components/lesson/`: 코드 편집기와 문제 유형별 컴포넌트
- `src/data/`: 언어별 커리큘럼과 예시 문제
- `src/api/`: 인증 요청과 공통 Axios 클라이언트를 통한 문제 서버 통신
- `src/lib/`: 진행 상태, 오답 기록, 편집기 지원 기능

컴포넌트 스타일은 해당 컴포넌트와 같은 폴더의 CSS 파일에 둡니다. 코드 실습 제출·정답 보상·레슨 완료 기록은 서버에 저장됩니다. 여정 화면의 진행 상태 캐시, 코드 초안, 오답 복습용 사본은 브라우저 저장소에도 보관됩니다. 여정 캐시와 코드 초안의 다른 기기 복원은 아직 연동하지 않았습니다.
