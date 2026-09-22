import { useState } from 'react';
import './SpaghettiCodePage.css';
import CodeEditor from '../../../components/question/CodeEditor/CodeEditor';
import QuestionActions from '../../../components/question/QuestionActions/QuestionActions';
import QuestionFeedback from '../../../components/question/QuestionFeedback/QuestionFeedback';
import QuestionProgress from '../../../components/question/QuestionProgress/QuestionProgress';
import useCodeRunner from '../../../hooks/useCodeRunner';

/** 동작을 유지하며 가독성 낮은 코드를 개선하는 문제를 렌더링합니다. */
function SpaghettiCodePage({ question, elapsedTime, onNext }) {
  const [source, setSource] = useState(question.starterCode);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(null);
  const [notice, setNotice] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { runCode, runResult, resetResult } = useCodeRunner();

  /** 코드가 수정되면 이전 실행 결과를 초기화합니다. */
  const handleSourceChange = (value) => {
    setSource(value);
    resetResult();
  };

  /** 개선한 코드를 테스트 입력값으로 실행하고 결과를 표시합니다. */
  const handleRun = () => {
    setNotice(null);
    runCode(source, question.testInput);
  };

  /** 제출한 코드의 동작을 검사하고 채점 결과를 표시합니다. */
  const handleSubmit = () => {
    if (status) return onNext(status);
    setNotice(null);
    setIsSubmitting(true);
    runCode(source, question.testInput, (result) => {
      setIsSubmitting(false);
      setStatus(result.status === 'success' && result.output === JSON.stringify(question.expectedOutput) ? 'correct' : 'wrong');
      setFeedback('answer');
      if (result.status === 'error') setNotice(`실행 오류: ${result.output}`);
    });
  };

  return (
    <section className="quiz-card quiz-card--spaghetti" aria-label="스파게티 코드 소생 문제">
      <QuestionProgress current={question.current} total={question.total} unit={question.unit} elapsedTime={elapsedTime} />
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
        <section className="spaghetti-editors" aria-label="코드 비교">
          <article className="spaghetti-editor-card spaghetti-editor-card--original">
            <header><strong>개선 전</strong></header>
            <CodeEditor label="개선 전 코드" value={question.originalCode} language={question.language} readOnly showLabel={false} showTestInput={false} minHeight="270px" />
          </article>
          <article className="spaghetti-editor-card spaghetti-editor-card--solution">
            <header><strong>개선 후</strong></header>
            <CodeEditor label="개선한 코드" value={source} onChange={handleSourceChange} language={question.language} onRun={handleRun} isRunning={runResult.status === 'running'} isRunDisabled={Boolean(status) || isSubmitting} readOnly={Boolean(status) || isSubmitting} showLabel={false} showTestInput={false} minHeight="270px" />
          </article>
        </section>
        <p className="spaghetti-test-input"><span>테스트 입력값</span><code>{JSON.stringify(question.testInput)}</code><small>제출 시 자동으로 테스트합니다.</small></p>
        {runResult.status !== 'idle' && (
          <output className={`spaghetti-run-result spaghetti-run-result--${runResult.status}`}>
            {runResult.status === 'success' ? `실행 결과: ${runResult.output}` : `실행 오류: ${runResult.output}`}
          </output>
        )}
        {notice && <p className="code-question-notice">{notice}</p>}
        <QuestionFeedback type={feedback} hint={question.hint} explanation={status === 'correct' ? question.explanation : '동작 결과가 기존 코드의 기대값과 다릅니다. 함수와 반환값을 다시 확인해보세요.'} />
      </div>
      <QuestionActions status={status} isSubmitting={isSubmitting} onHint={() => setFeedback('hint')} onSubmit={handleSubmit} />
    </section>
  );
}

export default SpaghettiCodePage;
