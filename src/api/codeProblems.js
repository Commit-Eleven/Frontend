import { apiRequest } from './client.js';
import { normalizeProblemLanguage } from './practiceProblems.js';

export const maxCodeLength = 10_000;

export async function fetchCodeProblem({ id, language, signal } = {}) {
  const payload = await apiRequest({
    url: '/problems/code',
    method: 'GET',
    params: { ...(id ? { id } : {}), ...(language ? { language } : {}) },
    signal,
  });
  const problem = payload?.problem ?? payload?.data?.problem ?? payload?.data ?? payload;
  const starterCode = problem?.content?.starter_code ?? problem?.content?.starterCode;
  const problemLanguage = normalizeProblemLanguage(problem?.language);
  if (
    typeof problem?.id !== 'string' || !problem.id ||
    typeof problem.title !== 'string' ||
    typeof starterCode !== 'string' ||
    (language && problemLanguage !== normalizeProblemLanguage(language))
  ) {
    throw new Error('코드 문제 응답을 확인하지 못했어요. 다시 시도해 주세요.');
  }
  return {
    ...problem,
    type: 'code',
    language: problemLanguage,
    description: typeof problem.description === 'string' ? problem.description : '',
    reward: Number.isFinite(problem.reward) && problem.reward >= 0 ? problem.reward : 0,
    content: { starterCode },
  };
}

export async function submitCodeAnswer(problemId, code, { signal } = {}) {
  if (!problemId) throw new Error('제출할 문제를 먼저 불러와 주세요.');
  if (typeof code !== 'string' || !code.trim()) throw new Error('코드를 입력해 주세요.');
  if (code.length > maxCodeLength) throw new Error(`코드는 ${maxCodeLength.toLocaleString()}자 이하로 작성해 주세요.`);
  const payload = await apiRequest({
    url: '/problems/code',
    method: 'POST',
    data: { id: problemId, code },
    signal,
  });
  const result = payload?.data ?? payload;
  if (
    typeof result?.isAnswer !== 'boolean' ||
    !Number.isInteger(result.passed) || !Number.isInteger(result.total) ||
    result.total <= 0 || result.passed < 0 || result.passed > result.total ||
    result.isAnswer !== (result.passed === result.total)
  ) {
    throw new Error('채점 결과를 확인하지 못했어요. 다시 제출해 주세요.');
  }
  return {
    correct: result.isAnswer,
    passed: result.passed,
    total: result.total,
    failed: Array.isArray(result.failed) ? result.failed.filter((message) => typeof message === 'string') : [],
  };
}
