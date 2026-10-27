import { preChallengeQuestionFor } from './challenges.js'

const languageProblems = {
  javascript: {
    mcq: {
      title: 'JavaScript로 출력하기',
      description: '"Hello, Coddy!"를 콘솔에 출력하는 코드를 고르세요.',
      content: {
        choices: [
          'print("Hello, Coddy!");',
          'console.log("Hello, Coddy!");',
          'System.out.println("Hello, Coddy!");',
        ],
        answer: 1,
        explanation: 'JavaScript에서는 console.log()로 콘솔에 값을 출력합니다.',
      },
    },
    blank: {
      title: '변수 출력 코드 완성하기',
      description: 'greeting 변수의 값을 콘솔에 출력하도록 빈칸을 채우세요.',
      content: {
        template: 'const greeting = "Hello, Coddy!";\nconsole.{{1}}(greeting);',
        blanks: [{ no: 1, answers: ['log'], hint: '콘솔 출력 메서드' }],
        explanation: 'console.log()는 콘솔에 문자열이나 변수 값을 출력합니다.',
      },
    },
    parsons: {
      title: 'JavaScript 코드 순서 맞추기',
      description: '메시지를 변수에 저장한 뒤 출력하도록 코드 블록을 정렬하세요.',
      content: {
        fragments: ['console.log(message);', 'const message = "Hello, Coddy!";'],
        answer_order: [1, 0],
        explanation: '변수에 값을 저장한 다음 그 변수를 출력합니다.',
      },
    },
    short: {
      title: 'JavaScript 변수 키워드',
      description: '값을 다시 할당하지 않는 블록 범위 변수를 선언할 때 쓰는 키워드는?',
      content: {
        answer: 'const',
        explanation: 'const는 블록 범위의 상수를 선언하며 선언 후 다른 값을 다시 할당할 수 없습니다.',
      },
    },
  },
  python: {
    mcq: {
      title: 'Python으로 출력하기',
      description: '"Hello, Coddy!"를 화면에 출력하는 코드를 고르세요.',
      content: {
        choices: [
          'echo("Hello, Coddy!")',
          'print("Hello, Coddy!")',
          'console.log("Hello, Coddy!")',
        ],
        answer: 1,
        explanation: 'Python에서는 print() 함수로 화면에 값을 출력합니다.',
      },
    },
    blank: {
      title: '변수 출력 코드 완성하기',
      description: 'name 변수에 저장된 값을 출력하도록 빈칸을 채우세요.',
      content: {
        template: 'name = "Coddy"\nprint({{1}})',
        blanks: [{ no: 1, answers: ['name'], hint: '출력할 변수 이름' }],
        explanation: 'print() 괄호 안에 변수 이름을 넣으면 변수의 값이 출력됩니다.',
      },
    },
    parsons: {
      title: 'Python 코드 순서 맞추기',
      description: '메시지를 변수에 저장한 뒤 출력하도록 코드 블록을 정렬하세요.',
      content: {
        fragments: ['print(message)', 'message = "Hello, Coddy!"'],
        answer_order: [1, 0],
        explanation: '변수에 값을 저장한 다음 print()로 출력합니다.',
      },
    },
    short: {
      title: 'Python 주석 기호',
      description: 'Python에서 한 줄 주석을 시작할 때 사용하는 기호는?',
      content: {
        answer: '#',
        explanation: 'Python에서는 # 뒤에 한 줄 주석을 작성합니다.',
      },
    },
  },
  java: {
    mcq: {
      title: 'Java로 출력하기',
      description: '"Hello, Coddy!"를 콘솔에 출력하는 코드를 고르세요.',
      content: {
        choices: [
          'print("Hello, Coddy!");',
          'System.out.println("Hello, Coddy!");',
          'console.log("Hello, Coddy!");',
        ],
        answer: 1,
        explanation: 'Java에서는 System.out.println()으로 값을 출력하고 줄을 바꿉니다.',
      },
    },
    blank: {
      title: '출력 메서드 완성하기',
      description: '문자열을 출력하는 Java 메서드 이름을 빈칸에 입력하세요.',
      content: {
        template: 'System.out.{{1}}("Hello, Coddy!");',
        blanks: [{ no: 1, answers: ['println'], hint: '출력 후 줄을 바꾸는 메서드' }],
        explanation: 'System.out.println()은 문자열을 출력하고 다음 줄로 이동합니다.',
      },
    },
    parsons: {
      title: 'Java 코드 순서 맞추기',
      description: 'main 메서드가 포함된 Java 프로그램을 올바른 순서로 정렬하세요.',
      content: {
        fragments: [
          '    }',
          '        System.out.println("Hello, Coddy!");',
          '}',
          'class Main {',
          '    public static void main(String[] args) {',
        ],
        answer_order: [3, 4, 1, 0, 2],
        explanation: 'Java 코드는 클래스 안에 main 메서드를 만들고, 메서드 본문에서 출력합니다.',
      },
    },
    short: {
      title: 'Java 정수 자료형',
      description: 'Java에서 정수 값을 저장할 때 사용하는 기본 자료형 키워드는?',
      content: {
        answer: 'int',
        explanation: 'int는 Java의 기본 정수 자료형입니다.',
      },
    },
  },
}

