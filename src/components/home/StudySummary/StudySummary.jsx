import './StudySummary.css';

/** 이번 주 학습 수치 요약 카드를 표시합니다. */
function StudySummary({ items }) {
  return <section className="home-summary" aria-label="학습 요약">{items.map((item) => <article key={item.label}><span className="home-summary__icon">{item.icon}</span><div><strong>{item.value}</strong><p>{item.label}</p></div></article>)}</section>;
}

export default StudySummary;
