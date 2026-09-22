import './StudyCompletePage.css';

/** 전체 문항 풀이가 끝났을 때 학습 결과와 다음 행동을 안내합니다. */
function StudyCompletePage({ correctCount, totalCount, onRestart, onGoHome }) {
  const accuracy = Math.round((correctCount / totalCount) * 100);
  const experience = correctCount * 32;
  const incorrectCount = totalCount - correctCount;

  return (
    <section className="study-complete" aria-label="학습 완료 결과">
      <p className="study-complete__eyebrow">학습 완료</p>
      <h1>총 경험치 <b>{experience}</b> 획득!</h1>
      <div className="study-complete__summary">
        <div className="study-complete__chart" style={{ '--progress': `${accuracy * 3.6}deg` }} aria-label={`정답률 ${accuracy}%`}>
          <div><b>{accuracy}%</b><span>정답률</span></div>
        </div>
        <dl>
          <div><dt>푼 문제</dt><dd>{totalCount}문제</dd></div>
          <div><dt>정답</dt><dd>{correctCount} / {totalCount}</dd></div>
          <div><dt>정답률</dt><dd>{accuracy}%</dd></div>
        </dl>
      </div>
      <section className="study-complete__notes">
        <div>
          <strong>오답 노트</strong>
          <p>{incorrectCount ? `${incorrectCount}개의 문제를 다시 풀어보며 약한 개념을 정리해보세요.` : '모든 문제를 맞혔어요. 오늘 학습을 완벽하게 마쳤습니다!'}</p>
        </div>
        <a href="#/notes">오답 노트 보기</a>
      </section>
      <div className="study-complete__actions">
        <button type="button" className="study-complete__restart" onClick={onRestart}>다시 풀기</button>
        <button type="button" className="study-complete__home" onClick={onGoHome}>홈으로</button>
      </div>
    </section>
  );
}

export default StudyCompletePage;