export function examplePracticeProblem(type, lesson, language = 'html') {
  const shared = { id: `example-${language}-${type}-${lesson.id}`, type, reward: 0, language }

  const languageProblem = languageProblems[language]?.[type]
  if (languageProblem) return { ...shared, ...languageProblem }

  if (type === 'mcq') {
    const question = preChallengeQuestionFor(lesson)
    return {
      ...shared,
      title: 'HTML 태그 고르기',
      description: question.prompt,
      content: {
        choices: question.choices,
        answer: question.choices.indexOf(question.correct),
        explanation: question.explanation,
      },
    }
  }

  if (type === 'blank') {
    return {
      ...shared,
      title: '단락 태그 완성하기',
      description: '빈칸에 태그 이름을 입력해 문단 요소를 완성하세요.',
      content: {
        template: '<{{1}}>Welcome to our pizza restaurant!</{{2}}>',
        blanks: [
          { no: 1, answers: ['p'], hint: '여는 태그' },
          { no: 2, answers: ['p'], hint: '닫는 태그' },
        ],
      },
    }
  }

  if (type === 'parsons') {
    return {
      ...shared,
      title: 'HTML 문서 순서 맞추기',
      description: '코드 조각을 올바른 순서로 정렬하세요.',
      content: {
        fragments: ['</html>', '    <p>Hello!</p>', '<html>', '  </body>', '  <body>'],
        answer_order: [2, 4, 1, 3, 0],
      },
    }
  }

  return {
    ...shared,
    title: '단답형으로 답하기',
    description: 'HTML에서 단락을 만드는 태그 이름을 입력하세요.',
    content: { answer: 'p' },
  }
}

export function gradeExamplePractice(type, problem, answer) {
  let correct
  let expected

  if (type === 'mcq') {
    expected = problem.content.answer
    correct = answer === expected
  } else if (type === 'blank') {
    expected = problem.content.blanks
    correct = expected.every(({ no, answers }) => answers.includes(String(answer?.[no] ?? '').trim()))
  } else if (type === 'parsons') {
    expected = problem.content.answer_order
    correct = Array.isArray(answer) && answer.length === expected.length &&
      answer.every((value, index) => value === expected[index])
  } else {
    expected = problem.content.answer
    correct = String(answer ?? '').trim().toLowerCase() === expected.toLowerCase()
  }

  return {
    correct,
    answer: correct ? undefined : expected,
    explanation: correct ? problem.content.explanation ?? '' : '',
    results: [],
  }
}
