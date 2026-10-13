import './WeakConceptList.css';

/** 최근 오답을 기준으로 복습 우선순위가 높은 개념을 표시합니다. */
function WeakConceptList({ concepts, summary }) {
  return (
    <section className="weak-concepts" aria-labelledby="weak-concepts-title">
      <header><h2 id="weak-concepts-title">오답 분석</h2></header>
      <div className="weak-concepts__stats" aria-label="오답 통계">
        {summary.map((item) => (
          <article key={item.label}>
            <span>{item.label}</span>
            <strong>{item.value}{item.label === '누적 오답' || item.label === '오답 풀이' ? '개' : ''}</strong>
          </article>
        ))}
      </div>
      <ol className="weak-concepts__list">
        {concepts.map((concept, index) => (
          <li key={concept.title}>
            <div className="weak-concepts__heading"><b>{index + 1}</b><strong>{concept.title}</strong></div>
            <div className="weak-concepts__progress" aria-label={`${concept.title} 취약도 ${concept.progress}%`}><i style={{ width: `${concept.progress}%` }} /></div>
          </li>
        ))}
      </ol>
    </section>
  );
}

export default WeakConceptList;
