import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import './CodeEditor.css';

const languageOptions = {
  javascript: { label: 'JavaScript', extension: () => javascript({ jsx: true }) },
  java: { label: 'Java', extension: java },
  python: { label: 'Python', extension: python },
};

/** 전달받은 언어 이름을 지원하는 편집기 언어 설정으로 변환합니다. */
function getLanguageOption(language) {
  const normalizedLanguage = language?.toLowerCase();
  if (normalizedLanguage === 'js') return languageOptions.javascript;
  if (normalizedLanguage === 'py') return languageOptions.python;
  return languageOptions[normalizedLanguage] ?? languageOptions.javascript;
}

/** 문법 강조와 편집 단축키를 제공하는 코드 편집기를 렌더링합니다. */
function CodeEditor({ label, value, onChange, testInput, language = 'javascript', onRun, isRunning = false, isRunDisabled = false, readOnly = false, showLabel = true, showTestInput = true, lineNumbers = true, minHeight = '240px' }) {
  const lineCount = value.split('\n').length;
  const languageOption = getLanguageOption(language);
  const extensions = useMemo(() => [languageOption.extension()], [languageOption]);

  return (
    <section className="code-editor" aria-label={label}>
      {showLabel && <span className="code-editor__label">{label}</span>}
      <div className="code-editor__surface">
        <div className="code-editor__toolbar">
          <span><i />{languageOption.label}</span>
          <div className="code-editor__toolbar-actions">
            {onRun && <button type="button" onClick={onRun} disabled={isRunDisabled || isRunning}>{isRunning ? '실행 중...' : '실행하기'}</button>}
            <span>Ln {lineCount}</span>
          </div>
        </div>
        <CodeMirror
          aria-label={label}
          value={value}
          height={minHeight}
          theme={oneDark}
          extensions={extensions}
          editable={!readOnly}
          readOnly={readOnly}
          indentWithTab
          basicSetup={{
            lineNumbers,
            highlightActiveLineGutter: false,
            foldGutter: lineNumbers,
            indentOnInput: true,
            bracketMatching: false,
            closeBrackets: true,
            autocompletion: true,
            highlightActiveLine: false,
            highlightSelectionMatches: false,
            searchKeymap: true,
            tabSize: 2,
          }}
          onChange={(nextValue) => onChange?.(nextValue)}
        />
      </div>
      {showTestInput && testInput !== undefined && <small className="code-editor__test-input">테스트 입력값: {JSON.stringify(testInput)}</small>}
    </section>
  );
}

export default CodeEditor;
