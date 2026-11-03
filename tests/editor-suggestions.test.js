import test from 'node:test'
import assert from 'node:assert/strict'
import { editorSuggestions } from '../src/data/editorSuggestions.js'
import { editorCompletionSource } from '../src/lib/editorCompletions.js'

test('HTML, JavaScript, Python, and Java have editor suggestions', () => {
  assert.deepEqual(Object.keys(editorSuggestions).sort(), ['html', 'java', 'javascript', 'python'])

  for (const [language, suggestions] of Object.entries(editorSuggestions)) {
    assert.ok(suggestions.length >= 8, `${language} should have useful recommendations`)
    assert.ok(suggestions.every(({ label, detail, template }) => label && detail && template))
    assert.equal(new Set(suggestions.map(({ label }) => label)).size, suggestions.length)
  }
})

test('each language includes common shortcuts with a usable code template', () => {
  const expectedShortcuts = {
    html: 'p',
    javascript: 'clg',
    python: 'print',
    java: 'sout',
  }

  for (const [language, label] of Object.entries(expectedShortcuts)) {
    const suggestion = editorSuggestions[language].find((item) => item.label === label)
    assert.ok(suggestion, `${language} should include the ${label} shortcut`)
    assert.ok(suggestion.template.length > label.length)
  }
})

test('the editor completion source returns the matching language shortcut', () => {
  const expectedShortcuts = {
    html: 'p',
    javascript: 'clg',
    python: 'print',
    java: 'sout',
  }

  for (const [language, label] of Object.entries(expectedShortcuts)) {
    const prefix = label.slice(0, 1)
    const completion = editorCompletionSource(language)({
      pos: prefix.length,
      explicit: false,
      matchBefore: (pattern) => {
        const match = pattern.exec(prefix)
        return match
          ? { from: prefix.length - match[0].length, to: prefix.length, text: match[0] }
          : null
      },
    })
    const suggestion = completion?.options.find((option) => option.label === label)

    assert.ok(suggestion, `${language} should offer ${label} while typing`)
    assert.equal(typeof suggestion.apply, 'function')
  }
})
