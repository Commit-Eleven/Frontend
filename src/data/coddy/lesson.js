// 레슨 정의 헬퍼: [제목, 유형, 지시, 이론, 예제, ...검사 문자열]
// 유형: A=일반 레슨, M=일반 레슨 + 마스터리, C=챌린지, P=프로젝트 단계
export const L = (title, kind, instruction, theory, example, ...checks) => ({
  title,
  kind,
  instruction,
  theory,
  example,
  checks,
});

// Java 예제를 Main 클래스로 감싸는 헬퍼
export const J = (body) =>
  `class Main {\n  public static void main(String[] args) {\n${body
    .split('\n')
    .map((line) => '    ' + line)
    .join('\n')}\n  }\n}`;
