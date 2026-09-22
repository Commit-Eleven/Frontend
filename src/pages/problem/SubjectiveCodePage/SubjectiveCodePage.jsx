import { useState } from 'react';
import './SubjectiveCodePage.css';
import CodeEditor from '../../../components/question/CodeEditor/CodeEditor';
import QuestionActions from '../../../components/question/QuestionActions/QuestionActions';
import QuestionFeedback from '../../../components/question/QuestionFeedback/QuestionFeedback';
import QuestionProgress from '../../../components/question/QuestionProgress/QuestionProgress';
import useCodeRunner from '../../../hooks/useCodeRunner';

/** 사용자가 함수를 작성하고 테스트 입력값으로 실행하는 주관식 코딩 문제입니다. */
function SubjectiveCodePage({ question, onNext }) {
  const [source, setSource] = useState(question.starterCode);
  const [feedback, setFeedback] = useState(null);
  const [status, setStatus] = useState(null);
  const [notice, setNotice] = useState(null);
  const { runCode, runResult, resetResult } = useCodeRunner();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const canRunInBrowser = (question.language ?? 'javascript').toLowerCase() === 'javascript';

  /** 코드가 수정되면 이전 실행 결과를 초기화합니다. */
  const handleSourceChange = (value) => {
    setSource(value);
    resetResult();
  };

  /** 실행 완료 결과를 바탕으로 작성한 코드를 채점합니다. */
  const handleRunComplete = (result) => {
    setIsSubmitting(false);
    setStatus(result.status === 'success' && result.output === JSON.stringify(question.expectedOutput) ? 'correct' : 'wrong');
    setFeedback('answer');
    if (result.status === 'error') setNotice(`실행 오류: ${result.output}`);
  };

  /** 작성 중인 코드를 테스트 입력값으로 실행하고 결과를 표시합니다. */
  const handleRun = () => {
    if (!canRunInBrowser) {
      setNotice('Python과 Java 실행은 서버 코드 실행 API 연결 후 지원됩니다.');
      return;
    }

    setNotice(null);
    runCode(source, question.testInput);
  };

  /** 작성한 코드를 실행·채점하거나 다음 문제로 이동합니다. */
  const handleSubmit = () => {
    if (status) return onNext(status);
    if (!canRunInBrowser) {
      setNotice('Python과 Java 답안 채점은 서버 코드 실행 API 연결 후 지원됩니다.');
      return;
    }
    setNotice(null);
    setIsSubmitting(true);
    runCode(source, question.testInput, handleRunComplete);
  };

  return (
    <section className="quiz-card quiz-card--subjective" aria-label="주관식 코드 작성 문제">
      <QuestionProgress current={question.current} total={question.total} unit={question.unit} elapsedTime={question.elapsedTime} isStopped={Boolean(status)} />
      <div className="quiz-body">
        <p className="quiz-question">{question.text}</p>
        <section className="question-requirements" aria-label="문제 조건">
          <strong>조건</strong>
          <ul>
            {question.requirements.map((requirement) => (
              <li key={requirement}>{requirement}</li>
            ))}
          </ul>
        </section>
        <CodeEditor label="코드 작성" value={source} onChange={handleSourceChange} language={question.language} readOnly={Boolean(status) || isSubmitting} showLabel={false} showTestInput={false} />
        <div className="code-execution">
          <div><span>테스트 입력값</span><code>{JSON.stringify(question.testInput)}</code></div>
          <button type="button" onClick={handleRun} disabled={Boolean(status) || isSubmitting || runResult.status === 'running'}>
            {runResult.status === 'running' ? '실행 중...' : '실행하기'}
          </button>
        </div>
        {runResult.status !== 'idle' && (
          <output className={`code-execution__result code-execution__result--${runResult.status}`}>
            {runResult.status === 'success' ? `실행 결과: ${runResult.output}` : `실행 오류: ${runResult.output}`}
          </output>
        )}
        {notice && <p className="code-question-notice">{notice}</p>}
        <QuestionFeedback type={feedback} hint={question.hint} explanation={status === 'correct' ? question.explanation : '테스트 결과가 기대한 값과 다릅니다. 조건을 다시 확인해보세요.'} />
      </div>
      <QuestionActions status={status} isSubmitting={isSubmitting} onHint={() => setFeedback('hint')} onSubmit={handleSubmit} />
    </section>
  );
}

export default SubjectiveCodePage;
