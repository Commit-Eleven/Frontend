import { useEffect, useState } from 'react';
import { codingLanguages } from '../../data/navigation.js';
import {
  clearLessonProblemCache,
  fetchLessonProblems,
  fetchProblemTags,
  fetchPracticeProblem,
  normalizeProblemLanguage,
  problemTagForLanguage,
  practiceTypes,
  submitPracticeAnswer,
} from '../../api/practiceProblems.js';
import { examplePracticeProblem, gradeExamplePractice } from '../../data/practiceProblems.js';
import { FillBlankQuestion } from './questions/FillBlankQuestion.jsx';
import { MultipleChoiceQuestion } from './questions/MultipleChoiceQuestion.jsx';
import { ParsonsQuestion } from './questions/ParsonsQuestion.jsx';
import { ShortAnswerQuestion } from './questions/ShortAnswerQuestion.jsx';
import { ProblemFeedback } from './questions/ProblemFeedback.jsx';
import { QuestionHeader } from './questions/QuestionHeader.jsx';
import { QuestionActions } from './questions/QuestionActions.jsx';
import { recordWrongAnswer, resolveWrongNoteForProblem } from '../../lib/wrongNotes.js';
import { markProblemSolved } from '../../lib/studyActivity.js';
import { LoadingSkeleton } from '../common/LoadingSkeleton.jsx';
import { LoadingTransition } from '../common/LoadingTransition.jsx';
import './QuizWorkspace.css';

function cleanTitle(title) {
  const cleaned = String(title || '')
    .replace(/\s*(순서 맞추기|빈칸 채우기|단답형|객관식|선택형)\s*\d*\s*$/, '')
    .trim();
  return cleaned || title;
}

function cleanText(text) {
  return String(text || '').replace(
    /([A-Za-z0-9_)\]"'`]) +(으로|에서|을|를|은|는|이|가|와|과|로|의|에)(?=[\s.,?!]|$)/g,
    '$1$2',
  );
}

const names = { mcq: '선택형', blank: '빈칸 채우기', parsons: '순서 맞추기', short: '단답형' };

function initialOrder(problem) {
  return problem.content.fragments.map(() => null);
}

const quizSaveTtl = 30 * 60 * 1000;
const quizStorageKey = (languageCode, lessonId) => `codegram-quiz-${languageCode}-${lessonId}`;

function readQuizSave(languageCode, lessonId) {
  try {
    const saved = JSON.parse(sessionStorage.getItem(quizStorageKey(languageCode, lessonId)) || 'null');
    if (!saved || !Array.isArray(saved.ids) || Date.now() - (saved.savedAt || 0) > quizSaveTtl) return null;
    return saved;
  } catch {
    return null;
  }
}

function writeQuizSave(languageCode, lessonId, value) {
  try {
    sessionStorage.setItem(
      quizStorageKey(languageCode, lessonId),
      JSON.stringify({ ...value, savedAt: Date.now() }),
    );
  } catch {
    /* 저장소를 쓸 수 없으면 기억하지 않습니다. */
  }
}

function clearQuizSave(languageCode, lessonId) {
  try {
    sessionStorage.removeItem(quizStorageKey(languageCode, lessonId));
  } catch {
    /* noop */
  }
}

function selectedLanguage(code) {
  return codingLanguages.find((language) => language.code === code) || codingLanguages[0];
}

function supportsQuestionType(type, problem) {
  const content = problem?.content;
  if (!content || typeof content !== 'object') return false;
  if (type === 'mcq') return Array.isArray(content.choices) && content.choices.length > 1;
  if (type === 'blank') return typeof content.template === 'string' && Array.isArray(content.blanks);
  if (type === 'parsons')
    return Array.isArray(content.fragments) && content.fragments.length > 0;
  return !('starter_code' in content) && !('runtime' in content) && !('testcases' in content);
}

