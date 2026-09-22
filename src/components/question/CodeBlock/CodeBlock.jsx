import './CodeBlock.css';

/** 줄 번호가 있는 읽기 전용 코드 지문을 표시합니다. */
function CodeBlock({ code, children, className = '', lineCount }) {
  const totalLines = lineCount ?? code.split('\n').length;

  return (
    <div className={`numbered-code-block quiz-code${className ? ` ${className}` : ''}`}>
      <ol className="numbered-code-block__line-numbers" aria-hidden="true">
        {Array.from({ length: totalLines }, (_, index) => <li key={index}>{index + 1}</li>)}
      </ol>
      <pre><code>{children ?? code}</code></pre>
    </div>
  );
}

export default CodeBlock;
