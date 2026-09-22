import './NotesHero.css';

/** 오늘 복습해야 할 오답 수와 학습 시작 동선을 표시합니다. */
function NotesHero({ reviewCount }) {
  return (
    <section className="notes-hero" aria-labelledby="notes-hero-title">
      <div className="notes-hero__copy">
        <p>오답 노트</p>
        <h1 id="notes-hero-title">틀린 문제를 다시 풀고<br />내 것으로 만들어보세요.</h1>
        <span>오답을 복습하면 같은 유형의 문제를 더 빠르게 풀 수 있어요.</span>
      </div>
      <div className="notes-hero__review">
        <div className="notes-hero__review-count"><b>{reviewCount}</b><span>문제</span></div>
        <p>오늘 복습할 오답</p>
        <a href="#/learn">복습 시작하기 <span>→</span></a>
      </div>
    </section>
  );
}

export default NotesHero;
