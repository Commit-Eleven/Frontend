import { useState } from 'react'

/** 레슨 시작 전에 개념을 확인하는 선택형 문제를 표시합니다. */
export function PreChallengeQuestion({ question, onContinue }) {
  const [selected, setSelected] = useState(null)
  const [submitted, setSubmitted] = useState(false)
  const isCorrect = selected === question.correct

  /** 선택한 답이 정답인지 확인하고 결과를 표시합니다. */
  const handleSubmitAnswer = () => {
    if (!selected) return
    setSubmitted(true)
  }

  /** 선택형 문제의 답안을 선택합니다. */
  const handleChoiceSelect = (choice) => {
    setSelected(choice)
    setSubmitted(false)
  }

  /** 오답 확인 후 다시 답안을 고를 수 있게 초기화합니다. */
  const handleRetry = () => {
    setSelected(null)
    setSubmitted(false)
  }

  return (
    <section className="precheck-screen" aria-labelledby="precheck-title">
      <div className="precheck-card">
        <div className="precheck-eyebrow"><span>01</span> 문제 시작 전 · 개념 확인</div>
        <h1 id="precheck-title">먼저 답을 골라보세요</h1>
        <p className="precheck-prompt">{question.prompt}</p>
        <div className="precheck-options" role="radiogroup" aria-label="답 선택">
          {question.choices.map((choice, index) => {
            const chosen = selected === choice
            const correctAnswer = submitted && choice === question.correct
            const wrongAnswer = submitted && chosen && !isCorrect
            const className = [
              'precheck-option',
              chosen && 'is-selected',
              correctAnswer && 'is-correct',
              wrongAnswer && 'is-wrong',
            ].filter(Boolean).join(' ')

            return (
              <button
                key={choice}
                type="button"
                role="radio"
                aria-checked={chosen}
                className={className}
                onClick={() => handleChoiceSelect(choice)}
              >
                <span className="precheck-option-number">{index + 1}</span>
                <code>{choice}</code>
                {correctAnswer && <span className="precheck-result-icon" aria-label="정답">✓</span>}
                {wrongAnswer && <span className="precheck-result-icon" aria-label="오답">×</span>}
              </button>
            )
          })}
        </div>
        {submitted && (
          <div className={'precheck-feedback ' + (isCorrect ? 'is-correct' : 'is-wrong')} role="status">
            <strong>{isCorrect ? '정답이에요!' : '다시 한번 생각해 보세요.'}</strong>
            {isCorrect && <p>{question.explanation}</p>}
          </div>
        )}
        <div className="precheck-actions">
          {submitted && isCorrect ? (
            <button type="button" className="precheck-handleSubmitAnswer" onClick={onContinue}>문제 풀기 <span aria-hidden="true">→</span></button>
          ) : submitted ? (
            <button type="button" className="precheck-handleSubmitAnswer" onClick={handleRetry}>다시 선택하기</button>
          ) : (
            <button type="button" className="precheck-handleSubmitAnswer" onClick={handleSubmitAnswer} disabled={!selected}>정답 확인</button>
          )}
        </div>
      </div>
    </section>
  )
}
