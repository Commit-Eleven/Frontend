import python1 from './coddy/python.js';
import python2 from './coddy/python2.js';
import python3 from './coddy/python3.js';
import javascript1 from './coddy/javascript.js';
import javascript2 from './coddy/javascript2.js';
import javascript3 from './coddy/javascript3.js';
import javascript4 from './coddy/javascript4.js';
import java1 from './coddy/java.js';
import java2 from './coddy/java2.js';
import java3 from './coddy/java3.js';
import html1 from './coddy/html1.js';
import html2 from './coddy/html2.js';
import html3 from './coddy/html3.js';
import html4 from './coddy/html4.js';
import html5 from './coddy/html5.js';

// Coddy 여정 구성을 따르는 언어별 커리큘럼 (프론트에서 직접 관리)
const languageCurricula = {
  python: {
    code: 'py',
    title: 'Python',
    sections: [
      { title: '기초', chapters: python1 },
      { title: '논리와 흐름', chapters: python2 },
      { title: '객체 지향 프로그래밍', chapters: python3 },
    ],
    nextSectionTitle: null,
  },
  javascript: {
    code: 'js',
    title: 'JavaScript',
    sections: [
      { title: '기초', chapters: javascript1 },
      { title: '논리 & 흐름', chapters: javascript2 },
      { title: 'TypeScript 소개', chapters: javascript3 },
      { title: '객체 지향 프로그래밍', chapters: javascript4 },
    ],
    nextSectionTitle: null,
  },
  java: {
    code: 'java',
    title: 'Java',
    sections: [
      { title: '기초', chapters: java1 },
      { title: '논리와 흐름', chapters: java2 },
      { title: '객체 지향 프로그래밍', chapters: java3 },
    ],
    nextSectionTitle: null,
  },
  html: {
    code: 'html',
    title: 'HTML',
    sections: [
      { title: '기초', chapters: html1 },
      { title: 'CSS로 스타일링하기', chapters: html2 },
      { title: 'CSS 마스터', chapters: html3 },
      { title: '실전 프론트엔드', chapters: html4 },
      { title: 'JavaScript 실전', chapters: html5 },
    ],
    nextSectionTitle: null,
  },
};

// 섹션 구분 없이 챕터를 한 줄로 펼칩니다. 레슨 id는 전체 챕터 순번을 기준으로 만듭니다.
function flatChapters(curriculum) {
  const result = [];
  curriculum.sections.forEach((section, si) => {
    section.chapters.forEach((chapter, ci) => {
      result.push({
        ...chapter,
        section: si + 1,
        sectionTitle: section.title,
        sectionChapter: ci + 1,
        sectionStart: ci === 0,
      });
    });
  });
  return result;
}

export function lessonId(code, chapterIndex, lessonIndex) {
  return `${code}-${chapterIndex + 1}-${lessonIndex + 1}`;
}

function buildChapters(curriculum) {
  return flatChapters(curriculum).map((chapter, ci) => ({
    title: chapter.title,
    section: chapter.section,
    sectionTitle: chapter.sectionTitle,
    sectionChapter: chapter.sectionChapter,
    sectionStart: chapter.sectionStart,
    rows: [
      ...chapter.lessons.map((lesson, li) => {
        const id = lessonId(curriculum.code, ci, li);
        return { main: { id, title: lesson.title, type: 'all' } };
      }),
      { main: { id: `${curriculum.code}-${ci + 1}-trophy`, title: '챕터 완료', type: 'trophy' } },
    ],
  }));
}

// 등급에 따라 보이는 섹션 범위와 시작 섹션을 정합니다.
// 초급은 첫 섹션만, 중급과 고급은 낮은 섹션을 다시 볼 수 있습니다.
export function levelRange(sectionCount, level) {
  const middle = Math.min(sectionCount, Math.max(2, Math.ceil(sectionCount * 0.6)));
  if (level === 'beginner') return { cap: 1, start: 0 };
  if (level === 'intermediate') return { cap: middle, start: Math.min(1, sectionCount - 1) };
  return { cap: sectionCount, start: Math.min(middle, sectionCount - 1) };
}

export function journeyFor(language = 'html', level = null, completedIds = []) {
  const curriculum = languageCurricula[language] || languageCurricula.html;
  const sectionCount = curriculum.sections.length;
  const range = level ? levelRange(sectionCount, level) : { cap: sectionCount, start: 0 };
  const { start } = range;
  const everyChapter = buildChapters(curriculum);
  // 등급이 정한 범위의 마지막 섹션을 모두 풀면 다음 섹션이 자동으로 열립니다.
  const doneIds = new Set(completedIds);
  everyChapter
    .filter((chapter) => chapter.section - 1 < start)
    .forEach((chapter) => chapter.rows.forEach((row) => doneIds.add(row.main.id)));
  let cap = range.cap;
  while (
    cap < sectionCount &&
    everyChapter
      .filter((chapter) => chapter.section <= cap)
      .every((chapter) => chapter.rows.every((row) => doneIds.has(row.main.id)))
  ) {
    cap += 1;
  }
  const chapters = everyChapter.filter((chapter) => chapter.section <= cap);
  const allMainLessons = chapters.flatMap((chapter) => chapter.rows.map((row) => row.main));
  const earlier = chapters.filter((chapter) => chapter.section - 1 < start);
  const startChapter = chapters.find((chapter) => chapter.section - 1 === start);
  return {
    language,
    level,
    title: curriculum.title + ' ' + curriculum.sections[start].title,
    nextSectionTitle: curriculum.nextSectionTitle,
    hiddenSections: sectionCount - cap,
    chapterData: chapters,
    allMainLessons,
    allNodes: chapters.flatMap((chapter) =>
      chapter.rows.flatMap((row) => [row.main, row.side].filter(Boolean)),
    ),
    initialCompleted: [],
    preCompleted: earlier.flatMap((chapter) => chapter.rows.map((row) => row.main.id)),
    defaultActive: startChapter?.rows[0]?.main.id ?? allMainLessons[0]?.id,
  };
}

export function chapterTitleFor(lessonId, journey) {
  return (
    journey.chapterData.find((chapter) =>
      chapter.rows.some((row) => row.main.id === lessonId || row.side?.id === lessonId),
    )?.title ?? journey.title
  );
}

// 챕터 완료(트로피) 노드에서 보여 줄 챕터 복습용 레슨 정보를 위해 챕터 레슨을 노출합니다.
export function chapterLessonsFor(language, chapterIndex) {
  const curriculum = languageCurricula[language];
  return curriculum ? (flatChapters(curriculum)[chapterIndex]?.lessons ?? []) : [];
}

export function languageContentFor(language) {
  const curriculum = languageCurricula[language];
  if (!curriculum) return {};
  const result = {};
  flatChapters(curriculum).forEach((chapter, ci) => {
    chapter.lessons.forEach((lesson, li) => {
      result[lessonId(curriculum.code, ci, li)] = lesson;
    });
    // 트로피 노드: 챕터의 마지막 레슨 내용으로 복습합니다.
    const last = chapter.lessons[chapter.lessons.length - 1];
    if (last) result[`${curriculum.code}-${ci + 1}-trophy`] = last;
  });
  return result;
}
