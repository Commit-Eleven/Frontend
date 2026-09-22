import './RecentLearning.css';

/** 최근 학습한 문제와 점수를 표시합니다. */
function RecentLearning({ records }) {
  return <section className="home-section home-section--records"><div className="home-section__header"><div><p className="home-section__eyebrow">최근 기록</p><h2>최근 학습한 문제</h2></div><a href="#/profile">학습 기록</a></div><div className="home-records">{records.map((record) => <article key={record.title}><div className="home-records__check">✓</div><div><strong>{record.title}</strong><p>{record.time}</p></div><b>{record.score}</b></article>)}</div></section>;
}

export default RecentLearning;
