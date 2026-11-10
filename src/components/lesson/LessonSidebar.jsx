import './LessonSidebar.css';

export function LessonSidebar({ lesson, challenge, codeMode = false, codeProblem }) {
  if (codeMode) {
    return (
      <aside className="lesson-info">
        <div className="theory-content">
          <div className="theory-heading"><span className="theory-label">코드 실습</span></div>
          <h2>{codeProblem?.title || '코드 작성'}</h2>
          {codeProblem && <section className="theory-practice">
            <h3>실습 목표</h3>
            <p className="code-problem-description">{codeProblem.description || '문제에 맞는 코드를 작성하고 제출하세요.'}</p>
          </section>}
        </div>
      </aside>
    );
  }

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
