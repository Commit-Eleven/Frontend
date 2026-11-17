import './TestPanel.css';

export function TestPanel({ result, submitting, error, authRequired, onLogin, open, onToggle }) {
  return (
    <div className={'test-panel ' + (!open ? 'collapsed' : '')}>
      <div className="test-tabs">
        <span className="current">채점 결과</span>
        <button type="button" className="collapse-button" onClick={onToggle} aria-label={open ? '채점 결과 접기' : '채점 결과 펼치기'}>
          {open ? '⌄' : '⌃'}
        </button>
      </div>
      {open && <div className="test-content" aria-live="polite" aria-busy={submitting}>
        {submitting ? <p className="code-grade-message" role="status">코드를 채점하고 있어요…</p>
          : error ? <div className="test-case failed" role="alert">
            <p className="code-grade-message">{error}</p>
            {authRequired && <button type="button" className="code-grade-login" onClick={onLogin}>Google로 로그인</button>}
          </div>
          : result ? <div className={'test-case ' + (result.correct ? 'passed' : 'failed')}>
            <div className="code-grade-summary">
              <strong>{result.correct ? '통과' : '다시 확인해 주세요'}</strong>
              <span>{result.passed} / {result.total}개 기준 통과</span>
            </div>
            {result.failed.length > 0 && <ul className="code-grade-failures">
              {result.failed.map((message, index) => <li key={index}>{message}</li>)}
            </ul>}
          </div>
          : <p className="code-grade-message">코드를 제출하면 채점 결과를 확인할 수 있어요.</p>}
      </div>}
    </div>
  );
}
