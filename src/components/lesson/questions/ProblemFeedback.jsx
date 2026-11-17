import './ProblemFeedback.css';

function feedbackDetail(feedback) {
  if (feedback.correct) return feedback.explanation ? <p>{feedback.explanation}</p> : null;
  return <p>오답 노트에서 다시 풀어볼 수 있어요.</p>;
}

export function ProblemFeedback({ feedback }) {
  if (!feedback) return null;

  return (
    <div className={`precheck-feedback ${feedback.correct ? 'is-correct' : 'is-wrong'}`} role="status">
      <strong>{feedback.correct ? '정답이에요!' : '오답이에요.'}</strong>
      {feedbackDetail(feedback)}
    </div>
  );
}
