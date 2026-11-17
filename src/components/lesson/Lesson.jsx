import { useEffect, useRef, useState } from 'react';
import { chapterTitleFor } from '../../data/curricula.js';
import { challengeFor } from '../../data/challenges.js';
import { beginGoogleLogin, returnModeKey } from '../../api/auth.js';
import { useCodeChallenge } from '../../hooks/useCodeChallenge.js';
import { markProblemSolved } from '../../lib/studyActivity.js';
import { LessonSidebar } from './LessonSidebar.jsx';
import { CodeWorkspace } from './CodeWorkspace.jsx';
import { QuizWorkspace } from './QuizWorkspace.jsx';
import { PanelResizeHandle } from './PanelResizeHandle.jsx';
import './Lesson.css';

export function Lesson({ lessonId, language, journey, onBack, onSuccess }) {
  const lesson =
    journey.allNodes.find((node) => node.id === lessonId) ||
    journey.allNodes.find((node) => node.id === journey.defaultActive);
  const challenge = challengeFor(lesson, language);
  // Every entry from the journey map starts with the server-backed concept check.
  // Completing it only advances this lesson visit to the coding challenge.
  const [mode, setMode] = useState('concept');
  const saveSolved = async (...args) => {
    const result = await onSuccess(...args);
    markProblemSolved();
    return result;
  };
  const coding = useCodeChallenge({ enabled: mode === 'challenge', language, lesson, onSuccess: saveSolved });
  const loadingCode = coding.status === 'idle' || coding.status === 'loading';
  const lessonBodyRef = useRef(null);
  const [lessonBodyWidth, setLessonBodyWidth] = useState(() => window.innerWidth - 49);
  const [theoryWidth, setTheoryWidth] = useState(() => window.innerWidth <= 980 ? 300 : 400);
  const [isResizingTheory, setIsResizingTheory] = useState(false);

  useEffect(() => {
    const element = lessonBodyRef.current;
    if (!element) return undefined;
    const observer = new ResizeObserver(([entry]) => setLessonBodyWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  const narrowLayout = lessonBodyWidth <= 980;
  const theoryMinWidth = narrowLayout ? 220 : 260;
  const workspaceMinWidth = narrowLayout ? 420 : 620;
  const theoryMaxWidth = Math.max(
    theoryMinWidth,
    Math.min(narrowLayout ? 400 : 520, lessonBodyWidth - workspaceMinWidth - 10),
  );

  const boundedTheoryWidth = Math.max(theoryMinWidth, Math.min(theoryMaxWidth, theoryWidth));
  const resizeTheory = (width) =>
    setTheoryWidth(Math.max(theoryMinWidth, Math.min(theoryMaxWidth, width)));
  const theoryWidthFromPointer = (clientX) => {
    const bounds = lessonBodyRef.current?.getBoundingClientRect();
    return bounds ? clientX - bounds.left - 5 : boundedTheoryWidth;
  };

  useEffect(() => {
    sessionStorage.removeItem(returnModeKey);
  }, []);

  const finishConceptCheck = () => {
    setMode('challenge');
  };

  return (
    <div className="lesson-page">
      <header className="lesson-topbar">
        <button
          type="button"
          className="lesson-close"
          onClick={onBack}
          aria-label="여정으로 돌아가기"
        >
          ×
        </button>
        <strong>{chapterTitleFor(lesson.id, journey)}</strong>
      </header>
      <div
        className={`lesson-body${isResizingTheory ? ' is-resizing' : ''}`}
        ref={lessonBodyRef}
        style={{
          '--theory-width': `${boundedTheoryWidth}px`,
          '--theory-min-width': `${theoryMinWidth}px`,
          '--theory-max-width': `${theoryMaxWidth}px`,
        }}
      >
        <LessonSidebar lesson={lesson} challenge={challenge} codeMode={mode === 'challenge'} codeProblem={coding.problem} />
        <PanelResizeHandle
          className="lesson-theory-resizer"
          label="이론 패널 너비 조절"
          value={boundedTheoryWidth}
          min={theoryMinWidth}
          max={theoryMaxWidth}
          onResize={resizeTheory}
          getPointerValue={theoryWidthFromPointer}
          onDragChange={setIsResizingTheory}
        />
        <main className={'lesson-workspace ' + (mode === 'concept' ? 'quiz-mode' : '')} inert={coding.showSuccess}>
          {mode === 'concept' ? (
            <QuizWorkspace
              lesson={lesson}
              languageCode={language}
              onExit={onBack}
              onComplete={finishConceptCheck}
              onLogin={() => beginGoogleLogin('quiz')}
            />
          ) : coding.status === 'ready' ? (
            <CodeWorkspace
              code={coding.code}
              onCodeChange={coding.changeCode}
              onRun={coding.submit}
              result={coding.result}
              busy={coding.busy}
              error={coding.error}
              authRequired={coding.authRequired}
              onLogin={() => beginGoogleLogin('quiz')}
              language={language}
            />
          ) : (
            <div className="code-problem-state" role={loadingCode ? 'status' : 'alert'}>
              <h2>{loadingCode ? '코드 문제를 불러오는 중…'
                : coding.status === 'auth-required' ? '로그인이 필요해요'
                : coding.status === 'unavailable' ? '코드 문제를 준비하고 있어요'
                : '코드 문제를 불러오지 못했어요'}</h2>
              {!loadingCode && <>
                <p>{coding.status === 'unavailable' ? '아직 이 언어의 코드 문제가 없어요. 나중에 다시 확인해 주세요.' : coding.error}</p>
                {coding.status === 'auth-required'
                  ? <button type="button" onClick={() => beginGoogleLogin('quiz')}>Google로 로그인</button>
                  : <button type="button" onClick={coding.reload}>다시 시도</button>}
                <button type="button" className="code-state-secondary" onClick={onBack}>여정으로 돌아가기</button>
              </>}
            </div>
          )}
        </main>
      </div>
      {coding.showSuccess && (
        <div className="success-backdrop">
          <div className="success-card" role="dialog" aria-modal="true" aria-labelledby="code-success-title">
            <span className="success-icon">✓</span>
            <h2 id="code-success-title">{coding.completion === 'saved' ? '레슨 완료!' : '정답입니다!'}</h2>
            <p role="status">{coding.completion === 'saving' ? '완료 기록을 저장하고 있어요…'
              : coding.completion === 'error' ? '정답은 확인했지만 레슨 완료 기록을 저장하지 못했어요.'
              : '채점 기준을 모두 통과했습니다.'}</p>
            {coding.problem.reward > 0 && <>
              <strong>정답 보상 {coding.problem.reward.toLocaleString()} XP</strong>
              <small>보상은 문제를 처음 맞혔을 때 지급돼요.</small>
            </>}
            {coding.completion === 'error' && <p className="code-completion-error" role="alert">{coding.completionError}</p>}
            {coding.completion === 'error'
              ? <button type="button" disabled={coding.busy} onClick={coding.authRequired ? () => beginGoogleLogin('quiz') : coding.retryCompletion}>
                {coding.authRequired ? 'Google로 로그인' : '완료 저장 다시 시도'}
              </button>
              : <button type="button" disabled={coding.busy} onClick={onBack}>여정으로 돌아가기</button>}
            <button
              type="button"
              className="success-secondary"
              disabled={coding.busy}
              onClick={coding.closeSuccess}
            >
              코드 계속 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
