import './IncorrectProblemCard.css';

/** 오답 문제의 답안 비교와 재학습 동선을 표시합니다. */
function IncorrectProblemCard({ problem }) {
  return (
    <article className="incorrect-problem-card">
      <a href="#/learn" aria-label={`${problem.title} 다시 풀기`}>
        <div className="incorrect-problem-card__body">
          <h3>{problem.title}</h3>
          <span>{problem.unit}</span>
        </div>
      </a>
    </article>
  );
}

export default IncorrectProblemCard;
