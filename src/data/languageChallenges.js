import { languageContentFor } from './curricula.js';

const cache = {};

function contentFor(language) {
  return (cache[language] ??= languageContentFor(language));
}

export const languageStarterCode = {
  python: '# 여기에 Python 코드를 작성하세요',
  javascript: '// 여기에 JavaScript 코드를 작성하세요',
  java: 'class Main {\n  public static void main(String[] args) {\n    // 여기에 Java 코드를 작성하세요\n  }\n}',
};

export function languageChallengeFor(language, lesson) {
  const lessonKey = lesson.base ?? lesson.id;
  const source = contentFor(language)[lessonKey];
  if (!source) return null;
  const challenge = {
    instruction: source.instruction,
    theory: source.theory,
    example: source.example,
    checks: source.checks,
  };
  return {
    ...challenge,
    checks: challenge.checks.map((expected, index) => ({
      label: `코드 조건 ${index + 1}`,
      expected,
      contains: expected,
    })),
  };
}
