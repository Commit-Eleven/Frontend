const content = {
  python: {
    'python-output': {
      instruction: 'print()를 사용해 "Hello, Coddy!"를 한 줄로 출력하세요.',
      theory: 'Python의 print() 함수는 괄호 안의 값이나 문자열을 화면에 출력합니다.',
      example: 'print("Hello, Coddy!")',
      checks: ['print(', 'Hello, Coddy!'],
    },
    'python-comments': {
      instruction: '한 줄 주석을 하나 작성하고, 그 아래에 print()를 작성하세요.',
      theory: 'Python에서 # 뒤에 작성한 내용은 실행되지 않는 한 줄 주석입니다.',
      example: '# 인사말 출력하기\nprint("Hello, Coddy!")',
      checks: ['#', 'print('],
    },
    'python-variables': {
      instruction: 'name 변수에 "Coddy"를 저장하고 print()로 출력하세요.',
      theory: 'Python 변수는 이름 왼쪽에 두고 = 기호 오른쪽에 저장할 값을 씁니다.',
      example: 'name = "Coddy"\nprint(name)',
      checks: ['name =', 'print(name)'],
    },
    'python-strings': {
      instruction: '두 문자열을 이어 greeting 변수에 저장하고 출력하세요.',
      theory: '문자열은 따옴표로 감싸며 + 연산자로 이어 붙일 수 있습니다.',
      example: 'greeting = "Hello, " + "Coddy!"\nprint(greeting)',
      checks: ['greeting =', 'print(greeting)'],
    },
    'python-types': {
      instruction: '정수 12를 age 변수에 저장하고 type()으로 자료형을 출력하세요.',
      theory: 'Python은 값에서 자료형을 정합니다. type()으로 값의 자료형을 확인할 수 있습니다.',
      example: 'age = 12\nprint(type(age))',
      checks: ['age =', 'type('],
    },
    'python-comparisons': {
      instruction: '비교 연산자 >를 사용해 10이 5보다 큰지 출력하세요.',
      theory: '비교 연산자는 두 값을 비교해 True 또는 False를 만듭니다.',
      example: 'print(10 > 5)',
      checks: ['print(', '>'],
    },
    'python-conditionals': {
      instruction: 'age가 18 이상일 때 "Adult"를 출력하는 if 문을 작성하세요.',
      theory: 'if 다음에 조건을 쓰고 콜론을 붙입니다. 조건에 해당하는 코드는 들여쓰기합니다.',
      example: 'age = 18\nif age >= 18:\n    print("Adult")',
      checks: ['if ', ':', 'print('],
    },
    'python-loops': {
      instruction: 'for 문과 range()를 사용해 1부터 3까지 출력하세요.',
      theory: 'for 문은 반복 가능한 값을 하나씩 꺼내 같은 코드를 반복합니다.',
      example: 'for number in range(1, 4):\n    print(number)',
      checks: ['for ', 'range(', 'print('],
    },
    'python-functions': {
      instruction: '이름을 받아 인사말을 반환하는 greet 함수를 작성하세요.',
      theory: 'def로 함수를 정의하고, return으로 함수의 결과를 돌려줄 수 있습니다.',
      example: 'def greet(name):\n    return "Hello, " + name',
      checks: ['def greet(', 'return '],
    },
    'python-lists': {
      instruction: '색상 두 개가 담긴 리스트를 만들고 첫 번째 항목을 출력하세요.',
      theory: '리스트는 여러 값을 순서대로 담습니다. 첫 항목의 인덱스는 0입니다.',
      example: 'colors = ["red", "blue"]\nprint(colors[0])',
      checks: ['[', 'print(', '[0]'],
    },
    'python-dictionaries': {
      instruction: 'name 키에 "Coddy"를 담은 딕셔너리를 만들고 값을 출력하세요.',
      theory: '딕셔너리는 키와 값의 쌍을 저장하며, 키로 값을 찾습니다.',
      example: 'student = {"name": "Coddy"}\nprint(student["name"])',
      checks: ['{', '"name"', 'print('],
    },
    'python-review': {
      instruction: '숫자를 두 배로 만드는 double 함수를 정의하세요.',
      theory: '함수, 매개변수, 반환 값을 조합하면 코드를 재사용할 수 있습니다.',
      example: 'def double(number):\n    return number * 2',
      checks: ['def double(', 'return ', '* 2'],
    },
  },
  javascript: {
    'javascript-output': {
      instruction: 'console.log()를 사용해 "Hello, Coddy!"를 출력하세요.',
      theory: 'JavaScript는 console.log()로 콘솔에 값이나 문자열을 출력합니다.',
      example: 'console.log("Hello, Coddy!");',
      checks: ['console.log(', 'Hello, Coddy!'],
    },
    'javascript-comments': {
      instruction: '한 줄 주석을 작성하고, 그 아래에 console.log()를 작성하세요.',
      theory: '// 뒤에 작성한 내용은 JavaScript에서 실행되지 않는 한 줄 주석입니다.',
      example: '// 인사말 출력하기\nconsole.log("Hello, Coddy!");',
      checks: ['//', 'console.log('],
    },
    'javascript-variables': {
      instruction: 'const로 name 변수에 "Coddy"를 저장하고 출력하세요.',
      theory: 'const와 let으로 블록 범위 변수를 선언합니다. 바뀌지 않을 값에는 const를 씁니다.',
      example: 'const name = "Coddy";\nconsole.log(name);',
      checks: ['const name', 'console.log(name)'],
    },
    'javascript-strings': {
      instruction: '두 문자열을 이어 greeting 변수에 저장하고 출력하세요.',
      theory: 'JavaScript 문자열은 따옴표나 백틱으로 만들고 + 연산자로 이어 붙일 수 있습니다.',
      example: 'const greeting = "Hello, " + "Coddy!";\nconsole.log(greeting);',
      checks: ['greeting =', '+', 'console.log('],
    },
    'javascript-types': {
      instruction: 'age 변수에 12를 저장하고 typeof로 자료형을 출력하세요.',
      theory: 'typeof 연산자는 값의 자료형을 문자열로 반환합니다.',
      example: 'const age = 12;\nconsole.log(typeof age);',
      checks: ['age =', 'typeof '],
    },
    'javascript-comparisons': {
      instruction: '비교 연산자 >를 사용해 10이 5보다 큰지 출력하세요.',
      theory: '비교 연산자는 조건을 비교해 true 또는 false를 반환합니다.',
      example: 'console.log(10 > 5);',
      checks: ['console.log(', '>'],
    },
    'javascript-conditionals': {
      instruction: 'age가 18 이상일 때 "Adult"를 출력하는 if 문을 작성하세요.',
      theory: 'if의 조건이 true이면 중괄호 안의 코드가 실행됩니다.',
      example: 'const age = 18;\nif (age >= 18) {\n  console.log("Adult");\n}',
      checks: ['if (', '>=', 'console.log('],
    },
    'javascript-loops': {
      instruction: 'for 문을 사용해 1부터 3까지 출력하세요.',
      theory: 'for 문은 초기값, 반복 조건, 증감식을 지정해 코드를 반복합니다.',
      example: 'for (let number = 1; number <= 3; number++) {\n  console.log(number);\n}',
      checks: ['for (', 'number++', 'console.log('],
    },
    'javascript-functions': {
      instruction: '이름을 받아 인사말을 반환하는 greet 함수를 작성하세요.',
      theory: 'function으로 함수를 만들고 return으로 결과를 반환할 수 있습니다.',
      example: 'function greet(name) {\n  return "Hello, " + name;\n}',
      checks: ['function greet(', 'return '],
    },
    'javascript-arrays': {
      instruction: '색상 두 개가 담긴 배열을 만들고 첫 번째 항목을 출력하세요.',
      theory: '배열은 여러 값을 순서대로 담습니다. 첫 항목의 인덱스는 0입니다.',
      example: 'const colors = ["red", "blue"];\nconsole.log(colors[0]);',
      checks: ['[', 'console.log(', '[0]'],
    },
    'javascript-objects': {
      instruction: 'name 속성이 "Coddy"인 객체를 만들고 값을 출력하세요.',
      theory: '객체는 중괄호 안에 속성과 값을 키-값 형태로 저장합니다.',
      example: 'const student = { name: "Coddy" };\nconsole.log(student.name);',
      checks: ['{', 'name:', 'console.log('],
    },
    'javascript-review': {
      instruction: '숫자를 두 배로 반환하는 double 함수를 작성하세요.',
      theory: '함수와 매개변수, 반환 값을 함께 사용해 반복 가능한 동작을 만듭니다.',
      example: 'function double(number) {\n  return number * 2;\n}',
      checks: ['function double(', 'return ', '* 2'],
    },
  },
  java: {
    'java-output': {
      instruction: 'main 메서드 안에서 "Hello, Coddy!"를 출력하세요.',
      theory: 'Java의 System.out.println()은 콘솔에 값을 출력하고 다음 줄로 이동합니다.',
      example:
        'class Main {\n  public static void main(String[] args) {\n    System.out.println("Hello, Coddy!");\n  }\n}',
      checks: ['class Main', 'public static void main', 'System.out.println('],
    },
    'java-comments': {
      instruction: 'main 메서드 안에 한 줄 주석과 출력문을 작성하세요.',
      theory: 'Java에서 // 뒤에 작성한 내용은 실행되지 않는 한 줄 주석입니다.',
      example:
        'class Main {\n  public static void main(String[] args) {\n    // 인사말 출력하기\n    System.out.println("Hello, Coddy!");\n  }\n}',
      checks: ['//', 'public static void main', 'System.out.println('],
    },
    'java-variables': {
      instruction: 'int 자료형 변수 age에 12를 저장하고 출력하세요.',
      theory: 'Java 변수는 자료형과 이름을 먼저 선언한 뒤 값을 저장합니다.',
      example:
        'class Main {\n  public static void main(String[] args) {\n    int age = 12;\n    System.out.println(age);\n  }\n}',
      checks: ['int age', 'System.out.println(age)'],
    },
    'java-strings': {
      instruction: 'String 변수 greeting에 인사말을 저장하고 출력하세요.',
      theory: '문자열은 String 자료형으로 저장하며 + 연산자로 연결할 수 있습니다.',
      example:
        'class Main {\n  public static void main(String[] args) {\n    String greeting = "Hello, Coddy!";\n    System.out.println(greeting);\n  }\n}',
      checks: ['String greeting', 'System.out.println(greeting)'],
    },
    'java-operators': {
      instruction: 'main 메서드 안에서 10이 5보다 큰지 비교해 출력하세요.',
      theory: 'Java의 비교 연산자는 두 값을 비교해 boolean 결과를 만듭니다.',
      example:
        'class Main {\n  public static void main(String[] args) {\n    System.out.println(10 > 5);\n  }\n}',
      checks: ['public static void main', 'System.out.println(', '>'],
    },
    'java-comparisons': {
      instruction: 'score가 60 이상인지 비교하는 boolean 식을 출력하세요.',
      theory: '==, !=, <, >, <=, >= 연산자로 값을 비교할 수 있습니다.',
      example:
        'class Main {\n  public static void main(String[] args) {\n    int score = 75;\n    System.out.println(score >= 60);\n  }\n}',
      checks: ['score >= 60', 'System.out.println('],
    },
    'java-conditionals': {
      instruction: 'age가 18 이상일 때 "Adult"를 출력하는 if 문을 작성하세요.',
      theory: 'if 조건이 true일 때 중괄호 안의 코드가 실행됩니다.',
      example:
        'class Main {\n  public static void main(String[] args) {\n    int age = 18;\n    if (age >= 18) {\n      System.out.println("Adult");\n    }\n  }\n}',
      checks: ['if (', '>=', 'System.out.println('],
    },
    'java-loops': {
      instruction: 'for 문을 사용해 1부터 3까지 출력하세요.',
      theory: 'for 문은 초기값, 반복 조건, 증감식을 사용해 코드를 반복합니다.',
      example:
        'class Main {\n  public static void main(String[] args) {\n    for (int number = 1; number <= 3; number++) {\n      System.out.println(number);\n    }\n  }\n}',
      checks: ['for (', 'number++', 'System.out.println('],
    },
    'java-methods': {
      instruction: '정수를 받아 두 배로 반환하는 doubleNumber 메서드를 작성하세요.',
      theory: '메서드는 이름, 매개변수, 반환 자료형을 정해 재사용 가능한 동작을 정의합니다.',
      example: 'static int doubleNumber(int number) {\n  return number * 2;\n}',
      checks: ['static int doubleNumber(', 'return ', '* 2'],
    },
    'java-arrays': {
      instruction: '문자열 배열을 만들고 첫 번째 값을 출력하세요.',
      theory: '배열은 같은 자료형의 값을 순서대로 저장하며 인덱스는 0부터 시작합니다.',
      example:
        'class Main {\n  public static void main(String[] args) {\n    String[] colors = {"red", "blue"};\n    System.out.println(colors[0]);\n  }\n}',
      checks: ['String[]', '{', 'System.out.println(', '[0]'],
    },
    'java-classes': {
      instruction: 'name 필드와 이름을 출력하는 메서드가 있는 Student 클래스를 작성하세요.',
      theory: '클래스는 필드와 메서드를 묶어 객체의 구조와 동작을 정의합니다.',
      example: 'class Student {\n  String name;\n\n  void introduce() {\n    System.out.println(name);\n  }\n}',
      checks: ['class Student', 'String name', 'void introduce('],
    },
    'java-review': {
      instruction: '정수를 받아 두 배로 반환하는 메서드를 작성하세요.',
      theory: '변수와 메서드, 반환 값을 조합해 작은 프로그램을 만들 수 있습니다.',
      example: 'static int doubleNumber(int number) {\n  return number * 2;\n}',
      checks: ['static int doubleNumber(', 'return ', '* 2'],
    },
  },
};

export const languageStarterCode = {
  python: '# 여기에 Python 코드를 작성하세요',
  javascript: '// 여기에 JavaScript 코드를 작성하세요',
  java: 'class Main {\n  public static void main(String[] args) {\n    // 여기에 Java 코드를 작성하세요\n  }\n}',
};

export function languageChallengeFor(language, lesson) {
  const challenge = content[language]?.[lesson.id];
  if (!challenge) return null;
  return {
    ...challenge,
    checks: challenge.checks.map((expected, index) => ({
      label: `코드 조건 ${index + 1}`,
      expected,
      contains: expected,
    })),
  };
}
