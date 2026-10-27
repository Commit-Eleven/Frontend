import { useEffect, useRef, useState } from 'react';
import { chapterTitleFor } from '../../data/curricula.js';
import { challengeFor, starterCodeFor } from '../../data/challenges.js';
import { beginGoogleLogin, returnModeKey } from '../../api/auth.js';
import { recordWrongAnswer, resolveWrongNoteForProblem } from '../../lib/wrongNotes.js';
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
  const codeProblem = {
    id: `challenge-${lesson.id}`,
    type: 'code',
    language,
    title: `${lesson.title} 코드 작성`,
    description: challenge.instruction,
    content: { example: challenge.example, checks: challenge.checks },
  };
  const codeKey = `coddy-demo-code-${language}-${lesson.id}`;
  const [code, setCode] = useState(
    () => localStorage.getItem(codeKey) || starterCodeFor(language),
  );
  // Every entry from the journey map starts with the server-backed concept check.
  // Completing it only advances this lesson visit to the coding challenge.
  const [mode, setMode] = useState('concept');
  const [tests, setTests] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
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

  useEffect(() => {
    localStorage.setItem(codeKey, code);
  }, [code, codeKey]);

  const saveCodeAttempt = (result) => {
    const correct = result.every((test) => test.passed);
    if (correct) {
      resolveWrongNoteForProblem({
        language,
        lessonId: lesson.id,
        type: 'code',
        problemId: codeProblem.id,
      });
    } else {
      recordWrongAnswer({
        language,
        lessonId: lesson.id,
        lessonTitle: lesson.title,
        type: 'code',
        problem: codeProblem,
        submittedAnswer: code,
        feedback: { correct: false, answer: challenge.example, results: result },
        source: 'code-challenge',
      });
    }
    return correct;
  };

  const runCode = () => {
    if (language !== 'html') {
      const result = challenge.checks.map((check) => {
        const passed = code.includes(check.contains);
        return {
          ...check,
          actual: passed ? '필요한 코드 확인' : '코드에서 찾지 못함',
          passed,
        };
      });
      setTests(result);
      if (saveCodeAttempt(result)) {
        setShowSuccess(true);
        onSuccess(lesson.id);
      }
      return;
    }
    const parsed = new DOMParser().parseFromString(code, 'text/html');
    const result = challenge.checks.map((check) => {
      const element = parsed.querySelectorAll(check.selector)[check.index || 0];
      const text = element?.textContent.trim() || '';
      return {
        ...check,
        actual: check.exists ? (element ? '태그 있음' : '태그 없음') : text,
        passed: check.exists ? !!element : text === check.expected,
      };
    });
    setTests(result);
    if (saveCodeAttempt(result)) {
      setShowSuccess(true);
      onSuccess(lesson.id);
    }
  };

  const focusCodeEditor = () =>
    requestAnimationFrame(() => {
      document.querySelector('[aria-label$="코드 편집기"]')?.focus();
    });

  const finishConceptCheck = () => {
    setMode('challenge');
    focusCodeEditor();
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
        <LessonSidebar lesson={lesson} challenge={challenge} />
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
        <main className={'lesson-workspace ' + (mode === 'concept' ? 'quiz-mode' : '')}>
          {mode === 'concept' ? (
            <QuizWorkspace
              lesson={lesson}
              languageCode={language}
              onExit={onBack}
              onComplete={finishConceptCheck}
              onLogin={() => beginGoogleLogin('quiz')}
            />
          ) : (
            <CodeWorkspace
              code={code}
              onCodeChange={setCode}
              onRun={runCode}
              checks={challenge.checks}
              tests={tests}
              language={language}
              answer={challenge.example}
            />
          )}
        </main>
      </div>
      {showSuccess && (
        <div className="success-backdrop">
          <div className="success-card">
            <span className="success-icon">✓</span>
            <h2>레슨 완료!</h2>
            <p>모든 테스트 케이스를 통과했습니다.</p>
            <strong>+20 XP</strong>
            <button type="button" onClick={onBack}>
              여정으로 돌아가기
            </button>
            <button
              type="button"
              className="success-secondary"
              onClick={() => setShowSuccess(false)}
            >
              코드 계속 보기
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
