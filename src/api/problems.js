import { apiRequest } from './client.js';

const mcqEndpoint = '/problems/mcq';

const questionFields = [
  'prompt',
  'question',
  'questionText',
  'question_text',
  'problem',
  'problemText',
  'problemContent',
  'problem_content',
  'description',
  'title',
  'content',
];
const choiceFields = [
  'choices',
  'options',
  'answers',
  'alternatives',
  'choiceList',
  'choice_list',
  'optionList',
  'option_list',
];
const answerFields = [
  'correctAnswer',
  'correct_answer',
  'correctOption',
  'correct_option',
  'correctChoice',
  'correct_choice',
  'answer',
  'correct',
];

function firstValue(record, keys) {
  for (const key of keys) {
    if (record[key] !== undefined && record[key] !== null) return record[key];
  }
  return undefined;
}

function getQuestionRecords(payload) {
  if (Array.isArray(payload)) return payload;
  if (!payload || typeof payload !== 'object') return [];

  for (const key of [
    'data',
    'problem',
    'problems',
    'questions',
    'mcq',
    'multipleChoiceQuestions',
    'items',
    'results',
  ]) {
    const value = payload[key];
    if (Array.isArray(value)) return value;
    if (value && typeof value === 'object') {
      const nested = getQuestionRecords(value);
      if (nested.length) return nested;
    }
  }

  return firstValue(payload, questionFields) !== undefined ? [payload] : [];
}

function optionLabel(option) {
  if (typeof option === 'string' || typeof option === 'number') return String(option);
  if (!option || typeof option !== 'object') return '';
  return String(
    firstValue(option, ['text', 'label', 'value', 'content', 'option', 'choice', 'name']) ?? '',
  );
}

function getCorrectChoice(record, options, choices) {
  const markedOption = options.find(
    ({ raw }) => raw && typeof raw === 'object' && (raw.isCorrect === true || raw.correct === true),
  );
  if (markedOption) return markedOption.text;

  const explicitIndex = firstValue(record, [
    'correctIndex',
    'correct_index',
    'correctAnswerIndex',
    'correct_answer_index',
    'answerIndex',
    'answer_index',
  ]);
  const parsedExplicitIndex = Number(explicitIndex);
  if (
    explicitIndex !== undefined &&
    Number.isInteger(parsedExplicitIndex) &&
    choices[parsedExplicitIndex] !== undefined
  )
    return choices[parsedExplicitIndex];

  const answer = firstValue(record, answerFields);
  if (answer === undefined) return '';
  const answerValue =
    answer && typeof answer === 'object'
      ? firstValue(answer, ['text', 'label', 'value', 'content', 'id', 'name'])
      : answer;
  const answerText = String(answerValue ?? '');
  const matchingOption = options.find(({ raw, text, key }, index) => {
    if (text === answerText) return true;
    if (key === answerText) return true;
    if (!raw || typeof raw !== 'object') return false;
    return (
      [raw.id, raw.key, raw.label, raw.value].some(
        (value) => value !== undefined && String(value) === answerText,
      ) || String.fromCharCode(65 + index) === answerText.toUpperCase()
    );
  });
  if (matchingOption) return matchingOption.text;

  if (Number.isInteger(answerValue)) {
    if (answerValue === 0) return choices[0] || '';
    return choices[answerValue - 1] || choices[answerValue] || '';
  }
  if (/^\d+$/.test(answerText)) {
    const answerIndex = Number(answerText);
    return answerIndex === 0
      ? choices[0] || ''
      : choices[answerIndex - 1] || choices[answerIndex] || '';
  }

  return choices.includes(answerText) ? answerText : '';
}

