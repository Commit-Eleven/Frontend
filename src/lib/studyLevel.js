const storageKey = 'codegram-study-level'

export const studyLevels = [
  { code: 'beginner', label: '초급', description: '처음 배우는 개념부터 차근차근 시작해요.' },
  { code: 'intermediate', label: '중급', description: '기본 문법을 알고 있고 문제를 더 풀어보고 싶어요.' },
  { code: 'advanced', label: '고급', description: '응용 문제와 코드 작성 위주로 도전해요.' },
]

export function readStudyLevel() {
  try {
    const saved = globalThis.localStorage?.getItem(storageKey)
    return studyLevels.some((level) => level.code === saved) ? saved : 'beginner'
  } catch {
    return 'beginner'
  }
}

export function saveStudyLevel(code) {
  try {
    globalThis.localStorage?.setItem(storageKey, code)
  } catch {
    // 저장소를 쓸 수 없어도 화면 선택은 유지합니다.
  }
}
