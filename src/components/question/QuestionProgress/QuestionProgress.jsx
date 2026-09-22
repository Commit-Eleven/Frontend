import './QuestionProgress.css';
import clockIcon from '../../../assets/images/clockIcon.svg';

/** 문항의 현재 진행 상태와 풀이 시간을 표시합니다. */
function QuestionProgress({ current, total, unit, elapsedTime = '00 : 00' }) {
  const stageTotal = Math.max(Number(unit?.total ?? total) || 1, 1);
  const stageCurrent = Math.min(Math.max(Number(unit?.index ?? current) || 1, 1), stageTotal);
  const progress = `${(stageCurrent / stageTotal) * 100}%`;

  return (
    <header className="quiz-progress">
      <span>
        문제 {stageCurrent} / {stageTotal}
      </span>
      <div className="quiz-progress__time">
        <img src={clockIcon} alt="시계 아이콘" />
        풀이시간 {elapsedTime}
      </div>
      <div className="quiz-progress__track">
        <i style={{ width: progress }} />
      </div>
    </header>
  );
}

export default QuestionProgress;