export function QuizWorkspace({ lesson, languageCode, onExit, onComplete, onLogin }) {
  const [step, setStep] = useState(0);
  const [request, setRequest] = useState(0);
  // 레슨에 붙은 문제 목록. null 은 아직 확인 전, [] 는 레슨 문제가 없어 기존 방식으로 가져오는 경우입니다.
  const [plan, setPlan] = useState(null);
  const language = selectedLanguage(languageCode);
  const [loaded, setLoaded] = useState({ status: 'loading', problem: null });
  const [selected, setSelected] = useState(null);
  const [blankValues, setBlankValues] = useState({});
  const [order, setOrder] = useState([]);
  const [shortAnswer, setShortAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const lessonMode = Array.isArray(plan) && plan.length > 0;
  const totalSteps = lessonMode ? plan.length : practiceTypes.length;
  const type = lessonMode ? plan[step]?.type : practiceTypes[step];
  const problem = loaded.problem;
  const example = loaded.status === 'language-unavailable' || loaded.status === 'error';

  useEffect(() => {
    if (!lessonMode) return;
    writeQuizSave(languageCode, lesson.id, { ids: plan.map((item) => item.id), step });
  }, [lessonMode, plan, step, languageCode, lesson.id]);

  const exitQuiz = () => {
    clearQuizSave(languageCode, lesson.id);
    onExit?.();
  };

  // 새로고침은 언마운트 없이 페이지가 닫히므로 저장이 남고, 화면을 떠나 다시 들어오면 새 문제를 뽑습니다.
  useEffect(() => () => clearQuizSave(languageCode, lesson.id), [languageCode, lesson.id]);

  useEffect(() => {
    const controller = new AbortController();
    setPlan(null);
    setStep(0);
    setLoaded({ status: 'loading', problem: null });
    fetchLessonProblems(lesson.id, { signal: controller.signal })
      .then(({ problems }) => {
        if (controller.signal.aborted) return;
        const usable = problems.filter(
          (item) => item.type !== 'code' && supportsQuestionType(item.type, item),
        );
        const saved = readQuizSave(languageCode, lesson.id);
        if (saved && saved.ids.length > 0) {
          const restored = saved.ids.map((id) => usable.find((item) => item.id === id));
          if (restored.every(Boolean)) {
            setPlan(restored);
            setStep(Math.min(Math.max(Number(saved.step) || 0, 0), restored.length - 1));
            return;
          }
        }
        const byType = new Map();
        usable.forEach((item) => {
          if (!byType.has(item.type)) byType.set(item.type, []);
          byType.get(item.type).push(item);
        });
        const order = ['mcq', 'parsons', 'blank', 'short'];
        setPlan(
          order
            .filter((name) => byType.has(name))
            .map((name) => {
              const list = byType.get(name);
              return list[Math.floor(Math.random() * list.length)];
            }),
        );
      })
      .catch(() => {
        // 레슨 문제가 없거나 불러오지 못하면 기존처럼 언어별 문제를 가져옵니다.
        if (!controller.signal.aborted) setPlan([]);
      });
    return () => controller.abort();
  }, [lesson.id, request]);

  useEffect(() => {
    if (plan === null) return undefined;
    const controller = new AbortController();
    const show = (nextProblem, status) => {
      if (controller.signal.aborted) return;
      setLoaded({ status, problem: nextProblem });
      setSelected(null);
      setBlankValues({});
      setOrder(type === 'parsons' && nextProblem ? initialOrder(nextProblem) : []);
      setShortAnswer('');
      setFeedback(null);
      setError('');
    };
    if (lessonMode) {
      show(plan[step], 'ready');
      return () => controller.abort();
    }
    fetchProblemTags({ signal: controller.signal })
      .then((tags) => {
        const languageTag = problemTagForLanguage(language.code);
        if (!tags.includes(languageTag)) {
          show(examplePracticeProblem(type, lesson, language.code), 'language-unavailable');
          return null;
        }
        return fetchPracticeProblem(type, { language: language.code, signal: controller.signal });
      })
      .then((nextProblem) => {
        if (!nextProblem || controller.signal.aborted) return;
        const problemLanguage = normalizeProblemLanguage(nextProblem.language);
        if (
          (problemLanguage && problemLanguage !== language.code) ||
          !supportsQuestionType(type, nextProblem)
        ) {
          show(examplePracticeProblem(type, lesson, language.code), 'language-unavailable');
        } else {
          show(nextProblem, 'ready');
        }
      })
      .catch((caught) => {
        if (!controller.signal.aborted)
          show(
            caught.status === 401 ? null : examplePracticeProblem(type, lesson, language.code),
            caught.status === 401
              ? 'auth-required'
              : caught.status === 404
                ? 'language-unavailable'
                : 'error',
          );
      });
    return () => controller.abort();
  }, [plan, step, type, lesson, request, language.code]);

  const continueAfterCorrectAnswer = () => {
    if (step === totalSteps - 1) {
      clearQuizSave(languageCode, lesson.id);
      onComplete();
      return;
    }
    const next = step + 1;
    setStep(next);
    setLoaded({ status: 'loading', problem: null });
    setFeedback(null);
    setError('');
  };
  const retry = () => {
    setLoaded({ status: 'loading', problem: null });
    clearLessonProblemCache(lesson.id);
    setRequest((value) => value + 1);
  };
  const answer =
    type === 'mcq'
      ? selected
      : type === 'blank'
        ? blankValues
        : type === 'parsons'
          ? order.filter(Number.isInteger)
          : shortAnswer;
  const canSubmit =
    !!problem &&
    !submitting &&
    (type === 'mcq'
      ? selected !== null
      : type === 'blank'
        ? problem.content.blanks.every(({ no }) => String(blankValues[no] ?? '').trim())
        : type === 'parsons'
          ? order.length === problem.content.fragments.length && order.every(Number.isInteger)
          : shortAnswer.trim().length > 0);

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const result = example
        ? gradeExamplePractice(type, problem, answer)
        : await submitPracticeAnswer(type, problem, answer);
      setFeedback(result);
      const noteContext = {
        language: language.code,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        type,
        problem,
      };
      if (result.correct) {
        resolveWrongNoteForProblem({ ...noteContext, problemId: problem.id });
        markProblemSolved();
      } else {
        recordWrongAnswer({
          ...noteContext,
          submittedAnswer: answer,
          feedback: result,
          source: example ? 'example' : 'server',
        });
      }
    } catch (caught) {
      setError(
        caught.status === 401 ? '로그인이 만료되었습니다. 다시 로그인해 주세요.' : caught.message,
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="practice-workspace" aria-label="개념 확인">
      <header className="practice-topbar">
        <button
          type="button"
          className="practice-back"
          onClick={exitQuiz}
          aria-label="여정으로 돌아가기"
        >
          ←
        </button>
        <div className="practice-heading">
          <strong>개념 확인</strong>
        </div>
        <div
          className="practice-progress-track"
          role="progressbar"
          aria-label="개념 확인 진행"
          aria-valuemin={1}
          aria-valuemax={totalSteps}
          aria-valuenow={step + 1}
          aria-valuetext={`${step + 1} / ${totalSteps}`}
        >
          <div
            className="practice-progress-fill"
            style={{ width: `${((step + 1) / totalSteps) * 100}%` }}
          >
            <span>
              {step + 1}/{totalSteps}
            </span>
          </div>
        </div>
      </header>
      <div className="practice-scroll">
        <div className="practice-card">
          <QuestionHeader
            step={String(step + 1).padStart(2, '0')}
            label={`${language.label} · ${names[type]} · 개념 확인`}
          />
          <LoadingTransition loading={loaded.status === 'loading' || plan === null} skeleton={<LoadingSkeleton variant="practice" label="문제를 불러오는 중" />}>
          {loaded.status === 'auth-required' ? (
            <div className="practice-auth-gate" role="alert">
              <h1>로그인이 필요해요</h1>
              <p>서버 문제를 불러오려면 로그인해 주세요.</p>
              <button type="button" onClick={onLogin}>
                Google로 로그인
              </button>
            </div>
          ) : (
            <>
              {example && (
                <div className="practice-api-status" role="status">
                  <span>
                    {loaded.status === 'auth-required'
                      ? '로그인하면 서버 문제를 풀 수 있어요. 현재는 예시 문제입니다.'
                      : loaded.status === 'language-unavailable'
                        ? `서버에 ${language.label} 문제가 없어 준비한 예시 문제를 표시하고 있어요.`
                        : '서버에 연결하지 못해 예시 문제를 표시하고 있어요.'}
                  </span>
                  <button
                    type="button"
                    onClick={loaded.status === 'auth-required' ? onLogin : retry}
                  >
                    {loaded.status === 'auth-required' ? 'Google로 로그인' : '다시 시도'}
                  </button>
                </div>
              )}
              <h1 id="practice-title">{cleanTitle(problem.title)}</h1>
              <p className="practice-description">
                {cleanText(problem.description) ||
                  (type === 'mcq'
                    ? '알맞은 답을 선택하세요.'
                    : '문제를 풀고 정답을 확인해 보세요.')}
              </p>
              {type === 'parsons' ? (
                <ParsonsQuestion
                  problem={problem}
                  order={order}
                  onChange={(value) => {
                    setOrder(value);
                    setFeedback(null);
                  }}
                  disabled={submitting}
                />
              ) : (
                <>
                  {type === 'mcq' && (
                    <MultipleChoiceQuestion
                      problem={problem}
                      selected={selected}
                      feedback={feedback}
                      onChange={(value) => {
                        setSelected(value);
                        setFeedback(null);
                        setError('');
                      }}
                      disabled={submitting}
                    />
                  )}
                  {type === 'blank' && (
                    <FillBlankQuestion
                      problem={problem}
                      values={blankValues}
                      onChange={(value) => {
                        setBlankValues(value);
                        setFeedback(null);
                      }}
                      disabled={submitting}
                    />
                  )}
                  {type === 'short' && (
                    <ShortAnswerQuestion
                      code={problem?.content?.code}
                      value={shortAnswer}
                      onChange={(value) => {
                        setShortAnswer(value);
                        setFeedback(null);
                      }}
                      disabled={submitting}
                    />
                  )}
                </>
              )}
              {feedback && <ProblemFeedback type={type} problem={problem} feedback={feedback} />}
              {error && (
                <div className="precheck-feedback is-error" role="alert">
                  <span>{error}</span>
                  {error.includes('로그인') && (
                    <button type="button" onClick={onLogin}>
                      Google로 로그인
                    </button>
                  )}
                </div>
              )}
              <QuestionActions>
                {feedback ? (
                  <button
                    type="button"
                    className="precheck-submit"
                    onClick={continueAfterCorrectAnswer}
                  >
                    {step === totalSteps - 1 ? '코드 문제 풀기 →' : '다음 문제 →'}
                  </button>
                ) : (
                  <button
                    type="button"
                    className="precheck-submit"
                    disabled={!canSubmit}
                    onClick={submit}
                  >
                    {submitting
                      ? '채점 중...'
                      : feedback
                        ? '다시 확인'
                        : type === 'parsons'
                          ? '제출하기'
                          : '정답 확인'}
                  </button>
                )}
              </QuestionActions>
            </>
          )}
          </LoadingTransition>
        </div>
      </div>
    </section>
  );
}
