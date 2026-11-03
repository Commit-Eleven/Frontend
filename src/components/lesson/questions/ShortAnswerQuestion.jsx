import './ShortAnswerQuestion.css';

export function ShortAnswerQuestion({ value, onChange, disabled }) {
  return (
    <div className="practice-short-answer">
      <label htmlFor="practice-short-answer">답안</label>
      <input
        id="practice-short-answer"
        type="text"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        autoComplete="off"
      />
    </div>
  );
}
