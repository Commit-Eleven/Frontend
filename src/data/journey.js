export const initialCompleted = [
  'html-intro',
  'html-document',
  'html-tags',
  'html-head',
  'html-body',
  'html-first',
];

export const chapterData = [
  {
    title: 'HTML 기초',
    rows: [
      { main: { id: 'html-intro', title: 'HTML 소개', type: 'all', initial: 'done' } },
      { main: { id: 'html-document', title: 'HTML 문서 구조', type: 'all', initial: 'done' } },
      { main: { id: 'html-tags', title: '태그와 요소', type: 'all', initial: 'done' } },
      { main: { id: 'html-head', title: 'head 요소', type: 'all', initial: 'done' } },
      { main: { id: 'html-body', title: 'body 요소', type: 'all', initial: 'done' } },
      { main: { id: 'html-first', title: '첫 웹 페이지', type: 'trophy', initial: 'done' } },
    ],
  },
  {
    title: '텍스트와 서식',
    rows: [
      {
        main: { id: 'text-mastery', title: '텍스트 마스터리', type: 'mastery', initial: 'special' },
        side: { id: 'text-intro', title: '텍스트 강조', type: 'all', initial: 'done' },
      },
      {
        main: { id: 'paragraphs', title: '단락', type: 'all' },
        side: { id: 'paragraphs-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'headings', title: '제목', type: 'all' },
        side: { id: 'headings-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'line-breaks', title: '줄 바꿈', type: 'all' },
        side: { id: 'line-breaks-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'formatting', title: '텍스트 꾸미기', type: 'all' },
        side: { id: 'formatting-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      { main: { id: 'text-challenge', title: '텍스트 챌린지', type: 'challenge' } },
      { main: { id: 'text-trophy', title: '챕터 완료', type: 'trophy' } },
    ],
  },
  {
    title: '리스트 다루기',
    rows: [
      {
        main: { id: 'unordered-list', title: '순서 없는 리스트', type: 'all' },
        side: { id: 'list-mastery-1', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'ordered-list', title: '순서 있는 리스트', type: 'all' },
        side: { id: 'list-mastery-2', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'list-items', title: '리스트 항목', type: 'all' },
        side: { id: 'list-mastery-3', title: '마스터리 챌린지', type: 'mastery' },
      },
      { main: { id: 'list-challenge', title: '리스트 챌린지', type: 'challenge' } },
      { main: { id: 'list-trophy', title: '챕터 완료', type: 'trophy' } },
    ],
  },
  {
    title: '레시피 카드',
    rows: [
      { main: { id: 'recipe-start', title: '레시피 카드 시작', type: 'challenge' } },
      { main: { id: 'recipe-1', title: '제목과 설명', type: 'project' } },
      { main: { id: 'recipe-2', title: '재료 목록', type: 'project' } },
      { main: { id: 'recipe-3', title: '조리 단계', type: 'project' } },
      { main: { id: 'recipe-trophy', title: '프로젝트 완료', type: 'trophy' } },
    ],
  },
  {
    title: '콘텐츠 추가하기',
    rows: [
      {
        main: { id: 'links', title: '링크', type: 'all' },
        side: { id: 'links-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'images', title: '이미지', type: 'all' },
        side: { id: 'images-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'audio-video', title: '오디오와 비디오', type: 'all' },
        side: { id: 'media-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'content-more', title: '다양한 콘텐츠', type: 'all' },
        side: { id: 'content-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      { main: { id: 'content-trophy', title: '챕터 완료', type: 'trophy' } },
    ],
  },
  {
    title: '페이지 레이아웃',
    rows: [
      {
        main: { id: 'semantic', title: '시맨틱 요소', type: 'all' },
        side: { id: 'semantic-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'header-footer', title: '헤더와 푸터', type: 'all' },
        side: { id: 'layout-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'sections', title: '섹션', type: 'all' },
        side: { id: 'sections-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      { main: { id: 'layout-challenge', title: '레이아웃 챌린지', type: 'challenge' } },
      { main: { id: 'layout-trophy', title: '챕터 완료', type: 'trophy' } },
    ],
  },
  {
    title: '개인 프로필 페이지',
    rows: [
      { main: { id: 'profile-start', title: '프로필 시작', type: 'challenge' } },
      { main: { id: 'profile-about', title: '소개 작성', type: 'project' } },
      { main: { id: 'profile-links', title: '연락처 링크', type: 'project' } },
      { main: { id: 'profile-image', title: '프로필 이미지', type: 'project' } },
      { main: { id: 'profile-trophy', title: '프로젝트 완료', type: 'trophy' } },
    ],
  },
  {
    title: '폼과 입력 요소 파트 1',
    rows: [
      {
        main: { id: 'form', title: '폼 만들기', type: 'all' },
        side: { id: 'form-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'input', title: '입력 요소', type: 'all' },
        side: { id: 'input-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'labels', title: '레이블', type: 'all' },
        side: { id: 'labels-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      { main: { id: 'form-challenge', title: '폼 챌린지', type: 'challenge' } },
      { main: { id: 'form-trophy', title: '챕터 완료', type: 'trophy' } },
    ],
  },
  {
    title: '폼과 입력 요소 파트 2',
    rows: [
      {
        main: { id: 'select', title: '선택 메뉴', type: 'all' },
        side: { id: 'select-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'checkbox', title: '체크박스', type: 'all' },
        side: { id: 'checkbox-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'radio', title: '라디오 버튼', type: 'all' },
        side: { id: 'radio-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      { main: { id: 'form2-challenge', title: '폼 완성하기', type: 'challenge' } },
      { main: { id: 'form2-trophy', title: '챕터 완료', type: 'trophy' } },
    ],
  },
  {
    title: '테이블',
    rows: [
      {
        main: { id: 'table', title: '테이블 만들기', type: 'all' },
        side: { id: 'table-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'table-rows', title: '행과 열', type: 'all' },
        side: { id: 'rows-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      {
        main: { id: 'table-head', title: '테이블 제목', type: 'all' },
        side: { id: 'head-mastery', title: '마스터리 챌린지', type: 'mastery' },
      },
      { main: { id: 'table-challenge', title: '테이블 챌린지', type: 'challenge' } },
      { main: { id: 'table-trophy', title: '챕터 완료', type: 'trophy' } },
    ],
  },
  {
    title: '이벤트 등록 페이지',
    rows: [
      { main: { id: 'event-start', title: '이벤트 페이지 시작', type: 'challenge' } },
      { main: { id: 'event-form', title: '등록 폼', type: 'project' } },
      { main: { id: 'event-details', title: '이벤트 정보', type: 'project' } },
      { main: { id: 'event-finish', title: '페이지 완성', type: 'project' } },
      { main: { id: 'event-trophy', title: '프로젝트 완료', type: 'trophy' } },
    ],
  },
  {
    title: '최종 챌린지',
    rows: [
      { main: { id: 'final-one', title: '최종 챌린지 1', type: 'challenge' } },
      { main: { id: 'final-two', title: '최종 챌린지 2', type: 'challenge' } },
      { main: { id: 'final-three', title: '최종 챌린지 3', type: 'challenge' } },
      { main: { id: 'final-trophy', title: '과정 완료', type: 'trophy' } },
    ],
  },
];

export const allMainLessons = chapterData.flatMap((chapter) => chapter.rows.map((row) => row.main));
export const allNodes = chapterData.flatMap((chapter) =>
  chapter.rows.flatMap((row) => [row.main, row.side].filter(Boolean)),
);
export const navItems = [
  { label: '여정', asset: 'journey', active: true },
  { label: '연습', asset: 'practice' },
  { label: '프로젝트', asset: 'projects' },
  { label: '역사', asset: 'history', dot: true },
  { label: '면접', asset: 'interview', group: '커리어' },
  { label: '미션', asset: 'daily-challenges', group: '진행' },
  { label: '리더보드', asset: 'leaderboard' },
  { label: '스토어', asset: 'store', dot: true },
];

export function statusFor(node, completed, active) {
  if (node.id === active) return 'active';
  if (completed.includes(node.id)) return 'done';
  return node.initial || 'locked';
}
