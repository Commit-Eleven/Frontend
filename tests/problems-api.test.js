import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchMCQProblems, mcqForLesson, normalizeMCQProblems, submitMCQAnswer } from '../src/api/problems.js'
import { apiClient } from '../src/api/client.js'

function mockApi(context, respond) {
  const originalRequest = apiClient.request
  apiClient.request = respond
  context.after(() => { apiClient.request = originalRequest })
}

test('normalizes an enveloped MCQ response with a text answer', () => {
  const questions = normalizeMCQProblems({
    data: [{
      id: 14,
      lessonId: 'paragraphs',
      question: '단락 태그는 무엇인가요?',
      options: ['<p>', '<h1>', '<span>'],
      answer: '<p>',
      explanation: 'p 태그는 단락을 나타냅니다.',
    }],
  })

  assert.deepEqual(questions[0], {
    id: '14',
    lessonId: 'paragraphs',
    lessonTitle: '',
    prompt: '단락 태그는 무엇인가요?',
    choices: ['<p>', '<h1>', '<span>'],
    correct: '<p>',
    explanation: 'p 태그는 단락을 나타냅니다.',
  })
})

test('keeps a server MCQ without an answer for server-side grading', () => {
  const questions = normalizeMCQProblems({ data: { id: 'html-1', title: 'HTML 태그는?', choices: ['<p>', '<h1>'] } })

  assert.equal(questions.length, 1)
  assert.equal(questions[0].id, 'html-1')
  assert.equal(questions[0].prompt, 'HTML 태그는?')
  assert.equal(questions[0].correct, '')
})

test('normalizes the backend problem and nested choices response', () => {
  const questions = normalizeMCQProblems({
    problem: {
      id: 'mcq1',
      title: '리스트 컴프리헨션',
      description: '리스트를 만드는 올바른 표현은?',
      content: { choices: ['[x for x in range(10)]', '{x for x in range(10)}'], answer: 0 },
      unitId: 'vars-types',
    },
  })

  assert.equal(questions[0].id, 'mcq1')
  assert.equal(questions[0].prompt, '리스트를 만드는 올바른 표현은?')
  assert.deepEqual(questions[0].choices, ['[x for x in range(10)]', '{x for x in range(10)}'])
  assert.equal(questions[0].correct, '')
  assert.equal(questions[0].lessonId, 'vars-types')
})

test('normalizes choices represented by objects and a one-based answer number', () => {
  const questions = normalizeMCQProblems([{
    prompt: '가장 높은 제목 태그는?',
    choices: [{ label: 'A', text: '<h1>' }, { label: 'B', text: '<h6>' }],
    answer: 1,
  }])

  assert.equal(questions[0].correct, '<h1>')
  assert.deepEqual(questions[0].choices, ['<h1>', '<h6>'])
})

test('normalizes separately named choices with a letter answer', () => {
  const questions = normalizeMCQProblems({
    question: 'HTML 문단 태그는?',
    optionA: '<div>',
    optionB: '<p>',
    optionC: '<span>',
    answer: 'B',
  })

  assert.deepEqual(questions[0].choices, ['<div>', '<p>', '<span>'])
  assert.equal(questions[0].correct, '<p>')
})

test('prefers a question for the current lesson and falls back to a general question', () => {
  const questions = normalizeMCQProblems([
    { lessonId: 'headings', prompt: '제목?', options: ['<h1>', '<p>'], correctAnswer: '<h1>' },
    { lessonId: 'paragraphs', prompt: '단락?', options: ['<p>', '<div>'], correctAnswer: '<p>' },
  ])

  assert.equal(mcqForLesson(questions, { id: 'paragraphs', title: '단락' }).prompt, '단락?')
  assert.equal(mcqForLesson(questions, { id: 'unknown', title: '기타' }).prompt, '제목?')
})

test('requests the MCQ endpoint and returns normalized questions', async (context) => {
  let requestedUrl
  mockApi(context, async (config) => {
    requestedUrl = apiClient.getUri(config)
    assert.equal(config.method, 'GET')
    return { data: [{ prompt: '문제?', options: ['하나', '둘'], answer: '둘' }] }
  })

  const questions = await fetchMCQProblems()
  assert.equal(requestedUrl, '/api/problems/mcq')
  assert.equal(questions[0].correct, '둘')
})

test('submits a zero-based answer index to the MCQ endpoint', async (context) => {
  mockApi(context, async (config) => {
    assert.equal(apiClient.getUri(config), '/api/problems/mcq')
    assert.equal(config.method, 'POST')
    assert.deepEqual(config.data, { id: 'html-1', answer: 1 })
    return { data: { isAnswer: true } }
  })

  assert.deepEqual(await submitMCQAnswer({ id: 'html-1', answer: 1 }), {
    result: true,
    correctChoice: undefined,
    explanation: undefined,
  })
})

test('treats the backend answer index response as an incorrect submission', async (context) => {
  mockApi(context, async () => ({ data: { answer: 2 } }))

  const result = await submitMCQAnswer({ id: 'mcq1', answer: 0 })
  assert.equal(result.result, false)
  assert.equal(result.correctChoice, 2)
})

test('sends the saved access token when requesting a problem', async (context) => {
  const originalStorage = globalThis.sessionStorage
  globalThis.sessionStorage = { getItem: () => 'test-access-token' }
  mockApi(context, async (config) => {
    assert.equal(config.headers.Authorization, 'Bearer test-access-token')
    return { data: {
      problem: { id: 'mcq1', title: '문제?', content: { choices: ['A', 'B'] } },
    } }
  })
  context.after(() => {
    globalThis.sessionStorage = originalStorage
  })

  const questions = await fetchMCQProblems()
  assert.equal(questions[0].prompt, '문제?')
})
