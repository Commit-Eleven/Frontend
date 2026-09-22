import { useEffect, useState } from 'react';

/** 시간 문자열을 초 단위 숫자로 변환합니다. */
function getSeconds(time) {
  const [minutes = 0, seconds = 0] = String(time ?? '00 : 00').split(':').map((value) => Number(value.trim()));
  return (minutes * 60) + seconds;
}

/** 초 단위 시간을 화면에 표시할 문자열로 변환합니다. */
function formatElapsedTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, '0')} : ${String(seconds).padStart(2, '0')}`;
}

/** 학습 세션의 풀이 시간을 1초 단위로 관리합니다. */
function useElapsedTime(initialTime, isStopped) {
  const [elapsedSeconds, setElapsedSeconds] = useState(() => getSeconds(initialTime));

  useEffect(() => {
    if (isStopped) return undefined;

    const intervalId = window.setInterval(() => setElapsedSeconds((seconds) => seconds + 1), 1000);
    return () => window.clearInterval(intervalId);
  }, [isStopped]);

  /** 새 학습 세션을 시작할 때 풀이 시간을 초기화합니다. */
  const resetElapsedTime = () => setElapsedSeconds(getSeconds(initialTime));

  return [formatElapsedTime(elapsedSeconds), resetElapsedTime];
}

export default useElapsedTime;
