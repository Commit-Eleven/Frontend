import { completeFromList, snippetCompletion } from '@codemirror/autocomplete'
import { editorSuggestions } from '../data/editorSuggestions.js'

const completionsByLanguage = Object.fromEntries(
  Object.entries(editorSuggestions).map(([language, suggestions]) => [
    language,
    completeFromList(
      suggestions.map(({ label, detail, template }) =>
        snippetCompletion(template, { label, detail, type: 'text' }),
      ),
    ),
  ]),
)

/** 지정한 언어의 짧은 입력 추천을 CodeMirror 자동 완성 소스로 돌려줍니다. */
export function editorCompletionSource(language) {
  return completionsByLanguage[language] || completionsByLanguage.javascript
}
