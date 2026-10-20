/** 레슨 이론과 학습 목표, 단계별 안내를 표시합니다. */
export function LessonSidebar({ lesson, challenge, onQuiz, open, onToggleTheory }) {
  return (
    <aside className={'lesson-info' + (open ? '' : ' is-collapsed')}>
      {open ? (
        <div className="theory-content">
          <div className="theory-heading">
            <span className="theory-label">이론</span>
            {lesson.id === 'paragraphs' && <button type="button" onClick={onQuiz}>퀴즈 풀기</button>}
            <button type="button" className="panel-toggle" aria-label="이론 접기" title="이론 접기" onClick={onToggleTheory}>‹</button>
          </div>
          <h2>{lesson.title}</h2>
          <p>{challenge.theory}</p>
          <pre>{challenge.example}</pre>
          <section className="theory-practice">
            <h3>실습 목표</h3>
            <p>{challenge.instruction}</p>
          </section>
          {lesson.id === 'paragraphs' && (
            <div className="theory-quiz-section">
              <h3 className="quiz-title">복습 퀴즈</h3>
              <button type="button" className="quiz-card" onClick={onQuiz}>
                <span>3 / 3 문제</span>
                <small>단락 태그를 복습해 보세요</small>
                <b aria-hidden="true">›</b>
              </button>
            </div>
          )}
        </div>
      ) : (
        <button type="button" className="panel-toggle theory-expand" aria-label="이론 열기" title="이론 열기" onClick={onToggleTheory}>›</button>
      )}
    </aside>
  )
}
