import './WeakConceptList.css';

/** 최근 오답을 기준으로 복습이 필요한 개념을 표시합니다. */
function WeakConceptList({ concepts }) {
  return (
    <section className="weak-concepts" aria-labelledby="weak-concepts-title">
      <header><p>집중 복습</p><h2 id="weak-concepts-title">취약 개념</h2></header>
      <div className="weak-concepts__list">
        {concepts.map((concept) => (
          <article key={concept.title}>
            <div><strong>{concept.title}</strong><span>최근 {concept.count}회 오답</span></div>
            <div className="weak-concepts__progress" aria-label={`${concept.title} 취약도 ${concept.progress}%`}><i style={{ width: `${concept.progress}%` }} /></div>
          </article>
        ))}
      </div>
      <a href="#/learn">취약 개념 복습하기 <span>→</span></a>
    </section>
  );
}

export default WeakConceptList;
