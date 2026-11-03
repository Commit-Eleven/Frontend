import './QuestionOptions.css';

/** 객관식 답안 목록을 일관된 선택 UI로 표시합니다. */
export function QuestionOptions({
  choices,
  selectedIndex,
  correctChoiceIndex = -1,
  showResult = false,
  isCorrect = false,
  onSelect,
  disabled = false,
}) {
  return (
    <div className="precheck-options" role="radiogroup" aria-label="답 선택">
      {choices.map((choice, index) => {
        const chosen = selectedIndex === index;
        const correct = showResult && (index === correctChoiceIndex || (isCorrect && chosen));
        const wrong = showResult && !isCorrect && chosen;

        return (
          <button
            type="button"
            role="radio"
            aria-checked={chosen}
            key={`${index}:${choice}`}
            className={[
              'precheck-option',
              chosen && 'is-selected',
              correct && 'is-correct',
              wrong && 'is-wrong',
            ]
              .filter(Boolean)
              .join(' ')}
            onClick={() => onSelect(index)}
            disabled={disabled}
          >
            <span className="precheck-option-number">{index + 1}</span>
            <code>{choice}</code>
            {correct && <span className="precheck-result-icon" aria-label="정답">✓</span>}
            {wrong && <span className="precheck-result-icon" aria-label="오답">×</span>}
          </button>
        );
      })}
    </div>
  );
}
