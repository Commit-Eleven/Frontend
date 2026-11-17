import test from 'node:test'
import assert from 'node:assert/strict'
import { expSummary, normalizeHome, normalizeRanking, normalizeServerWrongNotes, normalizeUnit, toLanguageCode } from '../src/api/learning.js'

test('내 경험치 응답을 화면용으로 맞춘다', () => {
  const summary = expSummary({ totalExp: 120, tier: 'normal', recent: [{ amount: 10, reason: 'solve', problemTitle: '변수' }] })
  assert.equal(summary.totalExp, 120)
  assert.equal(summary.recent[0].amount, 10)
  assert.equal(expSummary(null), null)
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

test('메인 페이지 응답에서 연속 학습과 현재 단원을 꺼낸다', () => {
  const home = normalizeHome({
    stats: { solvedCount: 3, accuracy: 75, streakDays: 2, totalExp: 30 },
    currentUnit: { unitId: 'vars-types', title: '변수와 자료형', courseTitle: 'Python 초급', solved: 3, total: 10, remainingToUnlock: 7, nextStageTitle: '조건문' },
    recommendations: [{ problemId: 'mc-001', title: '변수', type: 'mcq', typeLabel: '객관식', xp: 10, progress: { solved: 1, total: 4 } }],
  })
  assert.equal(home.stats.streakDays, 2)
  assert.equal(home.currentUnit.unitId, 'vars-types')
  assert.equal(home.recommendations[0].total, 4)
  assert.equal(normalizeHome({}).currentUnit, null)
})

test('랭킹 응답에서 내 행을 표시한다', () => {
  const ranking = normalizeRanking({ items: [{ rank: 1, userId: 7, nickname: '민트', tag: '0001', totalExp: 120 }, { rank: 2, userId: 9, nickname: '나', totalExp: 80 }], page: 1, size: 20, total: 2, me: { rank: 2, userId: 9, totalExp: 80 } })
  assert.equal(ranking.items[0].isMe, false)
  assert.equal(ranking.items[1].isMe, true)
  assert.equal(ranking.me.rank, 2)
})

test('단원 상세의 문제 상태와 다음 단원 잠금을 맞춘다', () => {
  const unit = normalizeUnit({ unitId: 'vars-types', title: '변수와 자료형', completePercent: 30, problems: [{ index: 1, id: 'mc-001', status: 'correct' }, { index: 2, id: 'mc-002', status: 'x' }], nextUnit: { unitId: 'conditionals', title: '조건문', unlocked: false } })
  assert.equal(unit.problems[1].status, 'todo')
  assert.equal(unit.nextUnit.unlocked, false)
})
