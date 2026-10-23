import { useEffect, useRef } from 'react';
import { EditorView } from '@codemirror/view';
import { EditorState } from '@codemirror/state';
import { basicSetup } from 'codemirror';
import { indentWithTab } from '@codemirror/commands';
import { keymap } from '@codemirror/view';
import { HighlightStyle, StreamLanguage, syntaxHighlighting } from '@codemirror/language';
import { acceptCompletion, autocompletion } from '@codemirror/autocomplete';
import { tags } from '@lezer/highlight';
import { editorCompletionSource } from '../../lib/editorCompletions.js';
import './TextCodeEditor.css';

const keywords = {
  javascript: new Set([
    'const', 'let', 'var', 'function', 'return', 'if', 'else', 'for', 'while', 'do', 'break',
    'continue', 'new', 'class', 'extends', 'this', 'super', 'async', 'await', 'throw', 'try',
    'catch', 'finally', 'switch', 'case', 'default', 'import', 'from', 'export', 'as', 'of',
    'in', 'instanceof', 'typeof', 'delete', 'void', 'yield',
  ]),
  python: new Set([
    'def', 'return', 'if', 'elif', 'else', 'for', 'while', 'in', 'break', 'continue', 'class',
    'and', 'or', 'not', 'is', 'import', 'from', 'as', 'with', 'try', 'except', 'finally',
    'raise', 'pass', 'lambda', 'yield', 'async', 'await', 'global', 'nonlocal', 'assert',
  ]),
  java: new Set([
    'abstract', 'assert', 'boolean', 'break', 'byte', 'case', 'catch', 'char', 'class',
    'continue', 'default', 'do', 'double', 'else', 'enum', 'extends', 'final', 'finally',
    'float', 'for', 'if', 'implements', 'import', 'instanceof', 'int', 'interface', 'long',
    'native', 'new', 'package', 'private', 'protected', 'public', 'return', 'short', 'static',
    'strictfp', 'super', 'switch', 'synchronized', 'this', 'throw', 'throws', 'transient',
    'try', 'void', 'volatile', 'while', 'var', 'record', 'sealed', 'permits',
  ]),
};

const atoms = {
  javascript: new Set(['true', 'false', 'null', 'undefined', 'NaN', 'Infinity']),
  python: new Set(['True', 'False', 'None']),
  java: new Set(['true', 'false', 'null']),
};

const builtInTypes = {
  javascript: new Set(['Array', 'Boolean', 'Date', 'Map', 'Number', 'Object', 'Promise', 'Set', 'String']),
  python: new Set(['bool', 'bytes', 'dict', 'float', 'int', 'list', 'set', 'str', 'tuple']),
  java: new Set(['Boolean', 'Byte', 'Character', 'Double', 'Float', 'Integer', 'Long', 'Object', 'Short', 'String']),
};

const darkPlusColors = [
  { tag: tags.keyword, color: '#569cd6' },
  { tag: tags.string, color: '#ce9178' },
  { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.number, color: '#b5cea8' },
  { tag: tags.variableName, color: '#9cdcfe' },
  { tag: tags.function(tags.variableName), color: '#dcdcaa' },
  { tag: tags.typeName, color: '#4ec9b0' },
  { tag: tags.propertyName, color: '#9cdcfe' },
  { tag: tags.atom, color: '#569cd6' },
  { tag: tags.operator, color: '#d4d4d4' },
  { tag: tags.punctuation, color: '#d4d4d4' },
  { tag: tags.bracket, color: '#d4d4d4' },
  { tag: tags.meta, color: '#c586c0' },
];

const intellijDarculaColors = [
  { tag: tags.keyword, color: '#cc7832' },
  { tag: tags.string, color: '#6a8759' },
  { tag: tags.comment, color: '#808080', fontStyle: 'italic' },
  { tag: tags.number, color: '#6897bb' },
  { tag: tags.variableName, color: '#a9b7c6' },
  { tag: tags.function(tags.variableName), color: '#ffc66d' },
  { tag: tags.typeName, color: '#a9b7c6' },
  { tag: tags.propertyName, color: '#9876aa' },
  { tag: tags.atom, color: '#cc7832' },
  { tag: tags.operator, color: '#a9b7c6' },
  { tag: tags.punctuation, color: '#a9b7c6' },
  { tag: tags.bracket, color: '#a9b7c6' },
  { tag: tags.meta, color: '#bbb529' },
];

const codeColors = {
  javascript: HighlightStyle.define(darkPlusColors),
  python: HighlightStyle.define(darkPlusColors),
  java: HighlightStyle.define(intellijDarculaColors),
};

