import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchMCQProblems, mcqForLesson, normalizeMCQProblems } from '../src/api/problems.js'

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
  const originalFetch = globalThis.fetch
  let requestedUrl
  globalThis.fetch = async (url, options) => {
    requestedUrl = url
    assert.equal(options.method, 'GET')
    return {
      ok: true,
      json: async () => [{ prompt: '문제?', options: ['하나', '둘'], answer: '둘' }],
    }
  }
  context.after(() => { globalThis.fetch = originalFetch })

  const questions = await fetchMCQProblems()
  assert.equal(requestedUrl, '/api/problems/mcq')
  assert.equal(questions[0].correct, '둘')
})
