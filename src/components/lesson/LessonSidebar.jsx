import './LessonSidebar.css';

export function LessonSidebar({ lesson, challenge }) {
  return (
    <aside className="lesson-info">
      <div className="theory-content">
        <div className="theory-heading">
          <span className="theory-label">이론</span>
        </div>
        <h2>{lesson.title}</h2>
        <p>{challenge.theory}</p>
        <pre>{challenge.example}</pre>
        <section className="theory-practice">
          <h3>실습 목표</h3>
          <p>{challenge.instruction}</p>
        </section>
      </div>
    </aside>
  );
}
