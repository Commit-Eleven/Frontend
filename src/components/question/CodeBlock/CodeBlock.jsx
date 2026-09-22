import './CodeBlock.css';

/** 줄 번호와 언어 정보를 포함한 읽기 전용 코드 지문을 표시합니다. */
function CodeBlock({ code, children, className = '', lineCount, language = 'Python' }) {
  const totalLines = lineCount ?? code.split('\n').length;

  return (
    <section className={`numbered-code-block quiz-code${className ? ` ${className}` : ''}`} style={{ '--code-line-count': totalLines }} aria-label={`${language} 코드 지문`}>
      <header className="numbered-code-block__toolbar">
        <span><i aria-hidden="true" />{language}</span>
        <span>Ln {totalLines}</span>
      </header>
      <div className="numbered-code-block__content">
        <ol className="numbered-code-block__line-numbers" aria-hidden="true">
          {Array.from({ length: totalLines }, (_, index) => <li key={index}>{index + 1}</li>)}
        </ol>
        <pre><code>{children ?? code}</code></pre>
      </div>
    </section>
  );
}

export default CodeBlock;
