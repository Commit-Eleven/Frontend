import test from 'node:test'
import assert from 'node:assert/strict'
import { levelSummary, normalizeRanking, normalizeServerWrongNotes, toLanguageCode } from '../src/api/learning.js'

test('랭킹 응답을 화면용 행으로 바꾼다', () => {
  const rows = normalizeRanking({ items: [{ rank: 1, user: { id: 7, nickname: '민트', tag: '0001' }, totalExp: 120 }] })
  assert.deepEqual(rows, [{ id: '7', rank: 1, nickname: '민트', tag: '0001', totalExp: 120, isMe: false }])
})

test('내 경험치 응답에 없는 값은 null로 둔다', () => {
  assert.deepEqual(levelSummary({ level: 3, totalExp: 80, nextLevelExp: 100 }), { level: 3, totalExp: 80, remaining: 20, percent: null })
  assert.equal(levelSummary(null), null)
})

test('서버 오답 노트는 다시 풀 수 없는 읽기 전용 기록이 된다', () => {
  const [note] = normalizeServerWrongNotes({ items: [{ problemId: 5, tag: 'js', title: '변수 선언', wrongCount: 2 }] })
  assert.equal(note.id, 'server::5')
  assert.equal(note.language, 'javascript')
  assert.equal(note.readOnly, true)
  assert.equal(note.problem.title, '변수 선언')
})

test('js 태그는 javascript로 맞춘다', () => {
  assert.equal(toLanguageCode('JS'), 'javascript')
})

test('로그인 토큰에서 내 사용자 ID를 꺼낸다', async () => {
  const { tokenUserId } = await import('../src/api/community.js')
  const payload = btoa(JSON.stringify({ sub: 12 })).replace(/=+$/, '')
  assert.equal(tokenUserId({ Authorization: 'Bearer head.' + payload + '.sign' }), 12)
  assert.equal(tokenUserId({}), null)
})
