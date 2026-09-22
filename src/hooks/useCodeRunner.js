import { useCallback, useEffect, useRef, useState } from 'react';

const executionWorker = `
  self.onmessage = ({ data }) => {
    try {
      const execute = new Function('input', data.source + '\\nreturn solve(input);');
      const output = execute(data.input);
      self.postMessage({ type: 'success', output: JSON.stringify(output) });
    } catch (error) {
      self.postMessage({ type: 'error', output: error.message });
    }
  };
`;

/** 브라우저 Worker에서 사용자가 작성한 JavaScript 코드를 실행합니다. */
function useCodeRunner() {
  const workerRef = useRef(null);
  const timeoutRef = useRef(null);
  const [runResult, setRunResult] = useState({ status: 'idle', output: '' });

  /** 실행 중인 Worker와 제한 시간을 해제합니다. */
  const clearExecution = useCallback(() => {
    workerRef.current?.terminate();
    workerRef.current = null;
    window.clearTimeout(timeoutRef.current);
    timeoutRef.current = null;
  }, []);

  /** 코드와 테스트 입력값을 Worker에 전달해 실행합니다. */
  const runCode = useCallback((source, input, onComplete) => {
    clearExecution();
    setRunResult({ status: 'running', output: '' });

    const workerUrl = URL.createObjectURL(new Blob([executionWorker], { type: 'text/javascript' }));
    const worker = new Worker(workerUrl);
    workerRef.current = worker;

    worker.onmessage = ({ data }) => {
      clearExecution();
      URL.revokeObjectURL(workerUrl);
      const nextResult = { status: data.type, output: data.output };
      setRunResult(nextResult);
      onComplete?.(nextResult);
    };
    worker.onerror = () => {
      clearExecution();
      URL.revokeObjectURL(workerUrl);
      const nextResult = { status: 'error', output: '코드를 실행하지 못했습니다.' };
      setRunResult(nextResult);
      onComplete?.(nextResult);
    };
    timeoutRef.current = window.setTimeout(() => {
      clearExecution();
      URL.revokeObjectURL(workerUrl);
      const nextResult = { status: 'error', output: '실행 시간이 초과되었습니다.' };
      setRunResult(nextResult);
      onComplete?.(nextResult);
    }, 1500);
    worker.postMessage({ source, input });
  }, [clearExecution]);

  /** 이전 실행 결과를 지우고 새 코드 입력을 준비합니다. */
  const resetResult = useCallback(() => {
    clearExecution();
    setRunResult({ status: 'idle', output: '' });
  }, [clearExecution]);

  useEffect(() => clearExecution, [clearExecution]);

  return { runCode, runResult, resetResult };
}

export default useCodeRunner;
