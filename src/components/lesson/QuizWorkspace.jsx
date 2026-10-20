import { useEffect, useState } from 'react'
import { quizQuestions } from '../../constants/dummy/challenges.js'

/** 빈칸 채우기와 객관식 레슨 문제를 진행합니다. */
export function QuizWorkspace({ onExit }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState([null, null])
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [feedback, setFeedback] = useState(null)
  const question = quizQuestions[index]

  /** 현재 문제의 답안을 채점하고 피드백을 표시합니다. */
  const handleSubmitAnswer = () => {
    const correct = question.type === 'blanks'
      ? answers[0] === question.correct[0] && answers[1] === question.correct[1]
      : selectedAnswer === question.correct
    setFeedback(correct ? 'correct' : 'wrong')
  }

  /** 피드백을 확인한 뒤 다음 문제로 이동합니다. */
  const handleNextQuestion = () => {
    if (index + 1 >= quizQuestions.length) onExit()
    else setIndex(index + 1)
    setAnswers([null, null])
    setSelectedAnswer(null)
    setFeedback(null)
  }

  useEffect(() => {
    /** 키보드 입력으로 퀴즈의 다음 단계를 진행합니다. */
    const handleKeyDown = (event) => {
      if (event.key !== 'Enter') return
      if (!feedback && (question.type === 'blanks' ? !answers.every(Boolean) : selectedAnswer === null)) return
      event.preventDefault()
      if (feedback) handleNextQuestion()
      else handleSubmitAnswer()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  return (
    <div className="quiz-workspace">
      <div className="quiz-progress">
        <button type="button" onClick={onExit}>↶</button>
        <div><span style={{ width: ((index + 1) / quizQuestions.length * 100) + '%' }} /></div>
      </div>
      <div className="quiz-main">
        <p className="quiz-prompt">{question.prompt}</p>
        {question.type === 'blanks' && (
          <div className="quiz-code">1 &lt;<u>{answers[0] || '___'}</u>&gt; Hello World &lt;/<u>{answers[1] || '___'}</u>&gt;</div>
        )}
        {question.type === 'blanks' ? question.choices.map((choices, group) => (
          <div className="quiz-options" key={group}>
            <span>빈칸 #{group + 1}</span>
            {choices.map((choice, choiceIndex) => (
              <button type="button" className={answers[group] === choice ? 'chosen' : ''} key={choice + choiceIndex} onClick={() => setAnswers((previous) => previous.map((answer, position) => position === group ? choice : answer))}>
                <small>{group * 3 + choiceIndex + 1}</small>{choice}
              </button>
            ))}
          </div>
        )) : (
          <div className="quiz-options">
            {question.choices.map((choice, choiceIndex) => (
              <button type="button" className={selectedAnswer === choice ? 'chosen' : ''} key={choice} onClick={() => setSelectedAnswer(choice)}>
                <small>{choiceIndex + 1}</small>{choice}
              </button>
            ))}
          </div>
        )}
        {feedback && <div className={'quiz-feedback ' + feedback}>{feedback === 'correct' ? '정답입니다! 잘했어요.' : '다시 확인해 보세요. 정답: ' + (Array.isArray(question.correct) ? question.correct.join(', ') : question.correct)}</div>}
      </div>
      <div className="quiz-handleSubmitAnswer">
        <button type="button" disabled={!feedback && (question.type === 'blanks' ? !answers.every(Boolean) : selectedAnswer === null)} onClick={feedback ? handleNextQuestion : handleSubmitAnswer}>
          {feedback ? index + 1 === quizQuestions.length ? '문제로 이동' : '계속하기' : '제출 Enter ↵'}
        </button>
      </div>
    </div>
  )
}
