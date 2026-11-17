import { L } from './lesson.js';

// 섹션 4: 객체 지향 프로그래밍
export default [
  { title: '객체와 this 키워드', lessons: [
    L('객체 빠른 복습', 'M', 'name과 age가 있는 객체를 만들고 출력하세요.', '객체는 { 키: 값 } 형태로 관련 데이터를 묶습니다.', 'const user = { name: "Kim", age: 20 };\nconsole.log(user.name);', 'const user = {', 'user.name'),
    L('객체에 메서드 추가하기', 'M', '객체에 인사 메서드 greet를 추가하세요.', '객체의 값으로 함수를 넣으면 메서드가 됩니다.', 'const user = {\n  name: "Kim",\n  greet() {\n    console.log("Hi");\n  },\n};\nuser.greet();', 'greet()', 'user.greet('),
    L('this 키워드 이해하기', 'M', '메서드 안에서 this.name을 출력하세요.', 'this는 메서드를 호출한 객체를 가리킵니다.', 'const user = {\n  name: "Kim",\n  greet() {\n    console.log(this.name);\n  },\n};', 'this.name'),
    L('생성자 함수', 'M', '이름을 받아 this에 저장하는 생성자 함수 Person을 만드세요.', '생성자 함수는 대문자로 시작하며 객체를 만드는 설계도 역할을 합니다.', 'function Person(name) {\n  this.name = name;\n}', 'function Person(', 'this.name = name'),
    L('new 키워드', 'M', 'new로 Person 객체를 만드세요.', 'new는 생성자를 호출해 새 객체를 만들고 this가 그 객체를 가리키게 합니다.', 'const p = new Person("Kim");\nconsole.log(p.name);', 'new Person('),
    L('요약 챌린지', 'C', 'Car 생성자 함수와 drive 메서드를 가진 객체를 만드세요.', '생성자와 메서드를 함께 사용합니다.', 'function Car(model) {\n  this.model = model;\n  this.drive = function () {\n    console.log(this.model);\n  };\n}', 'function Car(', 'this.drive'),
  ] },
  { title: '코드 구조화하기', lessons: [
    L('모듈이란 무엇인가요?', 'M', '모듈이 무엇인지 주석으로 설명하고 함수 하나를 정의하세요.', '모듈은 코드를 파일 단위로 나눠 재사용하는 방법입니다.', '// 모듈: 파일 단위로 나눈 재사용 가능한 코드\nfunction add(a, b) {\n  return a + b;\n}', '//', 'function add('),
    L('export로 내보내기', 'A', 'add 함수를 export로 내보내세요.', 'export를 붙이면 다른 파일에서 가져다 쓸 수 있습니다.', 'export function add(a, b) {\n  return a + b;\n}', 'export function add'),
    L('import로 가져오기', 'A', 'math.js에서 add를 import 하세요.', '{ 이름 } 형태로 필요한 것만 가져옵니다.', 'import { add } from "./math.js";', 'import { add } from'),
    L('기본 내보내기 vs. 이름 지정 내보내기', 'A', 'default export와 named export를 함께 사용하세요.', '파일당 default는 하나, named는 여러 개 가능합니다. default는 중괄호 없이 가져옵니다.', 'export default function main() {}\nexport const PI = 3.14;', 'export default', 'export const PI'),
  ] },
  { title: '클래스와 객체', lessons: [
    L('클래스란 무엇인가요?', 'A', '빈 클래스 Dog를 만드세요.', 'class는 객체를 만드는 설계도를 읽기 쉬운 문법으로 표현합니다.', 'class Dog {}', 'class Dog'),
    L('인스턴스 생성하기', 'A', 'constructor로 name을 받아 Dog 인스턴스를 만드세요.', 'constructor는 인스턴스가 만들어질 때 실행됩니다.', 'class Dog {\n  constructor(name) {\n    this.name = name;\n  }\n}\nconst d = new Dog("Rex");', 'constructor(', 'new Dog('),
    L('프로퍼티와 메서드', 'A', 'bark 메서드가 있는 Dog 클래스를 만드세요.', '클래스 본문에 메서드를 function 키워드 없이 적습니다.', 'class Dog {\n  bark() {\n    console.log("Woof");\n  }\n}\nnew Dog().bark();', 'bark()', 'new Dog()'),
    L('복습 챌린지', 'C', 'name과 age를 가진 Student 클래스와 소개 메서드를 만드세요.', '클래스의 속성과 메서드를 복습합니다.', 'class Student {\n  constructor(name, age) {\n    this.name = name;\n    this.age = age;\n  }\n  intro() {\n    return `${this.name} (${this.age})`;\n  }\n}', 'class Student', 'constructor(', 'intro()'),
  ] },
  { title: '메서드와 상태 관리', lessons: [
    L('상태를 변경하는 메서드', 'A', 'count를 1 늘리는 increment 메서드를 만드세요.', '메서드가 this의 속성을 바꾸면 객체의 상태가 변합니다.', 'class Counter {\n  count = 0;\n  increment() {\n    this.count++;\n  }\n}', 'increment()', 'this.count++'),
    L('메서드 체이닝 패턴', 'A', 'this를 반환해 메서드를 이어 호출할 수 있게 하세요.', '메서드가 this를 반환하면 c.add().add() 처럼 이어 쓸 수 있습니다.', 'class Counter {\n  count = 0;\n  add() {\n    this.count++;\n    return this;\n  }\n}\nnew Counter().add().add();', 'return this', '.add().add()'),
  ] },
  { title: '캡슐화와 접근', lessons: [
    L('캡슐화', 'A', '데이터를 메서드로만 다루는 클래스를 주석과 함께 만드세요.', '캡슐화는 데이터를 숨기고 정해진 메서드로만 다루게 하는 원칙입니다.', '// 잔액은 메서드로만 변경한다\nclass Wallet {}', '//', 'class Wallet'),
    L('Public & Private 클래스 필드', 'A', '#으로 시작하는 private 필드를 만드세요.', '#이름 필드는 클래스 밖에서 접근할 수 없습니다.', 'class Account {\n  #balance = 0;\n  name = "main";\n}', '#balance', 'name ='),
    L('Private 메서드', 'A', '#으로 시작하는 private 메서드를 만드세요.', '내부에서만 쓰는 메서드도 #로 숨길 수 있습니다.', 'class Account {\n  #log() {\n    console.log("done");\n  }\n  run() {\n    this.#log();\n  }\n}', '#log()', 'this.#log('),
    L('복습 챌린지', 'C', 'private 필드를 읽고 쓰는 메서드가 있는 클래스를 만드세요.', 'private 필드와 public 메서드를 함께 사용합니다.', 'class Safe {\n  #code = 0;\n  setCode(v) {\n    this.#code = v;\n  }\n  getCode() {\n    return this.#code;\n  }\n}', '#code', 'setCode(', 'getCode('),
  ] },
  { title: '프로젝트: 간단한 은행 계좌', lessons: [
    L('BankAccount 클래스', 'C', 'owner와 balance를 가진 BankAccount 클래스를 만드세요.', '계좌의 기본 구조를 만듭니다.', 'class BankAccount {\n  constructor(owner) {\n    this.owner = owner;\n    this.balance = 0;\n  }\n}', 'class BankAccount', 'this.balance'),
    L('입금과 출금', 'C', 'deposit과 withdraw 메서드를 만드세요. 잔액이 부족하면 출금하지 마세요.', '조건을 확인한 뒤 상태를 바꿉니다.', 'deposit(amount) {\n  this.balance += amount;\n}\nwithdraw(amount) {\n  if (amount <= this.balance) this.balance -= amount;\n}', 'deposit(', 'withdraw(', 'this.balance'),
    L('Private 필드로 잔액 관리', 'C', 'balance를 #balance로 바꾸고 getBalance를 만드세요.', '필드를 숨기고 메서드로만 노출합니다.', 'class BankAccount {\n  #balance = 0;\n  getBalance() {\n    return this.#balance;\n  }\n}', '#balance', 'getBalance('),
  ] },
  { title: '상속과 extends 키워드', lessons: [
    L('상속', 'A', '상속이 무엇인지 주석으로 설명하고 부모 클래스 Animal을 만드세요.', '상속은 기존 클래스의 속성과 메서드를 이어받아 재사용하는 방법입니다.', '// 부모의 기능을 이어받는다\nclass Animal {}', '//', 'class Animal'),
    L('"is-a" 관계', 'A', 'Dog is an Animal 관계를 주석으로 표현하고 클래스를 만드세요.', '상속은 "A는 B이다(is-a)"가 성립할 때 사용합니다.', '// Dog는 Animal이다\nclass Animal {}\nclass Dog extends Animal {}', '//', 'extends Animal'),
    L('extends 키워드', 'A', 'extends로 Dog가 Animal을 상속하게 하세요.', 'class 자식 extends 부모 형태입니다.', 'class Animal {\n  eat() {}\n}\nclass Dog extends Animal {}', 'class Dog extends Animal'),
    L('super() 메서드', 'A', '자식 constructor에서 super(name)을 호출하세요.', '자식 생성자는 this를 쓰기 전에 super()를 먼저 호출해야 합니다.', 'class Dog extends Animal {\n  constructor(name) {\n    super(name);\n  }\n}', 'super(name)'),
    L('속성과 메서드 상속하기', 'A', '자식 객체에서 부모 메서드를 호출하세요.', '자식 인스턴스는 부모의 메서드를 그대로 사용할 수 있습니다.', 'const d = new Dog("Rex");\nd.eat();', 'new Dog(', '.eat('),
    L('복습 챌린지', 'C', 'Vehicle을 상속하는 Car를 만들고 추가 속성을 넣으세요.', '상속과 super를 조합합니다.', 'class Vehicle {\n  constructor(wheels) {\n    this.wheels = wheels;\n  }\n}\nclass Car extends Vehicle {\n  constructor() {\n    super(4);\n    this.doors = 4;\n  }\n}', 'extends Vehicle', 'super(4)', 'this.doors'),
  ] },
  { title: 'OOP 코드 구조화하기', lessons: [
    L('클래스를 모듈로 구성하기', 'A', '클래스를 export 하고 다른 파일에서 import 하세요.', '클래스 하나를 파일 하나로 나누면 구조가 깔끔해집니다.', '// dog.js\nexport class Dog {}\n\n// main.js\nimport { Dog } from "./dog.js";', 'export class Dog', 'import { Dog }'),
  ] },
  { title: '정적 메서드와 프로퍼티', lessons: [
    L('클래스 레벨 vs 인스턴스 레벨', 'A', '인스턴스 메서드와 static 메서드를 함께 만드세요.', 'static 멤버는 객체가 아니라 클래스 자체에 속합니다.', 'class Util {\n  static hello() {\n    return "hi";\n  }\n  bye() {\n    return "bye";\n  }\n}', 'static hello(', 'bye()'),
    L('정적 프로퍼티', 'A', 'static count를 만들고 인스턴스가 생길 때마다 늘리세요.', '모든 인스턴스가 공유하는 값은 static 프로퍼티에 둡니다.', 'class Dog {\n  static count = 0;\n  constructor() {\n    Dog.count++;\n  }\n}', 'static count', 'Dog.count++'),
    L('정적 유틸리티 메서드', 'A', 'static 메서드 MathUtil.square를 만들고 호출하세요.', '객체 없이 쓰는 유틸 함수는 static으로 만듭니다.', 'class MathUtil {\n  static square(n) {\n    return n * n;\n  }\n}\nconsole.log(MathUtil.square(3));', 'static square(', 'MathUtil.square('),
    L('복습 챌린지', 'C', 'static으로 객체 생성 개수를 세는 클래스를 만드세요.', 'static 프로퍼티와 메서드를 복습합니다.', 'class Item {\n  static total = 0;\n  constructor() {\n    Item.total++;\n  }\n  static getTotal() {\n    return Item.total;\n  }\n}', 'static total', 'static getTotal('),
  ] },
  { title: '다형성', lessons: [
    L('다형성이란 무엇인가요?', 'A', '같은 메서드 이름 speak를 두 클래스가 각자 구현하게 하세요.', '다형성은 같은 이름의 메서드가 객체에 따라 다르게 동작하는 성질입니다.', 'class Dog { speak() { return "Woof"; } }\nclass Cat { speak() { return "Meow"; } }', 'class Dog', 'class Cat', 'speak()'),
    L('상속된 메서드 오버라이딩', 'A', '자식에서 부모의 speak를 다시 정의하세요.', '자식이 같은 이름의 메서드를 정의하면 부모 것을 덮어씁니다.', 'class Animal { speak() { return "..."; } }\nclass Dog extends Animal {\n  speak() {\n    return "Woof";\n  }\n}', 'extends Animal', 'speak()'),
    L('super 사용하기', 'A', '오버라이딩한 메서드에서 super.speak()를 호출하세요.', 'super.메서드()로 부모 구현을 함께 쓸 수 있습니다.', 'class Dog extends Animal {\n  speak() {\n    return super.speak() + " Woof";\n  }\n}', 'super.speak()'),
    L('복습 챌린지', 'C', 'Shape 배열의 area()를 반복 호출하세요.', '서로 다른 클래스를 같은 방식으로 호출하는 다형성입니다.', 'for (const s of shapes) {\n  console.log(s.area());\n}', 'for (const', '.area()'),
  ] },
  { title: '프로젝트: 도형 렌더러', lessons: [
    L('설정: Shape 클래스와 Export', 'C', 'export 되는 Shape 기본 클래스를 만드세요.', '모든 도형의 부모 클래스를 모듈로 만듭니다.', 'export class Shape {\n  area() {\n    return 0;\n  }\n}', 'export class Shape', 'area()'),
    L('Circle 클래스 상속', 'C', 'Shape를 상속하는 Circle을 만드세요.', 'radius를 받아 저장합니다.', 'export class Circle extends Shape {\n  constructor(radius) {\n    super();\n    this.radius = radius;\n  }\n}', 'extends Shape', 'super()', 'this.radius'),
    L('오버라이딩과 Area 메서드', 'C', 'Circle에서 area()를 오버라이딩하세요.', '원의 넓이는 π × r² 입니다.', 'area() {\n  return Math.PI * this.radius ** 2;\n}', 'area()', 'Math.PI'),
    L('정적 Shape 카운터', 'C', '생성된 도형 수를 static으로 세세요.', 'Shape 생성자에서 static 카운터를 올립니다.', 'class Shape {\n  static count = 0;\n  constructor() {\n    Shape.count++;\n  }\n}', 'static count', 'Shape.count++'),
  ] },
  { title: 'Getter와 Setter', lessons: [
    L('get 및 set 키워드', 'A', 'get과 set이 있는 name 접근자를 만드세요.', 'get은 읽을 때, set은 쓸 때 실행되며 속성처럼 사용합니다.', 'class User {\n  #name = "";\n  get name() {\n    return this.#name;\n  }\n  set name(v) {\n    this.#name = v;\n  }\n}', 'get name(', 'set name('),
    L('계산된 속성', 'A', 'width와 height로 area를 계산하는 getter를 만드세요.', '값을 저장하지 않고 필요할 때 계산하는 속성입니다.', 'class Rect {\n  constructor(w, h) {\n    this.w = w;\n    this.h = h;\n  }\n  get area() {\n    return this.w * this.h;\n  }\n}', 'get area(', 'this.w * this.h'),
    L('유효성 검사와 부수 효과', 'A', 'setter에서 음수를 막으세요.', 'setter 안에서 값을 검사하거나 다른 동작을 함께 수행할 수 있습니다.', 'set age(v) {\n  if (v < 0) throw new Error("음수 불가");\n  this._age = v;\n}', 'set age(', 'throw'),
    L('복습 챌린지', 'C', '온도를 섭씨/화씨로 읽고 쓰는 getter, setter를 만드세요.', 'getter와 setter를 조합합니다.', 'class Temp {\n  constructor(c) {\n    this.c = c;\n  }\n  get f() {\n    return this.c * 9 / 5 + 32;\n  }\n  set f(v) {\n    this.c = (v - 32) * 5 / 9;\n  }\n}', 'get f(', 'set f('),
  ] },
  { title: '합성 vs 상속', lessons: [
    L('"has-a" vs "is-a" 관계', 'A', 'Car가 Engine을 가지는(has-a) 합성 구조를 만드세요.', '합성은 다른 객체를 속성으로 가지는 구조입니다.', 'class Engine {}\nclass Car {\n  constructor() {\n    this.engine = new Engine();\n  }\n}', 'this.engine = new Engine()'),
    L('깊은 상속의 한계', 'A', '상속이 깊어지면 생기는 문제를 주석으로 쓰세요.', '상속 단계가 깊어지면 구조가 복잡해지고 한 클래스를 바꾸면 영향이 커집니다.', '// 깊은 상속은 변경의 영향 범위가 커진다', '//'),
    L('객체 구축하기', 'A', '여러 객체를 조합해 하나의 객체를 만드세요.', '작은 객체를 조합하면 유연하게 기능을 바꿀 수 있습니다.', 'class Robot {\n  constructor() {\n    this.arm = new Arm();\n    this.leg = new Leg();\n  }\n}', 'this.arm', 'this.leg'),
  ] },
  { title: '도서 관리 시스템', lessons: [
    L('도서관 설계하기', 'C', 'books 배열을 가진 Library 클래스를 만드세요.', '관리할 대상과 동작을 클래스로 설계합니다.', 'class Library {\n  constructor() {\n    this.books = [];\n  }\n}', 'class Library', 'this.books'),
    L('컴포지션을 활용한 Book 클래스', 'C', 'Author 객체를 가지는 Book 클래스를 만드세요.', '저자 정보를 별도 객체로 두고 Book이 가집니다.', 'class Book {\n  constructor(title, author) {\n    this.title = title;\n    this.author = author;\n  }\n}', 'class Book', 'this.author'),
    L('도서 저자 유효성 검사', 'C', '저자가 없으면 오류를 던지세요.', '생성자에서 필수 값을 검사합니다.', 'if (!author) throw new Error("저자 필수");', 'throw new Error'),
  ] },
  { title: '최종 챌린지', lessons: [
    L('게임 캐릭터 빌더', 'C', 'Character를 상속하는 Warrior와 Mage를 만들고 attack을 오버라이딩하세요.', '상속과 다형성을 조합합니다.', 'class Character {\n  attack() { return 1; }\n}\nclass Warrior extends Character {\n  attack() { return 10; }\n}', 'extends Character', 'attack()'),
    L('이커머스 상품 시스템', 'C', 'Product 클래스와 가격 계산 getter를 만드세요.', '캡슐화와 getter를 조합합니다.', 'class Product {\n  constructor(price, qty) {\n    this.price = price;\n    this.qty = qty;\n  }\n  get total() {\n    return this.price * this.qty;\n  }\n}', 'class Product', 'get total('),
    L('대학교 관리 시스템', 'C', 'Person을 상속하는 Student와 Professor를 만드세요.', '공통 속성은 부모에 두고 자식이 확장합니다.', 'class Person {}\nclass Student extends Person {}\nclass Professor extends Person {}', 'extends Person'),
    L('스마트 홈 기기 시스템', 'C', 'Device 추상 개념을 상속하는 Light와 Thermostat을 만드세요.', '다형성으로 서로 다른 기기를 같은 방식으로 제어합니다.', 'class Device {\n  turnOn() {}\n}\nclass Light extends Device {\n  turnOn() { console.log("light on"); }\n}', 'extends Device', 'turnOn('),
  ] },
];