/** API 응답의 객관식 문제를 화면에서 사용하는 문제 모델로 변환합니다. */
export function normalizeMCQProblems(payload) {
  return getQuestionRecords(payload).flatMap((record, index) => {
    if (!record || typeof record !== 'object') return [];

    const prompt = firstValue(record, questionFields);
    const rawChoices = firstValue(record, choiceFields) ??
      (record.content && typeof record.content === 'object'
        ? firstValue(record.content, choiceFields)
        : undefined);
    const discreteChoices = Object.entries(record)
      .filter(([key]) => /^(option|choice)[_-]?[a-d1-9]$/i.test(key))
      .sort(([left], [right]) => left.localeCompare(right, undefined, { numeric: true }));
    const entries = Array.isArray(rawChoices)
      ? rawChoices.map((raw) => ({ raw }))
      : rawChoices && typeof rawChoices === 'object'
        ? Object.entries(rawChoices).map(([key, raw]) => ({ key, raw }))
        : discreteChoices.map(([key, raw]) => ({ key: key.match(/[a-d1-9]$/i)?.[0], raw }));
    const options = entries
      .map(({ key, raw }) => ({ key, raw, text: optionLabel(raw) || String(raw) }))
      .filter((option) => option.text);
    const choices = options.map((option) => option.text);
    if (typeof prompt !== 'string' || !prompt.trim() || choices.length < 2) return [];

    const question = {
      id: String(record.id ?? record.problemId ?? record.problem_id ?? index),
      lessonId: String(
        record.lessonId ??
          record.lesson_id ??
          record.lesson?.id ??
          record.lesson ??
          record.unitId ??
          record.topic ??
          '',
      ),
      lessonTitle: String(record.lessonTitle ?? record.lesson_title ?? record.lesson?.title ?? ''),
      prompt: prompt.trim(),
      choices,
      correct: getCorrectChoice(record, options, choices),
      explanation: String(
        record.explanation ?? record.rationale ?? record.answerExplanation ?? record.content?.explanation ?? '',
      ),
    };

    // The GET endpoint may omit the answer; the server checks it on POST.
    return [question];
  });
}

/** 레슨 식별자가 있으면 해당 문제를 우선하고, 없으면 첫 서버 문항을 사용합니다. */
export function mcqForLesson(problems, lesson) {
  const identifiers = [lesson.id, lesson.title]
    .filter(Boolean)
    .map((value) => String(value).toLocaleLowerCase());
  return (
    problems.find((problem) =>
      [problem.lessonId, problem.lessonTitle].some(
        (value) => value && identifiers.includes(value.toLocaleLowerCase()),
      ),
    ) ||
    problems[0] ||
    null
  );
}

/** MCQ API에서 문제 목록을 가져옵니다. */
export async function fetchMCQProblems({ signal } = {}) {
  const payload = await apiRequest({
    url: mcqEndpoint,
    method: 'GET',
    signal,
  });
  const problems = normalizeMCQProblems(payload);
  if (!problems.length) throw new Error('MCQ API 응답에 표시할 수 있는 문제가 없습니다.');
  return problems;
}

/** 선택한 객관식 답안을 서버에 제출하고 채점 결과를 반환합니다. */
export async function submitMCQAnswer({ id, answer, signal }) {
  if (!id || !Number.isInteger(answer) || answer < 0) {
    throw new Error('제출할 객관식 답안 형식이 올바르지 않습니다.');
  }

  const payload = await apiRequest({
    url: mcqEndpoint,
    method: 'POST',
    data: { id: String(id), answer },
    signal,
  });
  const data = payload?.data && typeof payload.data === 'object' ? payload.data : payload;
  if (!data || typeof data !== 'object') {
    throw new Error('MCQ 채점 응답 형식이 올바르지 않습니다.');
  }
  const result = firstValue(data, ['result', 'isCorrect', 'isAnswer', 'correct']) ??
    (Number.isInteger(data.answer) ? false : undefined);
  if (typeof result !== 'boolean') {
    throw new Error('MCQ 채점 응답 형식이 올바르지 않습니다.');
  }

  return {
    result,
    correctChoice: firstValue(data, ['correctChoice', 'correctAnswer', 'answer']),
    explanation: firstValue(data, ['explanation', 'rationale']),
  };
}
