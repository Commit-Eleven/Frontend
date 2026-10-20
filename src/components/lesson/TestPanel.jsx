/** 코드 실행 결과와 예상 출력을 표시합니다. */
export function TestPanel({ checks, tests, tab, onTabChange, open, onToggle }) {
  const cases = tests || checks.map((check) => ({ ...check, actual: '', passed: null }))
  const answer = checks.map((check) => check.exists
    ? '<' + check.selector + '>'
    : '<' + check.selector + '>' + check.expected + '</' + check.selector + '>'
  ).join('\n')

  return (
    <div className={'test-panel ' + (!open ? 'collapsed' : '')}>
      <div className="test-tabs">
        <button type="button" className={tab === 'tests' ? 'current' : ''} onClick={() => onTabChange('tests')}>테스트 케이스</button>
        <button type="button" className={tab === 'answer' ? 'current' : ''} onClick={() => onTabChange('answer')}>정답</button>
        <button type="button" className="collapse-button" onClick={onToggle}>{open ? '⌄' : '⌃'}</button>
      </div>
      {open && (tab === 'tests' ? (
        <div className="test-content">
          {cases.map((test, index) => (
            <div className={'test-case ' + (test.passed === null ? 'pending' : test.passed ? 'passed' : 'failed')} key={index}>
              <div className="test-case-top">
                <b>#{index + 1}</b>
                <span>XPath = //{test.selector}[{(test.index || 0) + 1}] {test.exists ? '태그 존재' : '요소의 내부 텍스트'}</span>
                <strong className="test-status" aria-label={test.passed === null ? '실행 전' : test.passed ? '통과' : '실패'}>
                  <span aria-hidden="true">{test.passed === null ? '○' : test.passed ? '✓' : '×'}</span>
                  {test.passed === null ? '실행 전' : test.passed ? '통과' : '실패'}
                </strong>
              </div>
              <div className="test-outputs">
                <div><small>실제 출력</small><code>{test.passed === null ? '실행 전' : test.actual || '출력 없음'}</code></div>
                <div><small>예상 출력</small><code>{test.expected}</code></div>
              </div>
              {test.passed === false && (
                <p className="test-case-feedback">
                  {test.exists && test.actual === '태그 없음' ? '필요한 태그를 찾지 못했어요.' : !test.actual ? '요소를 찾지 못했거나 내용이 비어 있어요.' : '실제 출력과 예상 출력이 달라요.'}
                </p>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="answer-content">
          <p>테스트를 통과하면 정답을 확인할 수 있습니다.</p>
          {tests?.every((test) => test.passed) && <pre>{answer}</pre>}
        </div>
      ))}
    </div>
  )
}
