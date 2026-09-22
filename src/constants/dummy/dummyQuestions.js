export const dummyMultipleChoiceQuestion = {
  current: 3,
  total: 10,
  elapsedTime: '00 : 00',
  text: '다음 파이썬 코드의 실행 결과로 옳은 것은?',
  hint: '반복문이 종료되는 시점에서 j의 값을 확인해보세요.',
  explanation: 'sum이 6이 되는 순간 반복문이 종료되므로 j의 값도 6입니다.',
  code: `sum = 0
j = 0

for i in range(1, 100):
    sum += 1
    j += 1
    if sum == 6:
        break

print(j)`,
  choices: ['4', '5', '6', '7'],
  answer: 2,
};

export const dummyCodeFillQuestion = {
  current: 4,
  total: 10,
  elapsedTime: '00 : 00',
  text: '다음은 1부터 100까지의 자연수 중 짝수만을 더하여 출력하는 파이썬 코드입니다.\n코드의 빈칸을 올바르게 채워보세요.',
  hint: '반복 범위, 짝수 판별 조건, 누적 연산의 역할을 순서대로 확인해보세요.',
  explanation: '반복 범위, 짝수 판별 조건, 누적 연산을 순서대로 채우면 됩니다.',
  codeParts: ['total = 0\n\nfor ', ':\n    if ', ':\n        ', '\n\nprint(total)'],
  answers: ['i in range(1, 101)', 'i % 2 == 0', 'total += i'],
};

export const dummyCodeAssemblyQuestion = {
  current: 5,
  total: 10,
  elapsedTime: '00 : 00',
  text: '다음은 1부터 100까지의 자연수 중 짝수만을 더하여 출력하는 파이썬 코드입니다.\n코드의 빈칸을 올바르게 채워보세요.',
  hint: '초기화한 다음 반복과 조건을 작성하고, 누적한 뒤 출력하세요.',
  explanation: '초기화, 반복, 조건, 누적, 출력 순서로 코드를 배치하면 됩니다.',
  codeBlocks: ['print(total)', 'if i % 2 == 0:', 'total = 0', 'total += 1', 'for i in range(1, 101)'],
  answer: ['total = 0', 'for i in range(1, 101)', 'if i % 2 == 0:', 'total += 1', 'print(total)'],
};

export const dummySubjectiveCodeQuestion = {
  current: 6,
  total: 10,
  elapsedTime: '00 : 00',
  text: '숫자 배열에서 짝수만 더한 값을 반환하는 solve 함수를 작성하세요.',
  requirements: ['함수 이름은 solve로 작성하세요.', '입력 배열의 값은 변경하지 마세요.', '짝수만 더한 숫자를 반환하세요.'],
  hint: 'for...of로 배열을 순회하며 value % 2 === 0인 경우만 더해보세요.',
  explanation: '배열을 순회하며 짝수인지 확인한 뒤 누적한 값을 반환하면 됩니다.',
  language: 'javascript',
  starterCode: `function solve(numbers) {

}`,
  testInput: [2, 3, 4, 7, 8],
  expectedOutput: 14,
};

export const dummySpaghettiCodeQuestion = {
  current: 7,
  total: 10,
  elapsedTime: '00 : 00',
  text: '아래 코드는 점수 배열의 평균을 반환하지만 읽기 어렵습니다. 동작을 유지하면서 읽기 좋은 코드로 바꿔보세요.',
  requirements: ['함수 이름 solve와 반환값은 유지하세요.', '의미를 알 수 있는 변수 이름을 사용하세요.', '빈 배열은 0을 반환하도록 처리하세요.'],
  hint: '합계를 저장하는 변수와 반복문 인덱스의 이름을 역할에 맞게 바꿔보세요.',
  explanation: '빈 배열을 먼저 처리하고 total, score처럼 역할이 드러나는 이름을 사용하면 코드의 의도가 분명해집니다.',
  language: 'javascript',
  originalCode: `function solve(a) {
  let x = 0;
  for (let i = 0; i < a.length; i += 1) {
    x = x + a[i];
  }
  return x / a.length;
}`,
  starterCode: `function solve(scores) {
  // 동작은 유지하고, 읽기 좋은 코드로 고쳐보세요.
}`,
  testInput: [60, 80, 100],
  expectedOutput: 80,
};
