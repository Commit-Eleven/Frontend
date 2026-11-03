import './ShortAnswerQuestion.css';

/** 단답형 문제. 서버 문제는 content.code 에 실행 결과를 맞힐 코드가 들어 있습니다. */
export function ShortAnswerQuestion({ code, value, onChange, disabled }) {
  return (
    <div className="practice-short-answer">
      {code && (
        <pre className="practice-short-code"><code>{code}</code></pre>
      )}
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
