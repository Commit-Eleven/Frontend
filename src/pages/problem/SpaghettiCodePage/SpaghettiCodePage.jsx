import { useState } from 'react';
import './SpaghettiCodePage.css';
import CodeEditor from '../../../components/question/CodeEditor/CodeEditor';
import QuestionActions from '../../../components/question/QuestionActions/QuestionActions';
import QuestionFeedback from '../../../components/question/QuestionFeedback/QuestionFeedback';
import QuestionProgress from '../../../components/question/QuestionProgress/QuestionProgress';
import useCodeRunner from '../../../hooks/useCodeRunner';

/** 동작을 유지하며 가독성 낮은 코드를 개선하는 문제를 렌더링합니다. */
function SpaghettiCodePage({ question, onNext }) {
  const [source, setSource] = useState(question.starterCode);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(null);
  const [notice, setNotice] = useState(null);
  const { runCode, runResult, resetResult } = useCodeRunner();

  /** 코드가 수정되면 이전 실행 결과를 초기화합니다. */
  const handleSourceChange = (value) => {
    setSource(value);
    resetResult();
  };

  /** 개선한 코드의 기존 동작을 테스트합니다. */
  const handleRun = () => {
    setNotice(null);
    runCode(source, question.testInput);
  };

  /** 실행 결과가 기존 동작과 같으면 개선 답안을 제출합니다. */
  const handleSubmit = () => {
    if (status) return onNext(status);
    if (runResult.status !== 'success') {
      setNotice('제출하기 전에 개선한 코드를 실행해보세요.');
      return;
    }
    setStatus(runResult.output === JSON.stringify(question.expectedOutput) ? 'correct' : 'wrong');
    setFeedback('answer');
  };

  return (
    <section className="quiz-card quiz-card--spaghetti" aria-label="스파게티 코드 소생 문제">
      <QuestionProgress current={question.current} total={question.total} unit={question.unit} elapsedTime={question.elapsedTime} isStopped={Boolean(status)} />
      <div className="quiz-body">
        <p className="quiz-question">{question.text}</p>
        <section className="question-requirements" aria-label="개선 조건">
          <strong>개선 조건</strong>
          <ul>
            {question.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </section>
        <div className="spaghetti-editors">
          <CodeEditor label="개선 전 코드" value={question.originalCode} language={question.language} readOnly minHeight="270px" />
          <CodeEditor label="개선한 코드" value={source} onChange={handleSourceChange} language={question.language} testInput={question.testInput} readOnly={Boolean(status)} minHeight="270px" />
        </div>
        <div className="code-runner">
          <button type="button" onClick={handleRun} disabled={runResult.status === 'running' || Boolean(status)}>
            {runResult.status === 'running' ? '실행 중...' : '동작 확인하기'}
          </button>
          {runResult.status !== 'idle' && (
            <pre className={`code-runner__result code-runner__result--${runResult.status}`}>
              <code>{runResult.status === 'success' ? `실행 결과: ${runResult.output}` : runResult.output}</code>
            </pre>
          )}
        </div>
        {notice && <p className="code-question-notice">{notice}</p>}
        <QuestionFeedback type={feedback} hint={question.hint} explanation={status === 'correct' ? question.explanation : '동작 결과가 기존 코드의 기대값과 다릅니다. 함수와 반환값을 다시 확인해보세요.'} />
      </div>
      <QuestionActions status={status} onHint={() => setFeedback('hint')} onSubmit={handleSubmit} />
    </section>
  );
}

export default SpaghettiCodePage;
