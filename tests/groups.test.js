import test from 'node:test'
import assert from 'node:assert/strict'
import { groupCreateBody, normalizeGroupDetail, normalizeGroupInvites, normalizeGroupRanking, normalizeGroups } from '../src/api/groups.js'
import { validateGroup } from '../src/lib/groups.js'

test('validates group fields with the server limits', () => {
  assert.equal(validateGroup({ name: '알고리즘 스터디', description: '', capacity: '' }), '')
  assert.match(validateGroup({ name: '   ' }), /팀명/)
  assert.match(validateGroup({ name: 'a'.repeat(51) }), /팀명/)
  assert.match(validateGroup({ name: '팀', description: 'a'.repeat(256) }), /소개/)
  assert.match(validateGroup({ name: '팀', capacity: '51' }), /정원/)
  assert.match(validateGroup({ name: '팀', capacity: '1' }), /정원/)
  assert.equal(validateGroup({ name: '팀', capacity: '50' }), '')
})

test('builds the create body with only filled fields', () => {
  assert.deepEqual(groupCreateBody({ name: ' 스터디 ', description: '', capacity: '' }), { name: '스터디' })
  assert.deepEqual(groupCreateBody({ name: '스터디', description: '매주 3문제씩', capacity: '10' }), {
    name: '스터디', description: '매주 3문제씩', capacity: 10,
  })
})

test('normalizes my groups and group search items', () => {
  assert.deepEqual(normalizeGroups({ items: [{ id: 12, name: '스터디', description: null, ownerId: 3, capacity: 10, role: 'owner', memberCount: 1 }] }), [
    { id: '12', name: '스터디', description: '', ownerId: 3, role: 'owner', memberCount: 1, capacity: 10, isFull: false },
  ])
  assert.equal(normalizeGroups({ items: [{ id: 1, name: 'a', capacity: 2, memberCount: 2, isFull: true }] })[0].isFull, true)
  assert.deepEqual(normalizeGroups(null), [])
})

test('normalizes group detail and ranking responses', () => {
  const detail = normalizeGroupDetail({
    group: { id: 12, name: '스터디', capacity: 10, memberCount: 2 },
    members: [{ id: 3, nickname: '민트', tag: '0001', totalExp: 40, role: 'owner' }, { id: 5, nickname: '종은', tag: '1234', totalExp: 10, role: 'member' }],
    myRole: 'owner',
  })
  assert.equal(detail.group.id, '12')
  assert.equal(detail.members[1].role, 'member')
  assert.equal(detail.myRole, 'owner')

  const ranking = normalizeGroupRanking({ myRank: 2, items: [{ rank: 1, user: { id: 3, nickname: '민트', tag: '0001', totalExp: 40 } }] })
  assert.deepEqual(ranking, { myRank: 2, items: [{ rank: 1, id: 3, nickname: '민트', tag: '0001', totalExp: 40 }] })
})

test('normalizes received group invites', () => {
  const [invite] = normalizeGroupInvites({ items: [{ id: 7, group: { id: 12, name: '스터디' }, inviter: { id: 3, nickname: '민트', tag: '0001' }, createdAt: '2026-11-03' }] })
  assert.deepEqual(invite, { id: '7', groupId: '12', groupName: '스터디', inviter: { nickname: '민트', tag: '0001' }, createdAt: '2026-11-03' })
})
