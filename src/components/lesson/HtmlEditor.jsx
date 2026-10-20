import { useEffect, useRef } from 'react'
import { EditorState } from '@codemirror/state'
import { EditorView, keymap } from '@codemirror/view'
import { basicSetup } from 'codemirror'
import { html } from '@codemirror/lang-html'
import { HighlightStyle, syntaxHighlighting } from '@codemirror/language'
import { indentWithTab } from '@codemirror/commands'
import { tags } from '@lezer/highlight'
import { getEmmetExpansion } from '../../utils/emmet.js'

const htmlColors = HighlightStyle.define([
  { tag: tags.tagName, color: '#569cd6' },
  { tag: tags.attributeName, color: '#9cdcfe' },
  { tag: tags.string, color: '#ce9178' },
  { tag: tags.comment, color: '#6a9955', fontStyle: 'italic' },
  { tag: tags.angleBracket, color: '#808080' },
  { tag: tags.keyword, color: '#c586c0' },
  { tag: tags.number, color: '#b5cea8' },
])

const editorTheme = EditorView.theme({
  '&': { height: '100%', backgroundColor: '#1e1e1e', color: '#d8e5ed', fontSize: '16px' },
  '.cm-scroller': { height: '100%', fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace', lineHeight: '27px' },
  '.cm-content': { padding: '10px 0', caretColor: '#f4f4f4' },
  '.cm-line': { padding: '0 10px' },
  '.cm-gutters': { backgroundColor: '#1e1e1e', color: '#858585', border: 'none', minWidth: '56px' },
  '.cm-lineNumbers .cm-gutterElement': { padding: '0 12px 0 0', minWidth: '56px' },
  '.cm-activeLine, .cm-activeLineGutter': { backgroundColor: '#282828' },
  '&.cm-focused': { outline: 'none' },
  '&.cm-focused .cm-cursor': { borderLeftColor: '#f4f4f4' },
}, { dark: true })

/** 커서 앞의 Emmet 약어를 확장해 편집기에 삽입합니다. */
function expandAtCursor(view) {
  const selection = view.state.selection.main
  if (!selection.empty) return false
  const expansion = getEmmetExpansion(view.state.doc.toString(), selection.head)
  if (!expansion) return false
  view.dispatch({
    changes: { from: expansion.from, to: expansion.to, insert: expansion.insert },
    selection: { anchor: expansion.anchor },
    scrollIntoView: true,
  })
  return true
}

/** CodeMirror 기반 HTML 편집기와 자동 완성을 제공합니다. */
export function HtmlEditor({ value, onChange }) {
  const hostRef = useRef(null)
  const viewRef = useRef(null)
  const onChangeRef = useRef(onChange)
  const initialValueRef = useRef(value)

  useEffect(() => { onChangeRef.current = onChange }, [onChange])

  useEffect(() => {
    const view = new EditorView({
      state: EditorState.create({
        doc: initialValueRef.current,
        extensions: [
          keymap.of([
            { key: 'Tab', run: expandAtCursor },
            { key: 'Mod-e', run: expandAtCursor },
            indentWithTab,
          ]),
          basicSetup,
          html({ autoCloseTags: true }),
          syntaxHighlighting(htmlColors),
          editorTheme,
          EditorView.contentAttributes.of({ 'aria-label': 'HTML 코드 편집기', 'aria-multiline': 'true' }),
          EditorView.updateListener.of((update) => {
            if (update.docChanged) onChangeRef.current(update.state.doc.toString())
          }),
        ],
      }),
      parent: hostRef.current,
    })
    viewRef.current = view
    return () => {
      view.destroy()
      viewRef.current = null
    }
  }, [])

  useEffect(() => {
    const view = viewRef.current
    if (!view || view.state.doc.toString() === value) return
    view.dispatch({ changes: { from: 0, to: view.state.doc.length, insert: value } })
  }, [value])

  return <div className="html-editor" ref={hostRef} />
}
