import { useMemo } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { java } from '@codemirror/lang-java';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Decoration, ViewPlugin, WidgetType } from '@codemirror/view';
import './CodeEditor.css';

const languageOptions = {
  javascript: { label: 'JavaScript', extension: () => javascript({ jsx: true }) },
  java: { label: 'Java', extension: java },
  python: { label: 'Python', extension: python },
};

const blankTokenPattern = /__BLANK_(\d+)__/g;
const blankLabels = ['①', '②', '③', '④', '⑤'];

/** 빈칸 토큰을 코드 영역 안의 번호 배지로 렌더링합니다. */
class BlankTokenWidget extends WidgetType {
  constructor(index) {
    super();
    this.index = index;
  }

  eq(other) {
    return other.index === this.index;
  }

  toDOM() {
    const element = document.createElement('span');
    element.className = 'cm-code-fill-blank';
    element.textContent = blankLabels[this.index - 1] ?? String(this.index);
    element.setAttribute('aria-label', `빈칸 ${this.index}`);
    return element;
  }

  ignoreEvent() {
    return true;
  }
}

/** 코드 지문의 빈칸 토큰 범위를 장식으로 교체합니다. */
const blankTokenExtension = ViewPlugin.fromClass(class {
  constructor(view) {
    this.decorations = this.createDecorations(view);
  }

  update(update) {
    if (update.docChanged) this.decorations = this.createDecorations(update.view);
  }

  createDecorations(view) {
    const decorations = [];
    const source = view.state.doc.toString();
    let match = blankTokenPattern.exec(source);

    while (match) {
      decorations.push(Decoration.replace({ widget: new BlankTokenWidget(Number(match[1])) }).range(match.index, match.index + match[0].length));
      match = blankTokenPattern.exec(source);
    }

    blankTokenPattern.lastIndex = 0;
    return Decoration.set(decorations, true);
  }
}, { decorations: (plugin) => plugin.decorations });

/** 전달받은 언어 이름을 지원하는 편집기 언어 설정으로 변환합니다. */
function getLanguageOption(language) {
  const normalizedLanguage = language?.toLowerCase();
  if (normalizedLanguage === 'js') return languageOptions.javascript;
  if (normalizedLanguage === 'py') return languageOptions.python;
  return languageOptions[normalizedLanguage] ?? languageOptions.javascript;
}

/** 문법 강조와 편집 단축키를 제공하는 코드 편집기를 렌더링합니다. */
function CodeEditor({ label, value, onChange, testInput, language = 'javascript', onRun, isRunning = false, isRunDisabled = false, readOnly = false, showLabel = true, showTestInput = true, lineNumbers = true, minHeight = '240px', fitContent = false, showBlankTokens = false, className = '' }) {
  const lineCount = value.split('\n').length;
  const languageOption = getLanguageOption(language);
  const extensions = useMemo(() => [languageOption.extension(), ...(showBlankTokens ? [blankTokenExtension] : [])], [languageOption, showBlankTokens]);

  return (
    <section className={`code-editor${className ? ` ${className}` : ''}`} aria-label={label}>
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
          height={fitContent ? undefined : minHeight}
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
