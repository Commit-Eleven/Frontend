import { chapterData as htmlChapters, initialCompleted as htmlInitialCompleted } from './journey.js';

const languageCurricula = {
  javascript: {
    title: 'JavaScript 기초',
    nextSectionTitle: '웹 페이지에 동작 더하기',
    chapters: [
      {
        title: 'JavaScript 시작하기',
        lessons: [
          ['javascript-output', '콘솔에 출력하기'],
          ['javascript-comments', '주석 작성하기'],
          ['javascript-variables', '변수 만들기'],
          ['javascript-strings', '문자열 다루기'],
        ],
      },
      {
        title: '조건과 반복',
        lessons: [
          ['javascript-types', '자료형 알아보기'],
          ['javascript-comparisons', '값 비교하기'],
          ['javascript-conditionals', '조건문 사용하기'],
          ['javascript-loops', '반복문 사용하기'],
        ],
      },
      {
        title: '함수와 데이터',
        lessons: [
          ['javascript-functions', '함수 만들기'],
          ['javascript-arrays', '배열 다루기'],
          ['javascript-objects', '객체 다루기'],
          ['javascript-review', '기초 종합 연습'],
        ],
      },
    ],
  },
  python: {
    title: 'Python 기초',
    nextSectionTitle: 'Python으로 문제 해결하기',
    chapters: [
      {
        title: 'Python 시작하기',
        lessons: [
          ['python-output', '화면에 출력하기'],
          ['python-comments', '주석 작성하기'],
          ['python-variables', '변수 만들기'],
          ['python-strings', '문자열 다루기'],
        ],
      },
      {
        title: '조건과 반복',
        lessons: [
          ['python-types', '자료형 알아보기'],
          ['python-comparisons', '값 비교하기'],
          ['python-conditionals', '조건문 사용하기'],
          ['python-loops', '반복문 사용하기'],
        ],
      },
      {
        title: '함수와 데이터',
        lessons: [
          ['python-functions', '함수 만들기'],
          ['python-lists', '리스트 다루기'],
          ['python-dictionaries', '딕셔너리 다루기'],
          ['python-review', '기초 종합 연습'],
        ],
      },
    ],
  },
  java: {
    title: 'Java 기초',
    nextSectionTitle: '객체 지향 프로그래밍',
    chapters: [
      {
        title: 'Java 시작하기',
        lessons: [
          ['java-output', '콘솔에 출력하기'],
          ['java-comments', '주석 작성하기'],
          ['java-variables', '변수와 자료형'],
          ['java-strings', '문자열 다루기'],
        ],
      },
      {
        title: '조건과 반복',
        lessons: [
          ['java-operators', '연산자 사용하기'],
          ['java-comparisons', '값 비교하기'],
          ['java-conditionals', '조건문 사용하기'],
          ['java-loops', '반복문 사용하기'],
        ],
      },
      {
        title: '메서드와 데이터',
        lessons: [
          ['java-methods', '메서드 만들기'],
          ['java-arrays', '배열 다루기'],
          ['java-classes', '클래스 기초'],
          ['java-review', '기초 종합 연습'],
        ],
      },
    ],
  },
};

function rowsFor(lessons) {
  return lessons.map(([id, title]) => ({ main: { id, title, type: 'all' } }));
}

export function journeyFor(language = 'html') {
  if (language === 'html') {
    const allMainLessons = htmlChapters.flatMap((chapter) => chapter.rows.map((row) => row.main));
    return {
      language,
      title: 'HTML 기초',
      nextSectionTitle: 'CSS로 스타일링하기',
      chapterData: htmlChapters,
      allMainLessons,
      allNodes: htmlChapters.flatMap((chapter) =>
        chapter.rows.flatMap((row) => [row.main, row.side].filter(Boolean)),
      ),
      initialCompleted: htmlInitialCompleted,
      defaultActive: 'paragraphs',
    };
  }

  const curriculum = languageCurricula[language] || languageCurricula.javascript;
  const chapters = curriculum.chapters.map((chapter) => ({
    title: chapter.title,
    rows: rowsFor(chapter.lessons),
  }));
  const allMainLessons = chapters.flatMap((chapter) => chapter.rows.map((row) => row.main));
  return {
    language,
    title: curriculum.title,
    nextSectionTitle: curriculum.nextSectionTitle,
    chapterData: chapters,
    allMainLessons,
    allNodes: allMainLessons,
    initialCompleted: [],
    defaultActive: allMainLessons[0]?.id,
  };
}

export function chapterTitleFor(lessonId, journey) {
  return (
    journey.chapterData.find((chapter) =>
      chapter.rows.some((row) => row.main.id === lessonId || row.side?.id === lessonId),
    )?.title ?? journey.title
  );
}
