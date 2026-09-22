import './ProblemLoadState.css';

/** 문제 API의 로딩 및 오류 상태를 표시합니다. */
function ProblemLoadState({ isLoading, error, onRetry }) {
  return (
    <section className="problem-load-state">
      {isLoading ? (
        <>
          <span className="problem-load-state__spinner" />
          <p>문제를 불러오는 중입니다.</p>
        </>
      ) : (
        <>
          <p>{error}</p>
          <button type="button" onClick={onRetry}>
            다시 시도하기
          </button>
        </>
      )}
    </section>
  );
}

export default ProblemLoadState;
