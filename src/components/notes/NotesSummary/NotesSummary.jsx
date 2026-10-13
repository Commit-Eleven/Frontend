import './NotesSummary.css';

/** 오답 복습 현황을 요약 카드로 표시합니다. */
function NotesSummary({ items }) {
  return (
    <section className="notes-summary" aria-label="오답 노트 학습 현황">
      {items.map((item) => (
        <article key={item.label}>
          <span aria-hidden="true">{item.icon}</span>
          <div>
            <p>{item.label}</p>
            <strong>{item.value}</strong>
            <small>{item.description}</small>
          </div>
        </article>
      ))}
    </section>
  );
}

export default NotesSummary;
