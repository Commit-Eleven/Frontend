import test from 'node:test';
import assert from 'node:assert/strict';
import { apiClient } from '../src/api/client.js';
import { fetchCodeProblem, maxCodeLength, submitCodeAnswer } from '../src/api/codeProblems.js';
import { completeLesson } from '../src/api/learning.js';

const problem = {
  id: 'html-code-1', type: 'code', title: '제목과 문단 만들기', language: 'html', reward: 40,
  description: '내용이 있는 h1 제목과 p 문단을 작성하세요.',
  content: { starter_code: '<html><body></body></html>' },
};

function mockApi(context, respond) {
  const original = apiClient.request;
  apiClient.request = respond;
  context.after(() => { apiClient.request = original; });
}

test('loads a language-filtered code problem and the server starter code', async (context) => {
  mockApi(context, async (config) => {
    assert.equal(apiClient.getUri(config), '/api/problems/code?language=html');
    assert.equal(config.method, 'GET');
    return { data: { problem } };
  });
  const loaded = await fetchCodeProblem({ language: 'html' });
  assert.equal(loaded.content.starterCode, problem.content.starter_code);
  assert.equal(loaded.reward, 40);
});

test('resumes the selected problem by its server ID', async (context) => {
  mockApi(context, async (config) => {
    assert.deepEqual(config.params, { id: 'html-code-1', language: 'html' });
    return { data: { data: { problem } } };
  });
  assert.equal((await fetchCodeProblem({ id: 'html-code-1', language: 'html' })).id, problem.id);
});

test('rejects a problem for another language instead of putting it in the wrong editor', async (context) => {
  mockApi(context, async () => ({ data: { problem: { ...problem, language: 'java' } } }));
  await assert.rejects(fetchCodeProblem({ language: 'html' }), /코드 문제 응답/);
});

test('submits the exact code with authorization and trusts the server grade', async (context) => {
  const previousStorage = globalThis.sessionStorage;
  globalThis.sessionStorage = { getItem: () => 'test-token' };
  context.after(() => { globalThis.sessionStorage = previousStorage; });
  const code = '\n<h1>제목</h1>\n<p>본문</p>\n';
  mockApi(context, async (config) => {
    assert.equal(config.method, 'POST');
    assert.equal(apiClient.getUri(config), '/api/problems/code');
    assert.equal(config.headers.Authorization, 'Bearer test-token');
    assert.deepEqual(config.data, { id: 'html-code-1', code });
    return { data: { isAnswer: false, passed: 1, total: 2, failed: ['문단을 확인해 주세요'] } };
  });
  assert.deepEqual(await submitCodeAnswer(problem.id, code), {
    correct: false, passed: 1, total: 2, failed: ['문단을 확인해 주세요'],
  });
});

test('does not treat malformed or inconsistent grades as a success', async (context) => {
  mockApi(context, async () => ({ data: { isAnswer: true, passed: 0, total: 2 } }));
  await assert.rejects(submitCodeAnswer(problem.id, '<p>Hi</p>'), /채점 결과/);
});

test('reads a successful grade in a data envelope', async (context) => {
  mockApi(context, async () => ({ data: { data: { isAnswer: true, passed: 2, total: 2 } } }));
  assert.deepEqual(await submitCodeAnswer(problem.id, '<h1>제목</h1><p>본문</p>'), {
    correct: true, passed: 2, total: 2, failed: [],
  });
});

test('prevents empty and oversized submissions before sending a request', async (context) => {
  mockApi(context, async () => { assert.fail('invalid code must not be submitted'); });
  await assert.rejects(submitCodeAnswer(problem.id, '  '), /코드를 입력/);
  await assert.rejects(submitCodeAnswer(problem.id, 'x'.repeat(maxCodeLength + 1)), /이하로 작성/);
});

test('preserves backend route errors so a missing deployment is not mistaken for an empty question pool', async (context) => {
  mockApi(context, async () => {
    throw { response: { status: 404, data: { error: { code: 'NotFound', message: '존재하지 않는 경로' } } } };
  });
  await assert.rejects(fetchCodeProblem({ language: 'html' }), { status: 404, code: 'NotFound', message: '존재하지 않는 경로' });
});

test('shows the validation message returned by the code submission API', async (context) => {
  mockApi(context, async () => {
    throw { response: { status: 400, data: { message: '코드는 10000자 이하로 보내주세요' } } };
  });
  await assert.rejects(submitCodeAnswer(problem.id, 'code'), /코드는 10000자/);
});

test('saves lesson completion with its language and reads the stored record', async (context) => {
  mockApi(context, async (config) => {
    assert.equal(apiClient.getUri(config), '/api/lessons/paragraphs/complete');
    assert.equal(config.method, 'POST');
    assert.deepEqual(config.data, { language: 'html' });
    return { data: { data: { lessonId: 'paragraphs', language: 'html', completedAt: '2026-11-10T09:00:00Z' } } };
  });
  assert.equal((await completeLesson('paragraphs', 'html')).lessonId, 'paragraphs');
});

test('does not mark a lesson complete when the server returns an unrelated payload', async (context) => {
  mockApi(context, async () => ({ data: '<html>app fallback</html>' }));
  await assert.rejects(completeLesson('paragraphs', 'html'), /완료 저장 응답/);
});
