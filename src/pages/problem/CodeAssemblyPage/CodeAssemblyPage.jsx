import { useState } from 'react';
import './CodeAssemblyPage.css';
import QuestionActions from '../../../components/question/QuestionActions/QuestionActions';
import QuestionFeedback from '../../../components/question/QuestionFeedback/QuestionFeedback';
import QuestionProgress from '../../../components/question/QuestionProgress/QuestionProgress';

function CodeAssemblyPage({ question, elapsedTime, onNext }) {
  const [placed, setPlaced] = useState([]);
  const [pool, setPool] = useState(question.codeBlocks);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(null);
  /** 선택한 코드 블록을 빈칸 목록에 추가합니다. */
  const handleBlockSelect = (block) => !status && placed.length < 5 && (setPool((items) => items.filter((item) => item !== block)), setPlaced((items) => [...items, block]));
  /** 배치한 코드 블록을 다시 코드 블록 목록으로 되돌립니다. */
  const handleBlockRemove = (block) => !status && (setPlaced((items) => items.filter((item) => item !== block)), setPool((items) => [...items, block]));
  /** 배치한 코드 블록의 순서를 채점하거나 다음 문제로 전환합니다. */
  const handleSubmit = () => {
    if (status) return onNext(status);
    if (placed.length !== 5) return;
    setStatus(placed.every((block, index) => block === question.answer[index]) ? 'correct' : 'wrong');
    setFeedback('answer');
  };

  return (
    <section className="quiz-card quiz-card--assembly" aria-label="코드 조립 문제">
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
        <ol className="assembly-slots">
          {Array.from({ length: 5 }, (_, index) => {
            const block = placed[index];
            const result = status && block ? (block === question.answer[index] ? ' placed-block--correct' : ' placed-block--wrong') : '';
            return (
              <li key={index}>
                <span>{index + 1}</span>
                {block ? (
                  <button type="button" className={`placed-block${result}`} onClick={() => handleBlockRemove(block)}>
                    {block}
                    <b>{status ? (result.includes('correct') ? '✓' : '×') : ''}</b>
                  </button>
                ) : (
                  <em>코드 블록을 드래그하여 배치하세요.</em>
                )}
              </li>
            );
          })}
        </ol>
        <div className="block-bank">
          <strong>코드 블록</strong>
          <div>
            {pool.length ? (
              pool.map((block, index) => (
                <button type="button" className={`code-block code-block--${index % 5}`} key={block} onClick={() => handleBlockSelect(block)}>
                  {block}
                </button>
              ))
            ) : (
              <small>모든 코드 블록을 배치했습니다.</small>
            )}
          </div>
        </div>
        <QuestionFeedback type={feedback} hint={question.hint} explanation={question.explanation} />
      </div>
      <QuestionActions status={status} onHint={() => setFeedback('hint')} onSubmit={handleSubmit} />
    </section>
  );
}

export default CodeAssemblyPage;
