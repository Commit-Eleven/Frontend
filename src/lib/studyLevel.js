const legacyKey = 'codegram-study-level'
const keyFor = (language) => (language ? `${legacyKey}-${language}` : legacyKey)

export const studyLevels = [
  { code: 'beginner', label: '초급', description: '처음 배우는 개념부터 차근차근 시작해요.' },
  { code: 'intermediate', label: '중급', description: '기본 문법을 알고 있고 문제를 더 풀어보고 싶어요.' },
  { code: 'advanced', label: '고급', description: '응용 문제와 코드 작성 위주로 도전해요.' },
]

const isLevel = (code) => studyLevels.some((level) => level.code === code)

// 언어별로 등급을 따로 저장합니다. 언어별 값이 없으면 예전에 저장한 공통 값을 씁니다.
export function readStudyLevel(language) {
  try {
    const saved = globalThis.localStorage?.getItem(keyFor(language))
    if (isLevel(saved)) return saved
    const legacy = globalThis.localStorage?.getItem(legacyKey)
    return isLevel(legacy) ? legacy : 'beginner'
  } catch {
    return 'beginner'
  }
}

export function hasSavedStudyLevel(language) {
  try {
    return isLevel(globalThis.localStorage?.getItem(keyFor(language)))
  } catch {
    return false
  }
}

export function saveStudyLevel(code, language) {
  try {
    globalThis.localStorage?.setItem(keyFor(language), code)
  } catch {
    // 저장소를 쓸 수 없어도 화면 선택은 유지합니다.
  }
  globalThis.dispatchEvent?.(new Event('codegram-level-change'))
}
