import apiClient from './axios';

/** 서버 응답이 객관식 문제 화면에서 사용할 수 있는 형태인지 검증합니다. */
function normalizeMultipleChoiceProblem(data) {
  const isValidId = typeof data?.id === 'number' || typeof data?.id === 'string';
  const hasChoices = Array.isArray(data?.choices) && data.choices.every((choice) => typeof choice === 'string');

  if (!isValidId || typeof data?.title !== 'string' || !hasChoices) {
    throw new Error('문제 API 응답 형식이 올바르지 않습니다.');
  }

  return { ...data, text: data.title };
}

/** 객관식 문제 한 문항을 조회합니다. */
export async function getMultipleChoiceProblem() {
  const { data } = await apiClient.get('/api/problems/mcq');
  return normalizeMultipleChoiceProblem(data);
}

/** 선택한 객관식 답안을 제출하고 채점 결과를 반환합니다. */
export async function submitMultipleChoiceAnswer({ id, choice }) {
  if ((typeof id !== 'number' && typeof id !== 'string') || !Number.isInteger(choice) || choice < 0) {
    throw new Error('제출할 답안 형식이 올바르지 않습니다.');
  }

  const { data } = await apiClient.post('/api/problems/mcq/answer', { id, choice });

  if (!data || typeof data !== 'object' || typeof data.result !== 'boolean') {
    throw new Error('답안 채점 API 응답 형식이 올바르지 않습니다.');
  }

  return {
    ...data,
    correctChoice: data.correctChoice ?? data.correctAnswer ?? data.answer,
  };
}
