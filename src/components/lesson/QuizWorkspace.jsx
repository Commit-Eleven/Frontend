import { useEffect, useState } from 'react';
import { codingLanguages } from '../../data/navigation.js';
import {
  fetchPracticeProblem,
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
import './QuizWorkspace.css';

const names = { mcq: '선택형', blank: '빈칸 채우기', parsons: '순서 맞추기', short: '단답형' };

function initialOrder(problem) {
  return problem.content.fragments.map(() => null);
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
  const language = selectedLanguage(languageCode);
  const [loaded, setLoaded] = useState({ status: 'loading', problem: null });
  const [selected, setSelected] = useState(null);
  const [blankValues, setBlankValues] = useState({});
  const [order, setOrder] = useState([]);
  const [shortAnswer, setShortAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const type = practiceTypes[step];
  const problem = loaded.problem;
  const example = loaded.status !== 'loading' && loaded.status !== 'ready';

  useEffect(() => {
    const controller = new AbortController();
    const show = (nextProblem, status) => {
      if (controller.signal.aborted) return;
      setLoaded({ status, problem: nextProblem });
      setSelected(null);
      setBlankValues({});
      setOrder(type === 'parsons' ? initialOrder(nextProblem) : []);
      setShortAnswer('');
      setFeedback(null);
      setError('');
    };
    fetchPracticeProblem(type, { signal: controller.signal })
      .then((nextProblem) => {
        if (
          String(nextProblem.language ?? '').toLowerCase() !== language.code ||
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
            examplePracticeProblem(type, lesson, language.code),
            caught.status === 401
              ? 'auth-required'
              : caught.status === 404
                ? 'language-unavailable'
                : 'error',
          );
      });
    return () => controller.abort();
  }, [type, lesson, request, language.code]);

  const continueAfterCorrectAnswer = () => {
    if (step === practiceTypes.length - 1) {
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
          onClick={onExit}
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
          aria-valuemax={practiceTypes.length}
          aria-valuenow={step + 1}
          aria-valuetext={`${step + 1} / ${practiceTypes.length}`}
        >
          <div
            className="practice-progress-fill"
            style={{ width: `${((step + 1) / practiceTypes.length) * 100}%` }}
          >
            <span>
              {step + 1}/{practiceTypes.length}
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
          {loaded.status === 'loading' ? (
            <p className="practice-loading" role="status">
              문제를 불러오고 있어요...
            </p>
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
              <h1 id="practice-title">{problem.title}</h1>
              <p className="practice-description">
                {problem.description ||
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
                {feedback?.correct ? (
                  <button
                    type="button"
                    className="precheck-submit"
                    onClick={continueAfterCorrectAnswer}
                  >
                    {step === practiceTypes.length - 1 ? '코드 문제 풀기 →' : '다음 개념 →'}
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
        </div>
      </div>
    </section>
  );
}
