import './QuestionActions.css';

/** 힌트 보기와 제출·다음 문항 이동 버튼을 표시합니다. */
function QuestionActions({ onHint, onSubmit, status, isSubmitting = false }) {
  const isComplete = status === 'correct' || status === 'wrong';
  return (
    <div className="quiz-actions">
      {!isComplete && (
        <button type="button" className="quiz-actions__hint" onClick={onHint} disabled={isSubmitting}>
          힌트보기
        </button>
      )}
      <button type="button" className="quiz-actions__next" onClick={onSubmit} disabled={isSubmitting}>
        {isSubmitting ? '채점 중...' : isComplete ? '다음으로' : '제출하기'}
      </button>
    </div>
  );
}

export default QuestionActions;
