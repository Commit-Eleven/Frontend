import './IncorrectProblemCard.css';

/** 오답 문제의 답안 비교와 재학습 동선을 표시합니다. */
function IncorrectProblemCard({ problem, index }) {
  return (
    <article className="incorrect-problem-card">
      <div className="incorrect-problem-card__order" aria-hidden="true">{String(index + 1).padStart(2, '0')}</div>
      <div className="incorrect-problem-card__body">
        <div className="incorrect-problem-card__meta"><span>{problem.type}</span><span>{problem.unit}</span><time>{problem.date}</time></div>
        <h3>{problem.title}</h3>
        <div className="incorrect-problem-card__answers">
          <p><small>내 답</small><b>{problem.wrongAnswer}</b></p>
          <span aria-hidden="true">→</span>
          <p><small>정답</small><strong>{problem.correctAnswer}</strong></p>
        </div>
      </div>
      <a href="#/learn" aria-label={`${problem.title} 다시 풀기`}>다시 풀기 <span>→</span></a>
    </article>
  );
}

export default IncorrectProblemCard;
