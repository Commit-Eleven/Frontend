import { authorizationHeaders } from './auth.js'
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

/** 공통 응답 봉투({ data })를 벗기고 필드 이름을 camelCase로 맞춥니다. */
async function request(config) {
  const payload = await apiRequest(config)
  return camelize(payload?.data ?? payload)
}

const itemsOf = (data) => (Array.isArray(data?.items) ? data.items : [])

/** 로그인 토큰(JWT)의 sub 값에서 내 사용자 ID를 꺼냅니다. */
export function tokenUserId(headers = authorizationHeaders()) {
  const token = headers.Authorization?.replace(/^Bearer /, '')
  try {
    const payload = token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')
    const id = Number(JSON.parse(atob(payload)).sub)
    return Number.isInteger(id) && id > 0 ? id : null
  } catch {
    return null
  }
}

/**
 * 내 정보를 가져옵니다.
 * 배포 서버에서 GET /users/me가 /users/{id} 경로에 먼저 잡혀 400을 반환하므로,
 * 그때는 토큰의 내 ID로 /users/{id}를 조회하고 통계의 학습 설정을 합칩니다.
 */
export async function fetchMyProfile({ signal } = {}) {
  try {
    return await request({ url: '/users/me', method: 'GET', signal })
  } catch (error) {
    const id = tokenUserId()
    if ((error.status !== 400 && error.status !== 404) || !id) throw error
    const [data, stats] = await Promise.all([
      request({ url: '/users/' + id, method: 'GET', signal }),
      fetchMyStats({ signal }).catch(() => ({})),
    ])
    const user = data?.user ?? data
    return { tier: stats.tier, studyLanguage: stats.studyLanguage, studyLevel: stats.studyLevel, ...user }
  }
}

/** PATCH /users/me/nickname — 닉네임 변경 */
export function updateMyNickname(nickname, { signal } = {}) {
  return request({ url: '/users/me/nickname', method: 'PATCH', data: { nickname }, signal })
}

/** PATCH /me/avatar — 프로필 사진 URL 변경 */
export function updateMyAvatar(avatarUrl, { signal } = {}) {
  return request({ url: '/me/avatar', method: 'PATCH', data: { avatar_url: avatarUrl }, signal })
}

/** PATCH /users/me/avatar — 기본 프로필 사진으로 복원 */
export function resetMyAvatar({ signal } = {}) {
  return request({ url: '/users/me/avatar', method: 'PATCH', data: { imageUrl: null }, signal })
}

/** GET /users/me/stats — 학습 통계 */
export function fetchMyStats({ signal } = {}) {
  return request({ url: '/users/me/stats', method: 'GET', signal })
}

/** PATCH /tags — 학습 언어 변경 */
export function updateStudyLanguage(tag, { signal } = {}) {
  return request({ url: '/tags', method: 'PATCH', data: { tag }, signal })
}

/** GET /users/friends — 친구 목록(받은·보낸 요청 포함) */
export async function fetchFriends({ signal } = {}) {
  return itemsOf(await request({ url: '/users/friends', method: 'GET', signal }))
}

/** GET /users/friends/search?q= — 사용자 검색 */
export async function searchPeople(query, { signal } = {}) {
  return itemsOf(await request({ url: '/users/friends/search', method: 'GET', params: { q: query }, signal }))
}

/** POST /users/friends — 친구 신청 */
export function sendFriendRequest(targetUserId, { signal } = {}) {
  return request({ url: '/users/friends', method: 'POST', data: { target_user_id: targetUserId }, signal })
}

/** POST /users/friends/{id}/accept — 친구 수락 */
export function acceptFriendRequest(friendshipId, { signal } = {}) {
  return request({ url: '/users/friends/' + friendshipId + '/accept', method: 'POST', signal })
}

/** DELETE /users/friends/{id} — 친구 삭제·요청 취소 */
export function removeFriend(friendshipId, { signal } = {}) {
  return request({ url: '/users/friends/' + friendshipId, method: 'DELETE', signal })
}
