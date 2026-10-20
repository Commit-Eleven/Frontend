import test from 'node:test'
import assert from 'node:assert/strict'
import { getEmmetExpansion } from '../src/utils/emmet.js'

test('expands a nested, repeated Emmet abbreviation with numbered classes', () => {
  const abbreviation = 'ul>li.item$*3'
  const result = getEmmetExpansion(abbreviation, abbreviation.length)
  assert.ok(result)
  assert.equal(result.from, 0)
  assert.equal(result.to, abbreviation.length)
  assert.match(result.insert, /<li class="item1"><\/li>/)
  assert.match(result.insert, /<li class="item2"><\/li>/)
  assert.match(result.insert, /<li class="item3"><\/li>/)
  assert.equal(result.insert.slice(result.anchor, result.anchor + 5), '</li>')
})

test('keeps surrounding indentation and puts the caret between a tag pair', () => {
  const source = '<body>\n    p\n</body>'
  const result = getEmmetExpansion(source, source.indexOf('p\n') + 1)
  assert.deepEqual(result, {
    from: source.indexOf('p\n'),
    to: source.indexOf('p\n') + 1,
    insert: '<p></p>',
    anchor: source.indexOf('p\n') + 3,
  })
})

test('does not replace a tag name or HTML comment', () => {
  assert.equal(getEmmetExpansion('<section', 8), null)
  assert.equal(getEmmetExpansion('<!-- p', 6), null)
})
