export const starterCode =
  '<!DOCTYPE html>\n<html>\n  <body>\n    <!-- 여기에 코드를 작성하세요 -->\n  </body>\n</html>';
const lessonChallenges = {
  paragraphs: {
    instruction:
      '두 개의 paragraph가 있는 HTML 문서를 만드세요. 첫 번째 paragraph에는 "Welcome to our pizza restaurant!"라고 쓰고, 두 번째 paragraph에는 "Explore our menu today."라고 쓰세요.',
    theory:
      'HTML에서 paragraph는 <p> 태그를 사용하여 생성합니다. <p>와 </p> 사이의 텍스트는 위와 아래에 여백이 있는 별도의 paragraph로 표시됩니다.',
    example: '<p>This is a paragraph.</p>\n<p>This is another paragraph.</p>',
    checks: [
      { selector: 'p', index: 0, expected: 'Welcome to our pizza restaurant!' },
      { selector: 'p', index: 1, expected: 'Explore our menu today.' },
    ],
  },
  headings: {
    instruction:
      '페이지 제목을 만들어 보세요. h1 요소에는 "Welcome to our pizza restaurant!"를, h2 요소에는 "Our Menu"를 작성하세요.',
    theory:
      'h1부터 h6까지의 제목 요소로 콘텐츠의 구조를 나타냅니다. h1은 페이지의 가장 중요한 제목입니다.',
    example: '<h1>Page title</h1>\n<h2>Section title</h2>',
    checks: [
      { selector: 'h1', index: 0, expected: 'Welcome to our pizza restaurant!' },
      { selector: 'h2', index: 0, expected: 'Our Menu' },
    ],
  },
  'line-breaks': {
    instruction:
      'p 요소 안에 "Open daily"와 "11 AM - 10 PM"을 쓰고, 두 문구 사이에 br 태그를 넣으세요.',
    theory: 'br 태그는 문장을 새 줄로 바꿉니다. 닫는 태그 없이 사용합니다.',
    example: '<p>First line<br>Second line</p>',
    checks: [
      { selector: 'p', index: 0, expected: 'Open daily11 AM - 10 PM' },
      { selector: 'br', index: 0, expected: 'br 태그', exists: true },
    ],
  },
  formatting: {
    instruction: 'strong 요소에는 "Fresh pizza"를, em 요소에는 "Made daily"를 작성하세요.',
    theory: 'strong 태그는 중요한 텍스트를, em 태그는 강조할 텍스트를 나타냅니다.',
    example: '<strong>Important</strong>\n<em>Emphasis</em>',
    checks: [
      { selector: 'strong', index: 0, expected: 'Fresh pizza' },
      { selector: 'em', index: 0, expected: 'Made daily' },
    ],
  },
};
/** 레슨에 연결된 문제와 테스트 조건을 반환합니다. */
export function challengeFor(lesson) {
  return (
    lessonChallenges[lesson.id] || {
      instruction: 'p 요소를 하나 만들고 "' + lesson.title + '"이라고 작성하세요.',
      theory: 'HTML 요소는 시작 태그와 종료 태그 사이에 콘텐츠를 넣어 만듭니다.',
      example: '<p>' + lesson.title + '</p>',
      checks: [{ selector: 'p', index: 0, expected: lesson.title }],
    }
  );
}

const preChallengeQuestions = {
  paragraphs: {
    prompt: '단락을 만들 때 사용하는 HTML 태그는 무엇인가요?',
    choices: ['<p>', '<h1>', '<span>'],
    correct: '<p>',
    explanation: '<p> 요소는 문단을 나타내며, 각 문단을 별도의 블록으로 표시합니다.',
  },
  headings: {
    prompt: '페이지에서 가장 중요한 제목에 사용하는 태그는 무엇인가요?',
    choices: ['<h1>', '<h6>', '<title>'],
    correct: '<h1>',
    explanation: '<h1>은 페이지의 가장 높은 단계의 제목을 나타냅니다.',
  },
  'line-breaks': {
    prompt: '텍스트를 다음 줄로 이동시키는 태그는 무엇인가요?',
    choices: ['<br>', '<hr>', '<p>'],
    correct: '<br>',
    explanation: '<br>은 문장 안에서 줄바꿈을 만들 때 사용합니다.',
  },
  formatting: {
    prompt: '중요한 텍스트임을 의미하는 태그는 무엇인가요?',
    choices: ['<strong>', '<span>', '<div>'],
    correct: '<strong>',
    explanation: '<strong>은 내용의 중요성을 의미로 전달합니다.',
  },
}

/** 레슨에 연결된 사전 선택형 문제를 반환합니다. */
export function preChallengeQuestionFor(lesson) {
  return preChallengeQuestions[lesson.id] || {
    prompt: 'HTML 태그는 보통 어떤 형태로 콘텐츠를 감싸나요?',
    choices: ['<tag>내용</tag>', '{tag} 내용', '[tag] 내용'],
    correct: '<tag>내용</tag>',
    explanation: 'HTML 요소는 여는 태그와 닫는 태그 사이에 콘텐츠를 넣어 작성합니다.',
  }
}

export const quizQuestions = [
  {
    type: 'blanks',
    prompt: '요소 이름을 입력하여 단락 요소를 완성하세요',
    choices: [
      ['text', 'para', 'p'],
      ['p', 'div', 'para'],
    ],
    correct: ['p', 'p'],
  },
  {
    type: 'single',
    prompt: '브라우저는 문단 요소 위와 아래에 자동으로 여백을 추가합니다.',
    choices: ['참', '거짓'],
    correct: '참',
  },
  {
    type: 'single',
    prompt: 'HTML에서 단락을 만드는 태그는 무엇인가요?',
    choices: ['<div>', '<p>', '<span>'],
    correct: '<p>',
  },
];
