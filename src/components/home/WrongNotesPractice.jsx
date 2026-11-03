import { useEffect, useState } from 'react';
import { submitPracticeAnswer } from '../../api/practiceProblems.js';
import { gradeExamplePractice } from '../../data/practiceProblems.js';
import { recordWrongAnswer, resolveWrongNote } from '../../lib/wrongNotes.js';
import { FillBlankQuestion } from '../lesson/questions/FillBlankQuestion.jsx';
import { MultipleChoiceQuestion } from '../lesson/questions/MultipleChoiceQuestion.jsx';
import { ParsonsQuestion } from '../lesson/questions/ParsonsQuestion.jsx';
import { ProblemFeedback } from '../lesson/questions/ProblemFeedback.jsx';
import { ShortAnswerQuestion } from '../lesson/questions/ShortAnswerQuestion.jsx';
import './WrongNotesPractice.css';

const typeLabels = {
  mcq: '선택형',
  blank: '빈칸 채우기',
  parsons: '순서 맞추기',
  short: '단답형',
};

function WrongNoteStep({ note, isLast, onCorrect, onNext }) {
  const [selected, setSelected] = useState(null);
  const [blankValues, setBlankValues] = useState({});
  const [order, setOrder] = useState(() =>
    note.problem.content.fragments?.map(() => null) ?? [],
  );
  const [shortAnswer, setShortAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const { type, problem } = note;

  const answer = type === 'mcq'
    ? selected
    : type === 'blank'
      ? blankValues
      : type === 'parsons'
        ? order.filter(Number.isInteger)
        : shortAnswer;
  const complete = type === 'mcq'
    ? selected !== null
    : type === 'blank'
      ? problem.content.blanks.every(({ no }) => String(blankValues[no] ?? '').trim())
      : type === 'parsons'
        ? order.length === problem.content.fragments.length && order.every(Number.isInteger)
        : shortAnswer.trim().length > 0;
  const canSubmit = !submitting && !feedback && complete;

  const changeAnswer = (setter, value) => {
    setter(value);
    setFeedback(null);
    setError('');
  };

  const submit = async () => {
    if (!canSubmit) return;
    setSubmitting(true);
    setError('');
    try {
      const result = note.source === 'example'
        ? gradeExamplePractice(type, problem, answer)
        : await submitPracticeAnswer(type, problem, answer);
      setFeedback(result);
      if (result.correct) {
        resolveWrongNote(note.id);
        onCorrect(note.id);
      } else {
        recordWrongAnswer({
          language: note.language,
          lessonId: note.lessonId,
          lessonTitle: note.lessonTitle,
          type,
          problem,
          submittedAnswer: answer,
          feedback: result,
          source: note.source,
        });
      }
    } catch (caught) {
      setError(caught.status === 401
        ? '로그인이 만료되었습니다. 다시 로그인해 주세요.'
        : caught.message || '답안을 확인하지 못했어요. 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <main className="wrong-practice-main">
        <div className="wrong-practice-question">
          <div className="wrong-practice-context">
            <span>{typeLabels[type]}</span>
            <span>{note.lessonTitle}</span>
          </div>
          <h2>{problem.title}</h2>
          <p className="wrong-practice-description">
            {problem.description || '이전에 틀린 문제를 다시 풀어보세요.'}
          </p>
          {type === 'mcq' && (
            <MultipleChoiceQuestion
              problem={problem}
              selected={selected}
              feedback={feedback}
              onChange={(value) => changeAnswer(setSelected, value)}
              disabled={submitting || Boolean(feedback?.correct)}
            />
          )}
          {type === 'blank' && (
            <FillBlankQuestion
              problem={problem}
              values={blankValues}
              onChange={(value) => changeAnswer(setBlankValues, value)}
              disabled={submitting || Boolean(feedback?.correct)}
            />
          )}
          {type === 'parsons' && (
            <ParsonsQuestion
              problem={problem}
              order={order}
              onChange={(value) => changeAnswer(setOrder, value)}
              disabled={submitting || Boolean(feedback?.correct)}
            />
          )}
          {type === 'short' && (
            <ShortAnswerQuestion
              value={shortAnswer}
              onChange={(value) => changeAnswer(setShortAnswer, value)}
              disabled={submitting || Boolean(feedback?.correct)}
            />
          )}
          {feedback && <ProblemFeedback type={type} problem={problem} feedback={feedback} />}
          {error && <div className="precheck-feedback is-error" role="alert">{error}</div>}
        </div>
      </main>
      <footer className="wrong-practice-footer">
        <div className="wrong-practice-footer-inner">
          <span>
            {feedback?.correct
              ? '잘했어요! 복습 완료로 옮겨졌어요.'
              : feedback
                ? '답을 고쳐 다시 제출하거나 다음 문제로 넘어가세요.'
                : '답을 선택하고 정답을 확인해 보세요.'}
          </span>
          <div className="wrong-practice-actions">
            {feedback && !feedback.correct && (
              <button type="button" className="wrong-practice-secondary" onClick={onNext}>
                {isLast ? '결과 보기' : '다음 문제'}
              </button>
            )}
            {feedback?.correct ? (
              <button type="button" className="wrong-practice-primary" onClick={onNext}>
                {isLast ? '결과 보기' : '다음 문제'}
              </button>
            ) : (
              <button type="button" className="wrong-practice-primary" disabled={!canSubmit} onClick={submit}>
                {submitting ? '채점 중...' : feedback ? '다시 제출' : '정답 확인'}
              </button>
            )}
          </div>
        </div>
      </footer>
    </>
  );
}

export function WrongNotesPractice({ notes, language, onExit }) {
  const [index, setIndex] = useState(0);
  const [successfulIds, setSuccessfulIds] = useState([]);
  const [finished, setFinished] = useState(false);
  const [confirmExit, setConfirmExit] = useState(false);
  const currentNote = notes[index];
  const progress = finished ? notes.length : index + (successfulIds.includes(currentNote?.id) ? 1 : 0);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, []);

  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key !== 'Escape') return;
      setConfirmExit((previous) => !previous);
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, []);

  const next = () => {
    if (index + 1 < notes.length) {
      setIndex(index + 1);
    } else {
      setFinished(true);
    }
  };

  return (
    <div className="wrong-practice" role="dialog" aria-modal="true" aria-label="오답 복습">
      <header className="wrong-practice-header">
        <div className="wrong-practice-header-inner">
          <button
            type="button"
            className="wrong-practice-close"
            aria-label="복습 종료"
            onClick={() => finished ? onExit() : setConfirmExit(true)}
          >×</button>
          <strong>{finished ? '복습 결과' : language.label + ' 오답 복습'}</strong>
          <span>{finished ? notes.length + '문제 완료' : index + 1 + ' / ' + notes.length}</span>
        </div>
        <div
          className="wrong-practice-progress"
          role="progressbar"
          aria-label="복습 진행"
          aria-valuemin={0}
          aria-valuemax={notes.length}
          aria-valuenow={progress}
        >
          <span style={{ width: (progress / notes.length) * 100 + '%' }} />
        </div>
      </header>

      {finished ? (
        <main className="wrong-practice-result">
          <div className="wrong-practice-result-icon" aria-hidden="true">✓</div>
          <h2>{successfulIds.length === notes.length ? '모두 다시 맞혔어요!' : '오늘의 복습을 마쳤어요'}</h2>
          <p>{notes.length}문제 중 {successfulIds.length}문제를 다시 맞혔어요.</p>
          {successfulIds.length < notes.length && (
            <p>아직 틀린 문제는 오답 노트에 남아 있어요.</p>
          )}
          <button type="button" className="wrong-practice-primary" onClick={onExit}>
            오답 노트로 돌아가기
          </button>
        </main>
      ) : (
        <WrongNoteStep
          key={currentNote.id}
          note={currentNote}
          isLast={index === notes.length - 1}
          onCorrect={(id) => setSuccessfulIds((previous) =>
            previous.includes(id) ? previous : [...previous, id])}
          onNext={next}
        />
      )}

      {confirmExit && (
        <div className="wrong-practice-modal-backdrop">
          <div className="wrong-practice-modal" role="alertdialog" aria-modal="true" aria-labelledby="wrong-practice-exit-title">
            <h2 id="wrong-practice-exit-title">복습을 종료할까요?</h2>
            <p>맞힌 문제는 복습 완료로 저장되고, 아직 틀린 문제는 오답 노트에 남아요.</p>
            <div>
              <button type="button" className="wrong-practice-secondary" onClick={() => setConfirmExit(false)}>
                계속 풀기
              </button>
              <button type="button" className="wrong-practice-primary" onClick={onExit}>
                복습 종료
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
