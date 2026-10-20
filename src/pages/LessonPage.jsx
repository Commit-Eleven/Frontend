import { useEffect, useState } from 'react'
import { allNodes } from '../constants/dummy/journey.js'
import { challengeFor, preChallengeQuestionFor, starterCode } from '../constants/dummy/challenges.js'
import { fetchMCQProblems, mcqForLesson } from '../api/problems.js'
import { LessonSidebar } from '../components/lesson/LessonSidebar.jsx'
import { CodeWorkspace } from '../components/lesson/CodeWorkspace.jsx'
import { PreChallengeQuestion } from '../components/lesson/PreChallengeQuestion.jsx'
import { QuizWorkspace } from '../components/lesson/QuizWorkspace.jsx'

/** 레슨 화면의 학습 흐름과 코드 채점을 관리합니다. */
export function LessonPage({ lessonId, onBack, onSuccess }) {
  const lesson = allNodes.find((node) => node.id === lessonId) || allNodes.find((node) => node.id === 'paragraphs')
  const mcqLessonId = lesson.id
  const mcqLessonTitle = lesson.title
  const challenge = challengeFor(lesson)
  const precheckKey = 'coddy-demo-precheck-' + lesson.id
  const [precheckPassed, setPrecheckPassed] = useState(() => localStorage.getItem(precheckKey) === 'done')
  const [code, setCode] = useState(() => localStorage.getItem('coddy-demo-code-' + lesson.id) || starterCode)
  const [mode, setMode] = useState(() => localStorage.getItem(precheckKey) === 'done' ? 'challenge' : 'precheck')
  const [tests, setTests] = useState(null)
  const [showSuccess, setShowSuccess] = useState(false)
  const [theoryOpen, setTheoryOpen] = useState(true)
  const [mcqRequest, setMcqRequest] = useState(0)
  const [mcqState, setMcqState] = useState({ status: 'loading', question: null })

  useEffect(() => {
    if (mode !== 'precheck') return undefined
    const controller = new AbortController()

    fetchMCQProblems({ signal: controller.signal })
      .then((problems) => {
        const question = mcqForLesson(problems, { id: mcqLessonId, title: mcqLessonTitle })
        if (!question) throw new Error('이 레슨에 표시할 MCQ가 없습니다.')
        setMcqState({ status: 'ready', question })
      })
      .catch((error) => {
        if (error.name !== 'AbortError') setMcqState({ status: 'error', question: null })
      })

    return () => controller.abort()
  }, [mcqLessonId, mcqLessonTitle, mcqRequest, mode])

  useEffect(() => {
    localStorage.setItem('coddy-demo-code-' + lesson.id, code)
  }, [code, lesson.id])

  /** 작성한 HTML을 검사해 테스트 결과와 완료 상태를 갱신합니다. */
  const handleRunCode = () => {
    const parsed = new DOMParser().parseFromString(code, 'text/html')
    const result = challenge.checks.map((check) => {
      const element = parsed.querySelectorAll(check.selector)[check.index || 0]
      const text = element?.textContent.trim() || ''
      return {
        ...check,
        actual: check.exists ? (element ? '태그 있음' : '태그 없음') : text,
        passed: check.exists ? !!element : text === check.expected,
      }
    })
    setTests(result)
    if (result.every((test) => test.passed)) {
      setShowSuccess(true)
      onSuccess(lesson.id)
    }
  }

  /** 선택형 확인을 완료하고 코드 문제를 엽니다. */
  const handlePrecheckContinue = () => {
    localStorage.setItem(precheckKey, 'done')
    setPrecheckPassed(true)
    setMode('challenge')
  }

  /** 퀴즈를 종료하고 이전 학습 단계로 돌아갑니다. */
  const handleQuizExit = () => setMode(precheckPassed ? 'challenge' : 'precheck')

  return (
    <div className="lesson-page">
      <header className="lesson-topbar">
        <button type="button" className="lesson-close" onClick={onBack} aria-label="여정으로 돌아가기">×</button>
        <strong>텍스트와 서식</strong>
      </header>
      <div className={'lesson-body' + (theoryOpen ? '' : ' theory-collapsed')}>
        <LessonSidebar lesson={lesson} challenge={challenge} onQuiz={() => setMode('quiz')} open={theoryOpen} onToggleTheory={() => setTheoryOpen((open) => !open)} />
        <main className={'lesson-workspace ' + (mode === 'quiz' ? 'quiz-mode' : '')}>
          {mode === 'precheck' ? (
            <PreChallengeQuestion
              key={mcqState.question ? `${mcqState.question.id}:${mcqState.question.prompt}` : lesson.id}
              question={mcqState.question || preChallengeQuestionFor(lesson)}
              apiStatus={mcqState.status}
              onRetry={() => {
                setMcqState({ status: 'loading', question: null })
                setMcqRequest((request) => request + 1)
              }}
              onContinue={handlePrecheckContinue}
            />
          ) : mode === 'quiz' ? (
            <QuizWorkspace onExit={handleQuizExit} />
          ) : (
            <CodeWorkspace
              code={code}
              onCodeChange={setCode}
              onRun={handleRunCode}
              checks={challenge.checks}
              tests={tests}
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
            <button type="button" onClick={onBack}>여정으로 돌아가기</button>
            <button type="button" className="success-secondary" onClick={() => setShowSuccess(false)}>코드 계속 보기</button>
          </div>
        </div>
      )}
    </div>
  )
}
