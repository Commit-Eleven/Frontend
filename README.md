# Codegram — HTML 기초 학습 화면

React와 Vite로 만든 HTML 기초 학습 서비스의 프런트엔드입니다. 여정 홈에서 레슨을 선택하고, 선택형 개념 확인과 코드 문제를 풀 수 있습니다.

## 실행

```bash
npm install
npm run dev
```

검사 명령은 `npm run lint`, `npm run test`, `npm run build`입니다.

## 주요 기능

- 여정 지도, 레슨 선택, 강의 계획, 콘텐츠 검색
- 선택형 개념 확인, HTML 코드 편집, 웹 미리보기 및 테스트 케이스
- CodeMirror 문법 강조와 HTML 태그 자동 완성
- Emmet 약어 확장
- 레슨 진행률과 코드 초안 브라우저 저장
- 작은 화면에서 메뉴와 학습 화면을 사용할 수 있는 반응형 레이아웃

## 소스 구조

- `src/app/App.tsx`: 홈·레슨 화면 전환과 전역 모달
- `src/pages/`: 홈 및 레슨 페이지
- `src/components/common/`: 공통 UI
- `src/components/home/`, `src/components/lesson/`: 화면별 재사용 UI
- `src/constants/dummy/`: 여정, 문제, 메뉴 더미 데이터
- `src/hooks/`: 재사용 가능한 상태·화면 로직
- `src/utils/`: 진행 저장, 에셋 경로, Emmet 처리 함수
- `src/styles/`: 전역 폰트·스타일과 화면 스타일
- `src/main.tsx`: Vite 앱 진입점

## 코드 규칙

- React 컴포넌트와 컴포넌트 파일은 PascalCase, 함수·변수는 camelCase를 사용합니다.
- 이벤트 핸들러는 `handle` 접두사를, 이벤트 콜백 props는 `on` 접두사를 사용합니다.
- 색상과 폰트, 화면 스타일은 `src/styles/`에서 관리합니다. 런타임 값이 필요한 위치·진행률 표시는 계산된 인라인 값으로 전달합니다.
- 정적 학습 데이터는 `src/constants/dummy/`에서 관리합니다. 아직 연결된 서버 API가 없어 문제와 진행 상태는 브라우저에서 처리합니다. 실제 API를 연결할 때는 `src/api/`에 Axios 클라이언트를 두고 기존 문제 데이터를 폴백으로 사용합니다.
- 새 작업은 `feature/#이슈번호-설명` 브랜치에서 진행하며 `main`에 직접 커밋하지 않습니다. PR에는 화면, 컴포넌트, 함수, 더미 데이터와 기타 처리 내용을 적고 최소 한 명의 리뷰 승인을 받은 뒤 리뷰어가 병합합니다.

레슨 진행 상태와 코드 초안은 브라우저의 `localStorage`에 저장됩니다. 계정, 서버 채점, 결제 기능은 연결되어 있지 않습니다.

## 인증 시작 화면

```bash
npm ci
npm run dev
```

터미널에 표시된 개발 서버의 `/` 또는 `/auth`에 접속합니다. ‘시작하기’와 ‘계정이 이미 있습니다’를 누르면 Google 로그인 버튼만 있는 모달이 열립니다. 기존 학습 화면은 `/journeys/html/fundamentals`에서 확인할 수 있습니다.

현재는 UI만 구현되어 있습니다. Google 로그인 버튼은 안내 문구만 표시하며, OAuth 요청·토큰 저장·로그인 성공 처리·학습 경로 접근 제어는 수행하지 않습니다. 후속 연동 시 `GoogleLoginModal`의 `handleGoogleLogin`에서 `api` 폴더의 인증 함수를 호출하고, 서버 명세에 맞춰 콜백·세션·실패 처리를 추가해야 합니다.

검증: `npm run lint`, `npm run build`, `npm test`.
