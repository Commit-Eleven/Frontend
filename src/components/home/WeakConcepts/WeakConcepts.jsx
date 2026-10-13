import './WeakConcepts.css';

/** 오답 노트에서 다시 학습할 개념 목록을 표시합니다. */
function WeakConcepts({ concepts }) {
  return <section className="home-section home-section--weak"><div className="home-section__header"><div><p className="home-section__eyebrow">오답 노트</p><h2>다시 풀어볼 개념</h2></div><a href="#/notes">오답 노트</a></div>{concepts.map((concept) => <div className="home-weak-card" key={concept.title}><span>!</span><div><strong>{concept.title}</strong><p>{concept.detail}</p></div><a href="#/learn" aria-label={`${concept.title} 학습하기`}>→</a></div>)}</section>;
}

export default WeakConcepts;
