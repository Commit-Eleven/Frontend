import './FillBlankQuestion.css';

export function FillBlankQuestion({ problem, values, onChange, disabled }) {
  return (
    <>
      <div className="practice-code-sample">
        <code>
          {problem.content.template.split(/(\{\{\d+\}\})/g).map((part, index) => {
            const match = /^\{\{(\d+)\}\}$/.exec(part);
            if (!match) return <span key={index}>{part}</span>;
            const no = Number(match[1]);
            const blank = problem.content.blanks.find((item) => item.no === no);

            return (
              <input
                key={index}
                aria-label={`${no}번 빈칸${blank?.hint ? `, ${blank.hint}` : ''}`}
                value={values[no] ?? ''}
                onChange={(event) => onChange({ ...values, [no]: event.target.value })}
                disabled={disabled}
                autoComplete="off"
                spellCheck={false}
                style={{ width: `${Math.max(8, String(values[no] ?? '').length + 2)}ch` }}
              />
            );
          })}
        </code>
      </div>
      <p className="practice-help">{problem.hint || '각 빈칸에 들어갈 코드를 입력하세요.'}</p>
    </>
  );
}
