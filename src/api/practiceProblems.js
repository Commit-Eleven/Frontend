import { apiRequest } from './client.js'

export const practiceTypes = ['mcq', 'blank', 'parsons', 'short']

function assertType(type) {
  if (!practiceTypes.includes(type)) throw new Error('지원하지 않는 문제 형식입니다.')
}

async function requestProblem(type, options = {}) {
  assertType(type)
  return apiRequest({ url: `/problems/${type}`, ...options })
}

export async function fetchPracticeProblem(type, { signal, language } = {}) {
  const payload = await requestProblem(type, {
    method: 'GET', signal, params: language ? { language } : undefined,
  })
  const problem = payload?.problem ?? payload?.data?.problem ?? payload?.data ?? payload
  if (!problem || typeof problem !== 'object' || !problem.id || !problem.content) {
    throw new Error('문제 응답 형식이 올바르지 않습니다.')
  }
  return problem
}

export function practiceAnswerBody(type, problem, answer) {
  assertType(type)
  const id = String(problem?.id ?? '')
  if (!id) throw new Error('제출할 문제 ID가 없습니다.')

  if (type === 'mcq') {
    if (!Number.isInteger(answer) || answer < 0) throw new Error('답안을 선택해 주세요.')
    return { id, answer }
  }
  if (type === 'parsons') {
    if (!Array.isArray(answer) || !answer.every(Number.isInteger)) {
      throw new Error('코드 조각의 순서를 완성해 주세요.')
    }
    return { id, answer }
  }
  if (type === 'blank') {
    const blanks = problem.content?.blanks ?? []
    if (!Array.isArray(blanks) || !blanks.length) throw new Error('빈칸 정보가 없습니다.')
    const values = blanks.map(({ no }) => String(answer?.[no] ?? '').trim())
    if (values.some((value) => !value)) throw new Error('모든 빈칸을 채워 주세요.')
    // The current backend grades blank answers as an array ordered by blank number.
    return { id, answer: values }
  }
  const shortAnswer = String(answer ?? '').trim()
  if (!shortAnswer) throw new Error('답을 입력해 주세요.')
  return { id, answer: shortAnswer }
}

export async function submitPracticeAnswer(type, problem, answer, { signal } = {}) {
  const body = practiceAnswerBody(type, problem, answer)
  const payload = await requestProblem(type, {
    method: 'POST',
    data: body,
    signal,
  })
  const result = payload?.data && typeof payload.data === 'object' ? payload.data : payload
  if (!result || typeof result !== 'object') throw new Error('채점 응답 형식이 올바르지 않습니다.')
  const correct = typeof result.isAnswer === 'boolean'
    ? result.isAnswer
    : typeof result.result === 'boolean'
      ? result.result
      : result.answer !== undefined ? false : null
  if (correct === null) throw new Error('채점 결과를 확인할 수 없습니다.')
  return {
    correct,
    answer: result.answer,
    explanation: result.explanation ?? problem.content?.explanation ?? '',
    results: Array.isArray(result.results) ? result.results : [],
  }
}
