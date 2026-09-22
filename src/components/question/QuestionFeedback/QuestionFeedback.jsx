import './QuestionFeedback.css';

/** 문항의 힌트 또는 채점 후 해설을 표시합니다. */
function QuestionFeedback({ type, hint, explanation }) {
  if (!type) return null;
  return (
    <aside className="quiz-feedback">
      <strong>{type === 'hint' ? '힌트' : '해설'}</strong>
      <p>{type === 'hint' ? hint : explanation}</p>
    </aside>
  );
}

export default QuestionFeedback;
