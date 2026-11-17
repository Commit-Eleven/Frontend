import { L } from './lesson.js';

// 섹션 3: CSS 마스터
const css = (rule) => `<style>\n${rule}\n</style>`;

export default [
  { title: '셀렉터 마스터 – 조합', lessons: [
    L('소개', 'A', '조합 선택자가 무엇인지 주석으로 쓰고 사용 예를 작성하세요.', '조합 선택자는 요소 사이의 관계(포함, 인접 등)로 대상을 고릅니다.', css('/* 요소 관계로 선택 */\ndiv p { color: red; }'), '/*', 'div p'),
    L('자손 셀렉터', 'A', 'div 안의 모든 p를 선택하세요.', '공백으로 이은 선택자는 모든 자손을 고릅니다.', css('div p { color: blue; }'), 'div p'),
    L('자식 셀렉터', 'A', 'ul의 바로 아래 li만 선택하세요.', '> 는 바로 아래 자식만 고릅니다.', css('ul > li { list-style: none; }'), 'ul > li'),
    L('인접 형제 셀렉터', 'A', 'h2 바로 다음의 p만 선택하세요.', '+ 는 바로 다음 형제 하나를 고릅니다.', css('h2 + p { font-weight: bold; }'), 'h2 + p'),
    L('일반 형제 셀렉터', 'A', 'h2 뒤에 오는 모든 p를 선택하세요.', '~ 는 뒤에 오는 모든 형제를 고릅니다.', css('h2 ~ p { color: gray; }'), 'h2 ~ p'),
    L('복습 챌린지', 'C', '자손, 자식, 인접 형제 선택자를 모두 사용하세요.', '조합 선택자를 종합합니다.', css('div p { color: red; }\nul > li { color: blue; }\nh2 + p { color: green; }'), 'div p', 'ul > li', 'h2 + p'),
  ] },
  { title: '인터랙티브 가상 클래스', lessons: [
    L('가상 클래스', 'A', ':hover 가상 클래스를 사용하세요.', '가상 클래스는 요소의 특정 상태를 선택합니다. 선택자:상태 형태입니다.', css('a:hover { color: red; }'), ':hover'),
    L('호버 효과', 'A', '버튼 위에 마우스를 올리면 배경색이 바뀌게 하세요.', ':hover는 마우스가 올라간 상태입니다.', css('button:hover { background: navy; }'), 'button:hover'),
    L('포커스 효과', 'A', ':focus로 입력칸에 테두리를 주세요.', ':focus는 키보드나 클릭으로 선택된 상태입니다.', css('input:focus { border-color: blue; }'), ':focus'),
    L('액티브 스타일', 'A', ':active로 누르는 동안의 스타일을 정하세요.', ':active는 누르고 있는 동안의 상태입니다.', css('button:active { transform: scale(0.95); }'), ':active'),
    L('복습 챌린지', 'C', ':hover, :focus, :active를 모두 사용하세요.', '상태 선택자를 종합합니다.', css('button:hover { background: #333; }\ninput:focus { outline: 2px solid blue; }\nbutton:active { opacity: .8; }'), ':hover', ':focus', ':active'),
  ] },
  { title: '구조적 가상 클래스', lessons: [
    L('구조적 가상 클래스', 'A', '구조적 가상 클래스 예시 하나를 작성하세요.', '요소의 위치(첫째, 마지막, n번째)로 선택하는 가상 클래스입니다.', css('li:first-child { font-weight: bold; }'), ':first-child'),
    L('첫 번째 자식 요소 선택하기', 'A', ':first-child를 사용하세요.', ':first-child는 형제 중 첫 번째 요소입니다.', css('li:first-child { color: red; }'), ':first-child'),
    L('마지막 자식 요소 선택하기', 'A', ':last-child를 사용하세요.', ':last-child는 형제 중 마지막 요소입니다.', css('li:last-child { border: none; }'), ':last-child'),
    L('패턴의 힘: nth-child 사용하기', 'A', ':nth-child(even)으로 짝수 행 배경을 주세요.', 'nth-child(수식)으로 패턴 선택이 가능합니다. odd=홀수, even=짝수.', css('tr:nth-child(even) { background: #f2f2f2; }'), ':nth-child('),
    L('복습 챌린지', 'C', ':first-child, :last-child, :nth-child를 모두 사용하세요.', '구조 선택자를 종합합니다.', css('li:first-child { color: red; }\nli:last-child { color: blue; }\nli:nth-child(odd) { background: #eee; }'), ':first-child', ':last-child', ':nth-child('),
  ] },
  { title: '드롭다운 메뉴 프로젝트', lessons: [
    L('서브메뉴 추가하기', 'C', 'li 안에 중첩 ul로 서브메뉴를 만드세요.', '메뉴 항목 안에 하위 목록을 중첩합니다.', '<ul>\n  <li>Menu\n    <ul class="sub">\n      <li>Sub</li>\n    </ul>\n  </li>\n</ul>', '<ul', 'class="sub"'),
    L('서브메뉴 표시하기', 'C', '평소엔 숨기고 hover 시 보이게 하세요.', 'display:none으로 숨기고 부모에 hover 하면 block으로 보여 줍니다.', css('.sub { display: none; }\nli:hover .sub { display: block; }'), 'display: none', 'li:hover .sub'),
    L('스타일링 더하기', 'C', '서브메뉴에 배경, 패딩, 위치를 지정하세요.', 'absolute로 아래에 띄웁니다.', css('.sub {\n  position: absolute;\n  background: white;\n  padding: 8px;\n}'), 'position: absolute', 'background'),
    L('Input과 버튼', 'C', '검색 input과 버튼을 메뉴 옆에 배치하세요.', 'flex로 메뉴와 검색창을 나란히 둡니다.', '<nav>\n  <input type="text">\n  <button>Search</button>\n</nav>', '<input', '<button>'),
  ] },
  { title: '시각 효과', lessons: [
    L('그라디언트', 'A', 'linear-gradient 배경을 만드세요.', 'linear-gradient(방향, 색1, 색2)로 색이 변하는 배경을 만듭니다.', css('.hero { background: linear-gradient(to right, red, blue); }'), 'linear-gradient('),
    L('CSS 필터', 'A', 'filter로 이미지를 흐리게 만드세요.', 'filter는 blur, grayscale, brightness 등의 효과를 줍니다.', css('img { filter: blur(4px); }'), 'filter:'),
    L('트랜스폼', 'A', 'transform으로 요소를 회전하세요.', 'transform은 rotate, scale, translate로 요소를 변형합니다.', css('.box { transform: rotate(10deg); }'), 'transform:'),
    L('트랜지션 및 호버 효과', 'A', 'transition으로 hover 변화를 부드럽게 하세요.', 'transition은 속성 변화를 시간에 걸쳐 부드럽게 만듭니다.', css('button {\n  transition: background 0.3s;\n}\nbutton:hover { background: navy; }'), 'transition', ':hover'),
    L('복습 챌린지', 'C', '그라디언트, 변형, 트랜지션을 모두 사용하세요.', '시각 효과를 종합합니다.', css('.card {\n  background: linear-gradient(red, blue);\n  transition: transform 0.3s;\n}\n.card:hover { transform: scale(1.05); }'), 'linear-gradient', 'transition', 'transform'),
  ] },
  { title: '랜딩 페이지', lessons: [
    L('헤더 섹션 스타일링하기', 'C', 'header에 배경과 가운데 정렬을 주세요.', '랜딩 페이지 상단을 꾸밉니다.', css('header {\n  background: #111;\n  color: white;\n  text-align: center;\n  padding: 40px;\n}'), 'header {', 'background', 'padding'),
    L('버튼 스타일링하기', 'C', 'CTA 버튼의 색, 패딩, 모서리를 지정하세요.', '행동 유도 버튼을 눈에 띄게 만듭니다.', css('.cta {\n  background: #0a84ff;\n  color: white;\n  padding: 12px 24px;\n  border-radius: 8px;\n}'), '.cta', 'padding', 'border-radius'),
    L('섹션 레이아웃', 'C', 'section에 패딩과 최대 너비를 주세요.', '읽기 좋은 폭을 만듭니다.', css('section {\n  padding: 40px 20px;\n  max-width: 900px;\n  margin: 0 auto;\n}'), 'section {', 'max-width', 'margin'),
    L('카드 레이아웃', 'C', 'flex로 카드를 가로로 배치하세요.', '카드를 나란히 놓습니다.', css('.cards {\n  display: flex;\n  gap: 16px;\n}\n.card { flex: 1; }'), 'display: flex', '.card'),
    L('마무리 작업하기', 'C', 'hover 효과와 트랜지션을 추가하세요.', '마지막으로 상호작용 효과를 더합니다.', css('.card { transition: transform 0.2s; }\n.card:hover { transform: translateY(-4px); }'), 'transition', ':hover'),
  ] },
  { title: 'CSS Grid로 구축하기', lessons: [
    L('Grid 기초', 'A', 'display: grid와 grid-template-columns를 사용하세요.', 'grid는 행과 열로 이루어진 격자 레이아웃입니다.', css('.grid {\n  display: grid;\n  grid-template-columns: 1fr 1fr 1fr;\n  gap: 8px;\n}'), 'display: grid', 'grid-template-columns'),
    L('Grid-row 아이템 배치', 'A', 'grid-row와 grid-column으로 항목 위치를 지정하세요.', 'grid-row, grid-column은 항목이 차지할 칸을 정합니다.', css('.item {\n  grid-column: 1 / 3;\n  grid-row: 1;\n}'), 'grid-column', 'grid-row'),
    L('이름이 지정된 영역', 'A', 'grid-template-areas로 영역에 이름을 붙이세요.', '영역 이름으로 레이아웃을 시각적으로 정의합니다.', css('.page {\n  display: grid;\n  grid-template-areas:\n    "header header"\n    "side main";\n}\n.main { grid-area: main; }'), 'grid-template-areas', 'grid-area'),
    L('복습 챌린지', 'C', '3열 그리드에 gap을 주고 항목 하나를 두 칸 차지하게 하세요.', 'Grid 속성을 종합합니다.', css('.grid {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n  gap: 10px;\n}\n.wide { grid-column: span 2; }'), 'display: grid', 'repeat(', 'span 2'),
  ] },
  { title: 'Flavor Fiesta 웹사이트', lessons: [
    L('그리드 설정하기', 'C', 'body에 영역이 나뉜 grid를 설정하세요.', '헤더, 메인, 푸터 영역을 정합니다.', css('body {\n  display: grid;\n  grid-template-rows: auto 1fr auto;\n  min-height: 100vh;\n}'), 'display: grid', 'grid-template-rows'),
    L('헤더', 'C', '헤더 영역을 꾸미세요.', '배경과 정렬을 지정합니다.', css('header {\n  background: #ff6b35;\n  color: white;\n  padding: 20px;\n}'), 'header {', 'background'),
    L('메인 영역', 'C', '메인에 카드 grid를 배치하세요.', '메인 영역의 카드를 격자로 배치합니다.', css('main {\n  display: grid;\n  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));\n  gap: 16px;\n}'), 'main {', 'display: grid'),
    L('푸터', 'C', '푸터 영역을 꾸미세요.', '배경과 가운데 정렬을 지정합니다.', css('footer {\n  background: #222;\n  color: white;\n  text-align: center;\n  padding: 16px;\n}'), 'footer {', 'text-align'),
  ] },
  { title: '최종 챌린지', lessons: [
    L('활성 메뉴 강조하기', 'C', '.active 클래스의 메뉴를 굵게 하고 밑줄을 주세요.', '클래스 선택자로 현재 메뉴를 강조합니다.', css('nav a.active {\n  font-weight: bold;\n  border-bottom: 2px solid;\n}'), 'a.active', 'font-weight'),
    L('지브라 테이블 행', 'C', ':nth-child(even)으로 줄무늬 표를 만드세요.', '짝수 행 배경을 달리합니다.', css('tr:nth-child(even) { background: #f2f2f2; }'), ':nth-child(even)'),
    L('버튼 호버 효과', 'C', 'hover 시 색과 크기를 부드럽게 바꾸세요.', 'hover와 transition을 조합합니다.', css('button { transition: all 0.2s; }\nbutton:hover { transform: scale(1.05); }'), ':hover', 'transition'),
    L('Grid 카드 레이아웃', 'C', 'grid로 카드 3개를 배치하세요.', 'grid-template-columns로 열을 나눕니다.', css('.cards {\n  display: grid;\n  grid-template-columns: repeat(3, 1fr);\n}'), 'display: grid', 'repeat(3'),
    L('블러 처리된 Hero 이미지', 'C', 'filter: blur로 배경 이미지를 흐리게 하세요.', 'filter와 오버레이로 글자가 잘 보이게 합니다.', css('.hero img { filter: blur(6px); }'), 'filter: blur'),
  ] },
];
