import test from 'node:test'
import assert from 'node:assert/strict'
import { fetchPracticeProblem, practiceAnswerBody, submitPracticeAnswer } from '../src/api/practiceProblems.js'
import { apiClient } from '../src/api/client.js'

function mockApi(context, respond) {
  const originalRequest = apiClient.request
  apiClient.request = respond
  context.after(() => { apiClient.request = originalRequest })
}

const problem = {
  id: 'blank1',
  title: '빈칸',
  content: { template: '{{1}} {{2}}', blanks: [{ no: 1 }, { no: 2 }] },
}

test('builds the answer bodies expected by all four problem graders', () => {
  assert.deepEqual(practiceAnswerBody('mcq', { id: 'mcq1' }, 2), { id: 'mcq1', answer: 2 })
  assert.deepEqual(practiceAnswerBody('blank', problem, { 1: 'range', 2: 'print' }), {
    id: 'blank1', answer: ['range', 'print'],
  })
  assert.deepEqual(practiceAnswerBody('parsons', { id: 'parsons1' }, [3, 0, 2, 1]), {
    id: 'parsons1', answer: [3, 0, 2, 1],
  })
  assert.deepEqual(practiceAnswerBody('short', { id: 'short1' }, '  p  '), { id: 'short1', answer: 'p' })
})

test('loads each problem type from its matching API endpoint', async (context) => {
  const urls = []
  mockApi(context, async (config) => {
    urls.push(apiClient.getUri(config))
    assert.equal(config.method, 'GET')
    return { data: { problem } }
  })

  for (const type of ['mcq', 'blank', 'parsons', 'short']) {
    assert.equal((await fetchPracticeProblem(type)).id, 'blank1')
  }
  assert.deepEqual(urls, ['mcq', 'blank', 'parsons', 'short'].map((type) => `/api/problems/${type}`))
})

test('submits a blank answer and reads the backend correction response', async (context) => {
  mockApi(context, async (config) => {
    assert.equal(apiClient.getUri(config), '/api/problems/blank')
    assert.equal(config.method, 'POST')
    assert.deepEqual(config.data, { id: 'blank1', answer: ['range', 'print'] })
    return { data: { answer: [{ no: 1, answers: ['range'] }] } }
  })

  const result = await submitPracticeAnswer('blank', problem, { 1: 'range', 2: 'print' })
  assert.equal(result.correct, false)
  assert.deepEqual(result.answer, [{ no: 1, answers: ['range'] }])
})

test('submits a short text answer to its API', async (context) => {
  mockApi(context, async (config) => {
    assert.equal(apiClient.getUri(config), '/api/problems/short')
    assert.deepEqual(config.data, { id: 'short1', answer: 'p' })
    return { data: { isAnswer: true } }
  })

  const result = await submitPracticeAnswer('short', { id: 'short1', content: {} }, 'p')
  assert.equal(result.correct, true)
})
