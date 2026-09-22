export const dummyIncorrectSummary = [
  { value: '18', label: '누적 오답', description: '다시 확인할 문제가 있어요.' },
  { value: '4', label: '이번 주 오답', description: '지난주보다 2문제 줄었어요.' },
  { value: '3', label: '취약 개념', description: '집중 복습이 필요한 개념이에요.' },
];

export const dummyWeakConcepts = [
  { title: '반복문 종료 조건', count: 4, progress: 82 },
  { title: '배열 순회', count: 3, progress: 64 },
  { title: '함수 반환값', count: 2, progress: 46 },
];

export const dummyIncorrectProblems = [
  { id: 1, type: '객관식', title: '반복문이 종료되는 시점의 값을 확인해보세요.', unit: '조건문과 반복문', wrongAnswer: '5', correctAnswer: '6', date: '오늘' },
  { id: 2, type: '빈칸 채우기', title: '짝수만 더하도록 반복 범위와 조건을 작성해보세요.', unit: '반복문', wrongAnswer: 'total += 1', correctAnswer: 'total += i', date: '어제' },
  { id: 3, type: '코드 작성', title: '배열에서 짝수만 더하는 함수를 완성해보세요.', unit: '함수와 배열', wrongAnswer: '테스트 실패', correctAnswer: '테스트 통과', date: '9월 20일' },
  { id: 4, type: '객관식', title: '딕셔너리의 키와 값을 순회하는 방법을 골라보세요.', unit: '자료형', wrongAnswer: 'keys()', correctAnswer: 'items()', date: '9월 18일' },
];
