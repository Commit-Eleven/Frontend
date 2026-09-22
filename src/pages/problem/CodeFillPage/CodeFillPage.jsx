import { useState } from 'react';
import './CodeFillPage.css';
import CodeEditor from '../../../components/question/CodeEditor/CodeEditor';
import QuestionActions from '../../../components/question/QuestionActions/QuestionActions';
import QuestionFeedback from '../../../components/question/QuestionFeedback/QuestionFeedback';
import QuestionProgress from '../../../components/question/QuestionProgress/QuestionProgress';

/** 코드 조각 사이에 빈칸 토큰을 넣어 읽기 전용 지문 코드를 생성합니다. */
function getPreviewCode(question) {
  return question.codeParts.map((part, index) => `${part}${index < question.answers.length ? `__BLANK_${index + 1}__` : ''}`).join('');
}

function CodeFillPage({ question, elapsedTime, onNext }) {
  const [answers, setAnswers] = useState(() => question.answers.map(() => ''));
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(null);
  const previewCode = getPreviewCode(question);
  /** 빈칸 입력값을 업데이트합니다. */
  const handleAnswerChange = (index, value) => !status && setAnswers((items) => items.map((item, itemIndex) => (itemIndex === index ? value : item)));
  /** 입력한 빈칸 답안을 채점하거나 다음 문제로 전환합니다. */
  const handleSubmit = () => {
    if (status) return onNext(status);
    if (!answers.every(Boolean)) return;
    setStatus(answers.every((answer, index) => answer === question.answers[index]) ? 'correct' : 'wrong');
    setFeedback('answer');
  };

  return (
    <section className="quiz-card quiz-card--fill" aria-label="빈칸 채우기 문제">
      <QuestionProgress current={question.current} total={question.total} unit={question.unit} elapsedTime={elapsedTime} />
      <div className="quiz-body">
        <p className="quiz-question">
          {question.text.split('\n').map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <CodeEditor label="문제 코드" value={previewCode} language={question.language ?? 'python'} readOnly showLabel={false} showTestInput={false} fitContent showBlankTokens className="code-fill-editor" />
        <div className="fill-fields">
          {answers.map((answer, index) => {
            const result = status && (answer === question.answers[index] ? ' fill-field--correct' : ' fill-field--wrong');
            return (
              <label className={`fill-field${result || ''}`} key={index}>
                <span>빈칸 {index + 1}</span>
                <input value={answer} placeholder="코드를 입력하세요" onChange={(event) => handleAnswerChange(index, event.target.value)} disabled={Boolean(status)} />
                {status && <b>{result.includes('correct') ? '✓' : '×'}</b>}
              </label>
            );
          })}
        </div>
        <QuestionFeedback type={feedback} hint={question.hint} explanation={question.explanation} />
      </div>
      <QuestionActions status={status} onHint={() => setFeedback('hint')} onSubmit={handleSubmit} />
    </section>
  );
}

export default CodeFillPage;
