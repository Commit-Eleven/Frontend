import './ProblemFeedback.css';

function feedbackDetail(type, problem, feedback) {
  if (feedback.correct) return feedback.explanation ? <p>{feedback.explanation}</p> : null;
  if (type === 'mcq' && Number.isInteger(feedback.answer))
    return <p>정답: {problem.content.choices[feedback.answer]}</p>;
  if (type === 'blank' && Array.isArray(feedback.answer))
    return (
      <p>
        정답:{' '}
        {feedback.answer.map((item) => `${item.no}번 ${item.answers?.join(' 또는 ')}`).join(' · ')}
      </p>
    );
  if (type === 'parsons' && Array.isArray(feedback.answer))
    return (
      <p>
        올바른 순서: {feedback.answer.map((index) => problem.content.fragments[index]).join(' → ')}
      </p>
    );
  if (type === 'short' && typeof feedback.answer === 'string')
    return <p>정답: {feedback.answer}</p>;
  return <p>답안을 수정한 뒤 다시 확인해 보세요.</p>;
}

export function ProblemFeedback({ type, problem, feedback }) {
  if (!feedback) return null;

  return (
    <div className={`precheck-feedback ${feedback.correct ? 'is-correct' : 'is-wrong'}`} role="status">
      <strong>{feedback.correct ? '정답이에요!' : '아직 정답이 아니에요.'}</strong>
      {feedbackDetail(type, problem, feedback)}
    </div>
  );
}
