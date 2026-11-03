import test from 'node:test'
import assert from 'node:assert/strict'
import { readGroups, persistGroups, validateGroup } from '../src/lib/groups.js'
const group = { id: 'one', name: '코딩 팀', description: '함께 배워요', image: '', members: ['민수'], category: '스터디', languages: ['HTML'] }

test('group validation rejects empty names, missing languages and duplicate members', () => {
  assert.equal(validateGroup(group), '')
  for (const invalid of [{ ...group, name: ' ' }, { ...group, languages: [] }, { ...group, members: ['Kim', 'kim'] }, { ...group, category: 'unknown' }]) assert.ok(validateGroup(invalid))
})
test('groups survive storage round trip and settings updates', () => {
  let value
  const storage = { setItem: (_, next) => { value = next }, getItem: () => value }
  persistGroups(storage, [group])
  assert.deepEqual(readGroups(storage), [group])
  const updated = { ...group, name: '새 팀명', languages: ['Python'], members: [] }
  persistGroups(storage, [updated])
  assert.deepEqual(readGroups(storage), [updated])
})
test('corrupt storage and malformed records do not crash the page', () => {
  for (const value of ['{', '{}', 'null', JSON.stringify([null, { ...group, members: [1] }, { ...group, image: 'javascript:bad' }])]) assert.deepEqual(readGroups({ getItem: () => value }), [])
})
test('write failures propagate so the form can retain unsaved data', () => {
  assert.throws(() => persistGroups({ setItem: () => { throw new Error('quota') } }, [group]), /quota/)
})
