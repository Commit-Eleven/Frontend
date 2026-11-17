import { L } from './lesson.js';

// 섹션 5: JavaScript 실전
const js = (code) => `<script>\n${code}\n</script>`;

export default [
  { title: '상호작용/UI 컴포넌트', lessons: [
    L('탭', 'A', '버튼을 누르면 해당 패널이 보이도록 이벤트를 연결하세요.', 'addEventListener로 클릭을 감지하고 classList로 보이기/숨기기를 전환합니다.', js('const tabs = document.querySelectorAll(".tab");\ntabs.forEach((tab) => {\n  tab.addEventListener("click", () => {\n    tab.classList.toggle("active");\n  });\n});'), 'addEventListener(', 'classList.toggle('),
    L('아코디언(펼치기/접기)', 'A', '제목을 누르면 내용이 펼쳐지고 접히게 하세요.', 'classList.toggle로 클래스를 켜고 끄며 CSS로 보이기를 제어합니다.', js('const head = document.querySelector(".head");\nhead.addEventListener("click", () => {\n  head.nextElementSibling.classList.toggle("open");\n});'), 'addEventListener("click"', 'classList.toggle('),
    L('모달(열기/닫기)', 'A', '버튼으로 모달을 열고 닫으세요.', 'classList.add/remove로 열린 상태를 제어합니다.', js('const modal = document.querySelector(".modal");\nopenBtn.addEventListener("click", () => modal.classList.add("show"));\ncloseBtn.addEventListener("click", () => modal.classList.remove("show"));'), 'classList.add(', 'classList.remove('),
    L('드롭다운', 'A', '버튼을 누르면 메뉴가 토글되게 하세요.', '메뉴의 보이기 상태를 클릭마다 바꿉니다.', js('btn.addEventListener("click", () => {\n  menu.classList.toggle("show");\n});'), 'addEventListener(', 'classList.toggle('),
  ] },
  { title: '폼 및 유효성 검사', lessons: [
    L('입력 유효성 검사', 'A', '입력값이 비어 있으면 오류 표시를 하세요.', 'input의 value로 값을 읽어 조건을 검사합니다.', js('const input = document.querySelector("input");\nif (input.value.trim() === "") {\n  input.classList.add("error");\n}'), '.value', 'classList.add('),
    L('사용자 지정 오류 메시지', 'A', '오류 메시지를 화면에 표시하세요.', 'textContent로 메시지 요소의 글자를 바꿉니다.', js('const msg = document.querySelector(".msg");\nmsg.textContent = "이름을 입력하세요";'), 'textContent', 'querySelector('),
    L('제출 버튼', 'A', 'submit 이벤트에서 기본 동작을 막고 검사하세요.', 'event.preventDefault()로 폼의 기본 제출을 막습니다.', js('form.addEventListener("submit", (e) => {\n  e.preventDefault();\n});'), '"submit"', 'preventDefault('),
  ] },
  { title: '알림 및 피드백', lessons: [
    L('토스트 메시지', 'A', '잠깐 나타났다 사라지는 토스트를 만드세요.', 'setTimeout으로 일정 시간 뒤에 숨깁니다.', js('toast.classList.add("show");\nsetTimeout(() => toast.classList.remove("show"), 2000);'), 'setTimeout(', 'classList'),
    L('닫을 수 있는 배너', 'A', '닫기 버튼으로 배너를 제거하세요.', 'element.remove()로 요소를 문서에서 제거합니다.', js('closeBtn.addEventListener("click", () => {\n  banner.remove();\n});'), 'addEventListener(', '.remove()'),
    L('로딩 표시기', 'A', '로딩 중에는 스피너를 보이고 끝나면 숨기세요.', '상태에 따라 요소의 hidden 속성을 바꿉니다.', js('spinner.hidden = false;\nsetTimeout(() => {\n  spinner.hidden = true;\n}, 1000);'), 'hidden', 'setTimeout('),
  ] },
  { title: 'Toast 알림이 있는 폼', lessons: [
    L('Toast 메시지 표시', 'C', '폼 제출 시 토스트를 표시하세요.', '제출 이벤트에서 토스트를 보이게 합니다.', js('form.addEventListener("submit", (e) => {\n  e.preventDefault();\n  toast.classList.add("show");\n});'), '"submit"', 'preventDefault(', 'classList.add('),
    L('Toast 메시지 숨기기', 'C', '2초 뒤 토스트를 숨기세요.', 'setTimeout으로 일정 시간 뒤 클래스를 제거합니다.', js('setTimeout(() => {\n  toast.classList.remove("show");\n}, 2000);'), 'setTimeout(', 'classList.remove('),
  ] },
  { title: '내비게이션', lessons: [
    L('모바일 버거 메뉴 토글', 'A', '버거 버튼으로 메뉴를 열고 닫으세요.', '클릭할 때마다 메뉴의 open 클래스를 토글합니다.', js('burger.addEventListener("click", () => {\n  nav.classList.toggle("open");\n});'), 'classList.toggle('),
    L('접을 수 있는 사이드 내비게이션', 'A', '사이드바를 접고 펼치세요.', '버튼으로 collapsed 클래스를 토글합니다.', js('toggle.addEventListener("click", () => {\n  sidebar.classList.toggle("collapsed");\n});'), 'classList.toggle('),
    L('드롭다운 메뉴', 'A', '메뉴 항목 클릭 시 하위 메뉴를 토글하세요.', '이벤트 대상의 다음 형제 요소를 토글합니다.', js('item.addEventListener("click", () => {\n  item.nextElementSibling.classList.toggle("show");\n});'), 'addEventListener(', 'nextElementSibling'),
  ] },
  { title: '테마 설정 및 개인화', lessons: [
    L('다크/라이트 테마', 'A', '버튼으로 data-theme 속성을 바꾸세요.', 'setAttribute로 요소의 속성을 바꿔 테마를 전환합니다.', js('btn.addEventListener("click", () => {\n  document.documentElement.setAttribute("data-theme", "dark");\n});'), 'setAttribute(', 'data-theme'),
    L('테마 선택 저장', 'A', 'localStorage에 선택한 테마를 저장하세요.', 'localStorage.setItem/getItem으로 브라우저에 값을 저장하고 불러옵니다.', js('localStorage.setItem("theme", "dark");\nconst saved = localStorage.getItem("theme");'), 'localStorage.setItem(', 'localStorage.getItem('),
  ] },
  { title: '애니메이션 및 효과', lessons: [
    L('CSS 트랜지션', 'A', 'JavaScript로 클래스를 바꿔 트랜지션을 실행하세요.', 'CSS transition이 있는 속성의 값을 클래스로 바꾸면 부드럽게 변합니다.', js('box.classList.add("moved");'), 'classList.add('),
    L('스크롤 시 요소 애니메이션', 'A', '스크롤 위치에 따라 클래스를 추가하세요.', 'scroll 이벤트에서 window.scrollY를 확인합니다.', js('window.addEventListener("scroll", () => {\n  if (window.scrollY > 100) header.classList.add("small");\n});'), '"scroll"', 'scrollY'),
    L('버튼 클릭 애니메이션', 'A', '버튼 클릭 시 짧은 애니메이션 클래스를 붙였다 떼세요.', 'setTimeout으로 클래스를 제거해 한 번만 재생합니다.', js('btn.addEventListener("click", () => {\n  btn.classList.add("pop");\n  setTimeout(() => btn.classList.remove("pop"), 300);\n});'), 'classList.add(', 'setTimeout('),
  ] },
  { title: '애니메이션 내비게이션', lessons: [
    L('변수', 'A', 'const와 let으로 요소를 변수에 저장하세요.', '자주 쓰는 요소는 변수에 담아 재사용합니다.', js('const nav = document.querySelector("nav");\nlet open = false;'), 'const nav', 'let open'),
    L('이벤트 리스너', 'C', '메뉴 버튼 클릭 시 open 상태를 바꾸세요.', '이벤트 안에서 상태를 바꾸고 클래스에 반영합니다.', js('btn.addEventListener("click", () => {\n  open = !open;\n  nav.classList.toggle("open", open);\n});'), 'addEventListener(', 'classList.toggle('),
    L('CSS 트랜지션', 'C', 'transition이 적용된 메뉴를 JavaScript로 토글하세요.', 'CSS transition과 JavaScript 클래스 전환을 함께 사용합니다.', '<style>nav { transition: transform 0.3s; }\nnav.open { transform: none; }</style>', 'transition', '.open'),
  ] },
  { title: '최종 도전 과제', lessons: [
    L('인터랙티브 FAQ 아코디언', 'C', '여러 FAQ 항목을 펼치고 접으세요.', 'querySelectorAll과 forEach로 모든 항목에 이벤트를 연결합니다.', js('document.querySelectorAll(".faq").forEach((item) => {\n  item.addEventListener("click", () => {\n    item.classList.toggle("open");\n  });\n});'), 'querySelectorAll(', 'forEach(', 'classList.toggle('),
    L('로그인 폼', 'C', '빈 값이면 오류를 표시하고 제출을 막으세요.', '유효성 검사와 submit 이벤트를 결합합니다.', js('form.addEventListener("submit", (e) => {\n  if (!email.value) {\n    e.preventDefault();\n    msg.textContent = "이메일을 입력하세요";\n  }\n});'), 'preventDefault(', 'textContent', '.value'),
    L('반응형 내비게이션 바', 'C', '버거 메뉴와 미디어 쿼리를 함께 사용하세요.', 'CSS 미디어 쿼리와 JavaScript 토글을 결합합니다.', js('burger.addEventListener("click", () => {\n  nav.classList.toggle("open");\n});'), 'classList.toggle('),
    L('테마가 적용된 블로그 페이지', 'C', '테마를 토글하고 localStorage에 저장하세요.', '테마 변수와 저장 기능을 결합합니다.', js('btn.addEventListener("click", () => {\n  document.documentElement.dataset.theme = "dark";\n  localStorage.setItem("theme", "dark");\n});'), 'localStorage.setItem(', 'addEventListener('),
  ] },
];
