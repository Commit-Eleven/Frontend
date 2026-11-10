import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeNotification, normalizeNotificationSettings, normalizeNotifications, relativeTime } from '../src/api/notifications.js'

test('normalizes system and invite notifications', () => {
  const system = normalizeNotification({ id: 1, type: 'system', payload: { title: '점검 안내', message: '내일 점검해요.' }, isRead: false, createdAt: '2026-11-10T00:00:00Z' })
  assert.equal(system.title, '점검 안내')
  assert.equal(system.message, '내일 점검해요.')
  assert.equal(system.isRead, false)
  const invite = normalizeNotification({ id: 2, type: 'group_invite', payload: { groupId: 3 }, isRead: true })
  assert.equal(invite.title, '그룹 초대')
  assert.equal(invite.isRead, true)
})

test('normalizes the notification list response', () => {
  const data = normalizeNotifications({ items: [{ id: 1, type: 'system', payload: {} }, null], pagination: { page: 2, limit: 20, total: 31 } })
  assert.equal(data.items.length, 1)
  assert.equal(data.total, 31)
  assert.equal(data.page, 2)
  assert.deepEqual(normalizeNotifications(null).items, [])
})

test('settings default to enabled and follow the server values', () => {
  const settings = normalizeNotificationSettings({ settings: [{ type: 'system', enabled: false }, { type: 'unknown', enabled: false }] })
  assert.equal(settings.system, false)
  assert.equal(settings.friend_request, true)
  assert.equal('unknown' in settings, false)
})

test('formats relative time', () => {
  const now = Date.parse('2026-11-10T12:00:00Z')
  assert.equal(relativeTime('2026-11-10T11:59:50Z', now), '방금 전')
  assert.equal(relativeTime('2026-11-10T11:30:00Z', now), '30분 전')
  assert.equal(relativeTime('2026-11-10T09:00:00Z', now), '3시간 전')
  assert.equal(relativeTime('2026-11-08T12:00:00Z', now), '2일 전')
  assert.equal(relativeTime('bad', now), '')
})
