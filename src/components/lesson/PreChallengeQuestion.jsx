import { useState } from 'react';
import { QuestionOptions } from './questions/QuestionOptions.jsx';
import { QuestionHeader } from './questions/QuestionHeader.jsx';
import { QuestionActions } from './questions/QuestionActions.jsx';
import './PreChallengeQuestion.css';
import './questions/QuestionOptions.css';
import './questions/ProblemFeedback.css';

function resolvedChoice(value, choices) {
  if (Number.isInteger(value)) return choices[value] ?? null;
  return choices.find((choice) => choice === String(value)) ?? null;
}

export function PreChallengeQuestion({
  question,
  apiStatus = 'ready',
  onRetry,
  onLogin,
  onContinue,
  onSubmitAnswer,
}) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [needsLogin, setNeedsLogin] = useState(false);
  const isCorrect = feedback?.result === true;
  const correctChoice = resolvedChoice(
    feedback?.correctChoice ?? question.correct,
    question.choices,
  );

  const submit = async () => {
    if (selectedIndex === null || isSubmitting) return;
    setSubmitError('');
    setNeedsLogin(false);

    if (apiStatus !== 'ready') {
      setFeedback({
        result: question.choices[selectedIndex] === question.correct,
        correctChoice: question.correct,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await onSubmitAnswer({ id: question.id, answer: selectedIndex });
      setFeedback(result);
    } catch (error) {
      setNeedsLogin(error?.status === 401);
      setSubmitError(
        error?.status === 401
          ? '로그인이 만료되었습니다. 다시 로그인해 주세요.'
          : error?.message || '답안을 제출하지 못했습니다. 다시 시도해 주세요.',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const choose = (index) => {
    setSelectedIndex(index);
    setFeedback(null);
    setSubmitError('');
    setNeedsLogin(false);
  };

  const tryAgain = () => {
    setSelectedIndex(null);
    setFeedback(null);
    setSubmitError('');
    setNeedsLogin(false);
  };

  return (
    <section className="precheck-screen" aria-labelledby="precheck-title">
      <div className="precheck-card">
        <QuestionHeader step="01" label="문제 시작 전 · 개념 확인" />
        <div className={'precheck-api-status is-' + apiStatus} role="status" aria-live="polite">
          {apiStatus === 'loading' && '선택형 문제를 불러오고 있어요.'}
          {apiStatus === 'error' && (
            <>
              <span>문제 서버에 연결하지 못해 예시 문제를 표시하고 있어요.</span>
              <button type="button" onClick={onRetry}>
                다시 시도
              </button>
            </>
          )}
          {apiStatus === 'auth-required' && (
            <>
              <span>서버 문제를 보려면 로그인하세요. 지금은 예시 문제입니다.</span>
              <button type="button" onClick={onLogin}>
                Google로 로그인
              </button>
            </>
          )}
        </div>
        <h1 id="precheck-title">먼저 답을 골라보세요</h1>
        <p className="precheck-prompt">{question.prompt}</p>
        <QuestionOptions
          choices={question.choices}
          selectedIndex={selectedIndex}
          correctChoiceIndex={question.choices.indexOf(correctChoice)}
          showResult={Boolean(feedback)}
          isCorrect={isCorrect}
          onSelect={choose}
          disabled={apiStatus === 'loading' || isSubmitting}
        />
        {feedback && (
          <div
            className={'precheck-feedback ' + (isCorrect ? 'is-correct' : 'is-wrong')}
            role="status"
          >
            <strong>{isCorrect ? '정답이에요!' : '다시 한번 생각해 보세요.'}</strong>
            {isCorrect && (feedback.explanation || question.explanation) && (
              <p>{feedback.explanation || question.explanation}</p>
            )}
          </div>
        )}
        {submitError && (
          <div className="precheck-feedback is-error" role="alert">
            {submitError}
            {needsLogin && (
              <button type="button" onClick={onLogin}>
                Google로 로그인
              </button>
            )}
          </div>
        )}
        <QuestionActions>
          {feedback && isCorrect ? (
            <button type="button" className="precheck-submit" onClick={onContinue}>
              문제 풀기 <span aria-hidden="true">→</span>
            </button>
          ) : feedback ? (
            <button type="button" className="precheck-submit" onClick={tryAgain}>
              다시 선택하기
            </button>
          ) : (
            <button
              type="button"
              className="precheck-submit"
              onClick={submit}
              disabled={selectedIndex === null || apiStatus === 'loading' || isSubmitting}
            >
              {isSubmitting ? '확인 중...' : '정답 확인'}
            </button>
          )}
        </QuestionActions>
      </div>
    </section>
  );
}
