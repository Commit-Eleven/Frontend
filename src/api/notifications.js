import { apiRequest } from './client.js'

function camelize(value) {
  if (Array.isArray(value)) return value.map(camelize)
  if (!value || typeof value !== 'object') return value
  return Object.fromEntries(
    Object.entries(value).map(([key, item]) => [
      key.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase()),
      camelize(item),
    ]),
  )
}

async function request(config) {
  const payload = await apiRequest(config)
  return camelize(payload?.data ?? payload)
}

/** 서버가 보내는 알림 종류와 화면에 보여줄 이름입니다. */
export const NOTIFICATION_TYPES = [
  { type: 'friend_request', label: '친구 요청', description: '누군가 친구를 신청했을 때' },
  { type: 'friend_accepted', label: '친구 수락', description: '내 친구 요청이 수락됐을 때' },
  { type: 'group_invite', label: '그룹 초대', description: '그룹에 초대받았을 때' },
  { type: 'group_joined', label: '그룹 참여', description: '누군가 내 그룹에 참여했을 때' },
  { type: 'system', label: '공지', description: '서비스 공지와 안내' },
]

const typeLabel = (type) => NOTIFICATION_TYPES.find((item) => item.type === type)?.label ?? '알림'

/** 알림 한 개를 화면에서 쓰는 형태로 맞춥니다. */
export function normalizeNotification(item = {}) {
  const payload = item.payload && typeof item.payload === 'object' ? item.payload : {}
  const type = String(item.type ?? 'system')
  let title = typeLabel(type)
  let message = ''
  if (type === 'system') {
    title = String(payload.title ?? title)
    message = String(payload.message ?? '')
  } else if (type === 'group_invite') {
    message = '새 그룹 초대가 도착했어요. 그룹 메뉴에서 수락하거나 거절할 수 있어요.'
  } else if (type === 'friend_request') {
    message = '새 친구 요청이 도착했어요.'
  } else if (type === 'friend_accepted') {
    message = '친구 요청이 수락됐어요.'
  } else if (type === 'group_joined') {
    message = '새 멤버이 그룹에 참여했어요.'
  }
  return {
    id: item.id,
    type,
    title,
    message,
    isRead: Boolean(item.isRead),
    createdAt: item.createdAt ?? null,
  }
}

/** 알림 목록 응답({ items, pagination })을 화면용으로 바꿉니다. */
export function normalizeNotifications(data = {}) {
  const items = Array.isArray(data?.items) ? data.items : []
  return {
    items: items.filter((item) => item && item.id !== undefined).map(normalizeNotification),
    page: Number(data?.pagination?.page ?? 1),
    limit: Number(data?.pagination?.limit ?? items.length),
    total: Number(data?.pagination?.total ?? items.length),
  }
}

/** 알림 설정 응답({ settings })을 { 종류: 켜짐 } 형태로 바꿉니다. 응답에 없는 종류는 켜짐으로 봅니다. */
export function normalizeNotificationSettings(data = {}) {
  const list = Array.isArray(data?.settings) ? data.settings : []
  const result = Object.fromEntries(NOTIFICATION_TYPES.map(({ type }) => [type, true]))
  for (const item of list) if (item && item.type in result) result[item.type] = Boolean(item.enabled)
  return result
}

/** "방금 전", "3분 전"처럼 상대 시각으로 보여줍니다. */
export function relativeTime(value, now = Date.now()) {
  const time = new Date(value).getTime()
  if (!Number.isFinite(time)) return ''
  const seconds = Math.max(0, Math.round((now - time) / 1000))
  if (seconds < 60) return '방금 전'
  if (seconds < 3600) return `${Math.floor(seconds / 60)}분 전`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}시간 전`
  if (seconds < 86400 * 7) return `${Math.floor(seconds / 86400)}일 전`
  return new Date(time).toLocaleDateString('ko-KR')
}

/** GET /notifications?page&limit&unread_only — 알림 목록 */
export async function fetchNotifications({ page = 1, limit = 20, unreadOnly = false } = {}, { signal } = {}) {
  const params = { page, limit }
  if (unreadOnly) params.unread_only = true
  return normalizeNotifications(await request({ url: '/notifications', method: 'GET', params, signal }))
}

/** PATCH /notifications/{id} — 알림 읽음 처리 */
export function markNotificationRead(id, { signal } = {}) {
  return request({ url: '/notifications/' + encodeURIComponent(id), method: 'PATCH', data: { is_read: true }, signal })
}

/** GET /notifications/settings — 알림 종류별 설정 */
export async function fetchNotificationSettings({ signal } = {}) {
  return normalizeNotificationSettings(await request({ url: '/notifications/settings', method: 'GET', signal }))
}

/** PATCH /notifications/settings — 알림 종류별 설정 변경(보낸 종류만 바뀝니다) */
export function updateNotificationSettings(settings, { signal } = {}) {
  return request({ url: '/notifications/settings', method: 'PATCH', data: { settings }, signal })
}
