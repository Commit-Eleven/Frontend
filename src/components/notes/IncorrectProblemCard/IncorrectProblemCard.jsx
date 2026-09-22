import './IncorrectProblemCard.css';

/** 오답 문제의 핵심 정보와 다시 풀기 동작을 표시합니다. */
function IncorrectProblemCard({ problem }) {
  return (
    <article className="incorrect-problem-card">
      <div className="incorrect-problem-card__top"><span>{problem.type}</span><time>{problem.date}</time></div>
      <h3>{problem.title}</h3>
      <p>{problem.unit}</p>
      <div className="incorrect-problem-card__answers">
        <div><small>내 답</small><b>{problem.wrongAnswer}</b></div>
        <i>→</i>
        <div><small>정답</small><strong>{problem.correctAnswer}</strong></div>
      </div>
      <a href="#/learn">다시 풀기 <span>→</span></a>
    </article>
  );
}

export default IncorrectProblemCard;
