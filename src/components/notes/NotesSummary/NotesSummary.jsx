import './NotesSummary.css';

/** 오답 노트의 주요 학습 수치를 카드로 표시합니다. */
function NotesSummary({ items }) {
  return (
    <section className="notes-summary" aria-label="오답 노트 요약">
      {items.map((item) => (
        <article key={item.label}>
          <strong>{item.value}</strong>
          <div><b>{item.label}</b><p>{item.description}</p></div>
        </article>
      ))}
    </section>
  );
}

export default NotesSummary;
