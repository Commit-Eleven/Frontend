import { L } from './lesson.js';

// 섹션 4: 실전 프론트엔드
const css = (rule) => `<style>\n${rule}\n</style>`;

export default [
  { title: '변수', lessons: [
    L('변수', 'A', ':root에 --main-color 변수를 만드세요.', 'CSS 변수는 --이름: 값; 으로 선언하고 :root에 두면 어디서나 쓸 수 있습니다.', css(':root {\n  --main-color: #0a84ff;\n}'), ':root', '--main-color'),
    L('CSS 변수 사용하기', 'A', 'var()로 변수를 사용하세요.', 'var(--이름)으로 변수 값을 가져옵니다.', css(':root { --main-color: #0a84ff; }\nh1 { color: var(--main-color); }'), 'var(--main-color)'),
    L('디자인 토큰을 위한 변수', 'A', '색과 간격을 변수로 정의하세요.', '반복되는 디자인 값을 변수로 모으면 일관성 있게 바꿀 수 있습니다.', css(':root {\n  --space: 16px;\n  --radius: 8px;\n}\n.card {\n  padding: var(--space);\n  border-radius: var(--radius);\n}'), '--space', '--radius', 'var('),
    L('지역 변수', 'A', '특정 요소에만 적용되는 변수를 만드세요.', '요소 안에서 선언한 변수는 그 요소와 자손에서만 쓰입니다.', css('.card {\n  --bg: #eee;\n  background: var(--bg);\n}'), '--bg', 'var(--bg)'),
    L('복습 챌린지', 'C', ':root 변수와 지역 변수를 함께 사용하세요.', 'CSS 변수를 종합합니다.', css(':root { --main: blue; }\n.box {\n  --pad: 10px;\n  color: var(--main);\n  padding: var(--pad);\n}'), ':root', 'var(--main)', 'var(--pad)'),
  ] },
  { title: '모바일 퍼스트 전략', lessons: [
    L("'모바일 퍼스트'의 의미", 'A', '모바일 퍼스트가 무엇인지 주석으로 쓰고 min-width 미디어 쿼리를 작성하세요.', '작은 화면을 기본으로 만들고 min-width 미디어 쿼리로 큰 화면에 확장합니다.', css('/* 기본: 모바일 */\n@media (min-width: 768px) {\n  body { font-size: 18px; }\n}'), '/*', 'min-width'),
    L('모바일 퍼스트 타이포그래피', 'A', '기본 글자 크기를 작게 하고 큰 화면에서 키우세요.', '기본값을 모바일에 맞추고 min-width에서 키웁니다.', css('h1 { font-size: 24px; }\n@media (min-width: 768px) {\n  h1 { font-size: 36px; }\n}'), 'min-width', 'font-size'),
    L('모바일 퍼스트 내비게이션', 'A', '모바일에서는 세로, 큰 화면에서는 가로 메뉴로 만드세요.', '기본은 세로 쌓기, 큰 화면에서 flex row로 바꿉니다.', css('nav { display: flex; flex-direction: column; }\n@media (min-width: 768px) {\n  nav { flex-direction: row; }\n}'), 'flex-direction', 'min-width'),
    L('모바일 퍼스트 이미지', 'A', '이미지를 부모 너비에 맞추세요.', '모바일에서는 이미지를 꽉 채웁니다.', css('img {\n  max-width: 100%;\n  height: auto;\n}'), 'max-width: 100%'),
    L('모바일 퍼스트 폼', 'A', '입력칸을 모바일에서 전체 너비로 만드세요.', '작은 화면에서는 입력칸이 한 줄을 차지합니다.', css('input { width: 100%; }\n@media (min-width: 768px) {\n  input { width: 50%; }\n}'), 'width: 100%', 'min-width'),
    L('복습 챌린지', 'C', '모바일 기본 스타일과 min-width 미디어 쿼리를 작성하세요.', '모바일 퍼스트를 종합합니다.', css('.container { padding: 12px; }\n@media (min-width: 768px) {\n  .container { padding: 32px; }\n}'), '.container', 'min-width'),
  ] },
  { title: '테마 설정 및 시각적 스타일', lessons: [
    L('CSS 테마 설정', 'A', '테마 색을 변수로 정의하세요.', '변수로 색을 모으면 테마를 쉽게 바꿀 수 있습니다.', css(':root {\n  --bg: white;\n  --text: #222;\n}\nbody {\n  background: var(--bg);\n  color: var(--text);\n}'), '--bg', '--text', 'var('),
    L('다크/라이트 모드 기초', 'A', '[data-theme="dark"]에서 변수를 덮어쓰세요.', '속성 선택자로 다크 모드의 변수를 다시 정의합니다.', css('[data-theme="dark"] {\n  --bg: #111;\n  --text: #eee;\n}'), '[data-theme="dark"]', '--bg'),
    L('강조 색상 및 하이라이트', 'A', '강조 색 변수를 만들어 링크에 적용하세요.', '강조 색을 한 변수로 관리합니다.', css(':root { --accent: #ff5733; }\na { color: var(--accent); }'), '--accent', 'var(--accent)'),
    L('타이포그래피 테마 설정', 'A', '글꼴과 크기를 변수로 정의하세요.', '글꼴도 변수로 관리합니다.', css(':root {\n  --font: Arial, sans-serif;\n  --size: 16px;\n}\nbody { font-family: var(--font); font-size: var(--size); }'), '--font', 'var(--font)'),
    L('복습 챌린지', 'C', '라이트/다크 테마 변수를 모두 정의하세요.', '테마 설정을 종합합니다.', css(':root { --bg: white; }\n[data-theme="dark"] { --bg: black; }\nbody { background: var(--bg); }'), ':root', 'data-theme', 'var(--bg)'),
  ] },
  { title: '익스트림 스포츠', lessons: [
    L('변수', 'C', '색과 간격을 변수로 정의하세요.', '디자인 토큰을 선언합니다.', css(':root {\n  --primary: #e63946;\n  --gap: 16px;\n}'), ':root', '--primary'),
    L('모바일 퍼스트', 'C', '모바일 기본 스타일과 데스크톱 확장을 작성하세요.', '모바일을 기준으로 큰 화면에서 확장합니다.', css('.grid { display: grid; gap: var(--gap); }\n@media (min-width: 768px) {\n  .grid { grid-template-columns: 1fr 1fr; }\n}'), 'display: grid', 'min-width'),
    L('테마 설정', 'C', '다크 테마 변수를 추가하세요.', '변수만 바꿔 테마를 전환합니다.', css('[data-theme="dark"] { --bg: #111; }'), 'data-theme'),
  ] },
  { title: 'UI 컴포넌트', lessons: [
    L('드롭다운 메뉴', 'A', '숨겨진 메뉴를 hover로 보여 주세요.', 'display:none과 :hover로 드롭다운을 만듭니다.', css('.menu { display: none; }\n.dropdown:hover .menu { display: block; }'), 'display: none', ':hover'),
    L('탭', 'A', '탭 버튼과 패널을 만들고 활성 탭을 강조하세요.', '.active 클래스로 현재 탭을 표시합니다.', css('.tab.active { border-bottom: 2px solid blue; }'), '.tab', '.active'),
    L('배지', 'A', '둥근 배지 스타일을 만드세요.', 'border-radius와 패딩으로 알약 모양을 만듭니다.', css('.badge {\n  background: red;\n  color: white;\n  padding: 2px 8px;\n  border-radius: 999px;\n}'), '.badge', 'border-radius'),
    L('툴팁', 'A', 'hover 시 설명이 나타나는 툴팁을 만드세요.', '::after와 content로 말풍선을 만듭니다.', css('.tip { position: relative; }\n.tip:hover::after {\n  content: "Info";\n  position: absolute;\n}'), '::after', 'content'),
    L('알림 배너', 'A', '알림 배너 스타일을 만드세요.', '배경색과 패딩으로 눈에 띄게 만듭니다.', css('.alert {\n  background: #fff3cd;\n  padding: 12px;\n  border-radius: 6px;\n}'), '.alert', 'padding'),
    L('요약 챌린지', 'C', '배지, 알림 배너, 탭을 함께 스타일링하세요.', 'UI 컴포넌트를 종합합니다.', css('.badge { border-radius: 999px; }\n.alert { padding: 12px; }\n.tab.active { font-weight: bold; }'), '.badge', '.alert', '.tab'),
  ] },
  { title: '반응형 패턴', lessons: [
    L('홀리 그레일 레이아웃', 'A', '헤더, 3단 본문, 푸터 레이아웃을 grid로 만드세요.', '홀리 그레일은 좌측 사이드, 중앙, 우측 사이드를 가진 대표적인 레이아웃입니다.', css('.page {\n  display: grid;\n  grid-template-columns: 200px 1fr 200px;\n}'), 'grid-template-columns', 'display: grid'),
    L('카드 그리드 레이아웃', 'A', 'auto-fit과 minmax로 반응형 카드 그리드를 만드세요.', '화면 폭에 맞춰 열 수가 자동으로 변합니다.', css('.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n}'), 'auto-fit', 'minmax('),
    L('사이드바 + 콘텐츠 레이아웃', 'A', '사이드바와 콘텐츠를 flex로 나란히 배치하세요.', '사이드바는 고정 너비, 콘텐츠는 flex: 1 로 나머지를 차지합니다.', css('.layout { display: flex; }\n.side { width: 240px; }\n.content { flex: 1; }'), 'display: flex', 'flex: 1'),
    L('스플릿 스크린 레이아웃', 'A', '화면을 반으로 나누세요.', '두 영역에 각각 50% 너비를 줍니다.', css('.split { display: flex; }\n.split > div { width: 50%; }'), 'width: 50%'),
    L('스티키 헤더 / 푸터', 'A', 'position: sticky로 헤더를 고정하세요.', 'sticky는 스크롤 중 일정 위치에서 고정됩니다.', css('header {\n  position: sticky;\n  top: 0;\n}'), 'position: sticky', 'top: 0'),
    L('복습 챌린지', 'C', '반응형 카드 그리드와 sticky 헤더를 함께 사용하세요.', '반응형 패턴을 종합합니다.', css('header { position: sticky; top: 0; }\n.cards {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n}'), 'position: sticky', 'auto-fit'),
  ] },
  { title: '최종 챌린지', lessons: [
    L('프로필 카드', 'C', '프로필 카드를 카드 스타일로 꾸미세요.', '박스 모델과 변수를 조합합니다.', css('.card {\n  padding: 16px;\n  border-radius: 12px;\n  background: white;\n}'), '.card', 'padding', 'border-radius'),
    L('초콜릿 갤러리 그리드', 'C', 'grid로 이미지 갤러리를 만드세요.', 'repeat과 gap으로 격자 갤러리를 구성합니다.', css('.gallery {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 8px;\n}'), 'display: grid', 'gap'),
    L('세계 7대 불가사의', 'C', '반응형 카드 목록을 만드세요.', '미디어 쿼리와 flex를 조합합니다.', css('.list { display: flex; flex-wrap: wrap; }\n@media (max-width: 600px) {\n  .list { flex-direction: column; }\n}'), 'flex-wrap', '@media'),
    L('새로운 세계 7대 불가사의', 'C', '변수를 사용한 테마를 적용하세요.', '변수와 반응형을 함께 사용합니다.', css(':root { --accent: gold; }\nh2 { color: var(--accent); }'), ':root', 'var('),
  ] },
];
