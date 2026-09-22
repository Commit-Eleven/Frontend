export const dummyIncorrectSummary = [
  { value: '18', label: '누적 오답', description: '복습할 문제가 남아 있어요.', icon: '✕' },
  { value: '4', label: '오늘의 복습', description: '15분이면 모두 풀 수 있어요.', icon: '↻' },
  { value: '78%', label: '최근 정답률', description: '지난 학습보다 6% 올랐어요.', icon: '↗' },
];

export const dummyWeakConcepts = [
  { title: '반복문 종료 조건', count: 4, progress: 82, unit: '조건문과 반복문' },
  { title: '배열 순회', count: 3, progress: 64, unit: '함수와 배열' },
  { title: '함수 반환값', count: 2, progress: 46, unit: '함수' },
];

export const dummyIncorrectProblems = [
  {
    id: 1,
    type: '객관식',
    title: '반복문이 종료되는 시점의 값을 확인해보세요.',
    unit: '조건문과 반복문',
    wrongAnswer: '5',
    correctAnswer: '6',
    date: '오늘',
    attempts: 2,
  },
  {
    id: 2,
    type: '빈칸 채우기',
    title: '짝수만 더하도록 반복 범위와 조건을 작성해보세요.',
    unit: '반복문',
    wrongAnswer: 'total += 1',
    correctAnswer: 'total += i',
    date: '어제',
    attempts: 1,
  },
  {
    id: 3,
    type: '코드 작성',
    title: '배열에서 짝수만 더하는 함수를 완성해보세요.',
    unit: '함수와 배열',
    wrongAnswer: '테스트 실패',
    correctAnswer: '테스트 통과',
    date: '9월 20일',
    attempts: 1,
  },
  {
    id: 4,
    type: '객관식',
    title: '딕셔너리의 키와 값을 순회하는 방법을 골라보세요.',
    unit: '자료형',
    wrongAnswer: 'keys()',
    correctAnswer: 'items()',
    date: '9월 18일',
    attempts: 3,
  },
];
