import { useState } from 'react';
import './CodeFillPage.css';
import CodeBlock from '../../../components/question/CodeBlock/CodeBlock';
import QuestionActions from '../../../components/question/QuestionActions/QuestionActions';
import QuestionFeedback from '../../../components/question/QuestionFeedback/QuestionFeedback';
import QuestionProgress from '../../../components/question/QuestionProgress/QuestionProgress';

function CodeFillPage({ question, onNext }) {
  const [answers, setAnswers] = useState(() => question.answers.map(() => ''));
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(null);
  const codeContent = [question.codeParts[0], <mark key="first">①</mark>, question.codeParts[1], <mark key="second">②</mark>, question.codeParts[2], <mark key="third">③</mark>, question.codeParts[3]];
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
      <QuestionProgress current={question.current} total={question.total} unit={question.unit} elapsedTime={question.elapsedTime} isStopped={Boolean(status)} />
      <div className="quiz-body">
        <p className="quiz-question">
          {question.text.split('\n').map((line) => (
            <span key={line}>
              {line}
              <br />
            </span>
          ))}
        </p>
        <CodeBlock className="quiz-code--fill" code={question.codeParts.join('')} lineCount={question.codeParts.join('').split('\n').length}>
          {codeContent}
        </CodeBlock>
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
