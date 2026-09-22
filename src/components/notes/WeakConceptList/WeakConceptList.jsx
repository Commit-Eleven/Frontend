import './WeakConceptList.css';

/** 최근 오답을 기준으로 복습 우선순위가 높은 개념을 표시합니다. */
function WeakConceptList({ concepts }) {
  return (
    <section className="weak-concepts" aria-labelledby="weak-concepts-title">
      <header><p>집중 복습</p><h2 id="weak-concepts-title">취약 개념</h2><span>최근 오답 기준</span></header>
      <ol className="weak-concepts__list">
        {concepts.map((concept, index) => (
          <li key={concept.title}>
            <div className="weak-concepts__heading"><b>{index + 1}</b><div><strong>{concept.title}</strong><span>{concept.unit} · {concept.count}회 오답</span></div><em>{concept.progress}%</em></div>
            <div className="weak-concepts__progress" aria-label={`${concept.title} 취약도 ${concept.progress}%`}><i style={{ width: `${concept.progress}%` }} /></div>
          </li>
        ))}
      </ol>
      <a href="#/learn">취약 개념 복습하기 <span>→</span></a>
    </section>
  );
}

export default WeakConceptList;
