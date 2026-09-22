import { useCallback, useEffect, useState } from 'react';
import { getMultipleChoiceProblem } from '../api/problemApi';

/** 객관식 문제 조회 상태와 재시도 함수를 관리합니다. */
function useMultipleChoiceProblem(isEnabled, fallbackProblem) {
  const [problem, setProblem] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isUsingFallback, setIsUsingFallback] = useState(false);

  const fetchProblem = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      setProblem(await getMultipleChoiceProblem());
      setIsUsingFallback(false);
    } catch {
      setProblem(fallbackProblem);
      setIsUsingFallback(true);
    } finally {
      setIsLoading(false);
    }
  }, [fallbackProblem]);

  useEffect(() => {
    if (!isEnabled) return undefined;

    let isCancelled = false;
    async function loadInitialProblem() {
      try {
        const nextProblem = await getMultipleChoiceProblem();
        if (!isCancelled) {
          setProblem(nextProblem);
          setIsUsingFallback(false);
        }
      } catch {
        if (!isCancelled) {
          setProblem(fallbackProblem);
          setIsUsingFallback(true);
        }
      }
    }

    loadInitialProblem();
    return () => { isCancelled = true; };
  }, [fallbackProblem, isEnabled]);

  return { problem, isLoading, error, isUsingFallback, fetchProblem };
}

export default useMultipleChoiceProblem;