function codeLanguage(language) {
  const commentStart = language === 'python' ? '#' : '//';
  return StreamLanguage.define({
    startState() {
      return { blockComment: false, tripleQuote: null };
    },
    token(stream, state) {
      if (stream.eatSpace()) return null;

      if (state.blockComment) {
        if (stream.skipTo('*/')) {
          stream.match('*/');
          state.blockComment = false;
        } else {
          stream.skipToEnd();
        }
        return 'comment';
      }

      if (state.tripleQuote) {
        const end = stream.string.indexOf(state.tripleQuote, stream.pos);
        if (end < 0) stream.skipToEnd();
        else {
          stream.pos = end + state.tripleQuote.length;
          state.tripleQuote = null;
        }
        return 'string';
      }

      if (stream.match(commentStart)) {
        stream.skipToEnd();
        return 'comment';
      }
      if (language !== 'python' && stream.match('/*')) {
        if (stream.skipTo('*/')) stream.match('*/');
        else {
          state.blockComment = true;
          stream.skipToEnd();
        }
        return 'comment';
      }

      if (language === 'python' && stream.match(/(?:'''|""")/)) {
        const quote = stream.current();
        const end = stream.string.indexOf(quote, stream.pos);
        if (end < 0) {
          state.tripleQuote = quote;
          stream.skipToEnd();
        } else {
          stream.pos = end + quote.length;
        }
        return 'string';
      }

      if (stream.match(/"(?:[^"\\]|\\.)*(?:"|$)|'(?:[^'\\]|\\.)*(?:'|$)/) ||
          (language === 'javascript' && stream.match(/`(?:[^`\\]|\\.)*(?:`|$)/))) {
        return 'string';
      }

      if (language === 'java' && stream.match(/@[A-Za-z_$][\w$]*/)) return 'meta';
      if (stream.match(/(?:0[xX][\da-fA-F]+|(?:\d+(?:\.\d*)?|\.\d+)(?:[eE][+-]?\d+)?)[fFdDlL]?/)) {
        return 'number';
      }

      const identifier = stream.match(/[A-Za-z_$][\w$]*/);
      if (identifier) {
        const name = stream.current();
        if (keywords[language].has(name)) return 'keyword';
        if (atoms[language].has(name)) return 'atom';
        if (builtInTypes[language].has(name) || /^[A-Z]/.test(name)) return 'typeName';

        if (/^\s*\(/.test(stream.string.slice(stream.pos))) return 'variableName.function';
        const previousCharacter = stream.string[stream.pos - name.length - 1];
        if (previousCharacter === '.') return 'propertyName';
        return 'variableName';
      }

      if (language === 'javascript' && stream.match(/@[A-Za-z_$][\w$]*/)) return 'meta';
      if (stream.match(/(?:===|!==|=>|==|!=|<=|>=|&&|\|\||\+\+|--|->|\+=|-=|\*=|\/=|%=|\/|[=+*%<>!&|^~?:-])/)) {
        return 'operator';
      }
      const character = stream.peek();
      if ('()[]{}'.includes(character)) {
        stream.next();
        return 'bracket';
      }
      if (',;:'.includes(character)) {
        stream.next();
        return 'punctuation';
      }

      stream.next();
      return null;
    },
  });
}

const editorTheme = EditorView.theme(
  {
    '&': { height: '100%', backgroundColor: '#1e1e1e', color: '#d8e5ed', fontSize: '16px' },
    '.cm-scroller': {
      height: '100%',
      fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace',
      lineHeight: '27px',
    },
    '.cm-content': { padding: '10px 0', caretColor: '#f4f4f4' },
    '.cm-line': { padding: '0 10px' },
    '.cm-gutters': {
      backgroundColor: '#1e1e1e',
      color: '#858585',
      border: 'none',
      minWidth: '56px',
    },
    '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 0', minWidth: '56px' },
    '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: '#282828' },
    '&.cm-focused': { outline: 'none' },
    '&.cm-focused .cm-cursor': { borderLeftColor: '#f4f4f4' },
    '& .cm-selectionBackground': { backgroundColor: '#264f78 !important' },
  },
  { dark: true },
);

export function TextCodeEditor({ value, onChange, language }) {
  const hostRef = useRef(null);
  const viewRef = useRef(null);
  const onChangeRef = useRef(onChange);
  const initialValueRef = useRef(value);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        doc: initialValueRef.current,
        extensions: [
          keymap.of([
            {
              key: 'Tab',
              run: (editor) => acceptCompletion(editor) || indentWithTab.run(editor),
            },
          ]),
          basicSetup,
          autocompletion({
            override: [editorCompletionSource(language)],
            activateOnTyping: true,
            closeOnBlur: true,
            icons: false,
          }),
          codeLanguage(language),
          syntaxHighlighting(codeColors[language] || codeColors.javascript),
          editorTheme,
          EditorView.contentAttributes.of({
            'aria-label': `${language} 코드 편집기`,
            'aria-multiline': 'true',
            spellcheck: 'false',
          }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current(update.state.doc.toString());
          }),
        ],
      }),
      parent: hostRef.current,
    });
    viewRef.current = view;
    return () => {
      view.destroy();
      viewRef.current = null;
    };
  }, [language]);

  useEffect(() => {
    const view = viewRef.current;
    if (!view || view.state.doc.toString() === value) return;
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } });
  }, [value]);

  return <div className="text-code-editor" ref={hostRef} />;
}
