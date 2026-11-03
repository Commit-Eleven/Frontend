import { authorizationHeaders } from './auth.js'
import { apiRequest } from './client.js'

export const GROUP_NAME_MAX = 50
export const GROUP_DESCRIPTION_MAX = 255
export const GROUP_CAPACITY_MIN = 2
export const GROUP_CAPACITY_MAX = 50
export const GROUP_CAPACITY_DEFAULT = 10

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

const groupPath = (groupId) => '/groups/' + encodeURIComponent(groupId)
const listOf = (data) => (Array.isArray(data) ? data : Array.isArray(data?.items) ? data.items : [])

/** 로그인 토큰이 있을 때만 서버 그룹 API를 사용합니다. */
export function canUseGroupApi() {
  return Boolean(authorizationHeaders().Authorization)
}

/** 그룹 생성 요청 본문을 만듭니다. name만 필수이고 비어 있는 값은 보내지 않습니다. */
export function groupCreateBody({ name, description, capacity }) {
  const body = { name: String(name ?? '').trim() }
  const text = String(description ?? '').trim()
  if (text) body.description = text
  const limit = Number(capacity)
  if (capacity !== '' && capacity !== null && capacity !== undefined && Number.isInteger(limit) && limit > 0) body.capacity = limit
  return body
}

/** 그룹 한 개를 화면에서 쓰는 형태로 맞춥니다. */
export function normalizeGroup(item = {}) {
  return {
    id: String(item.id ?? ''),
    name: String(item.name ?? ''),
    description: String(item.description ?? ''),
    ownerId: item.ownerId ?? null,
    role: item.role ?? null,
    memberCount: Number(item.memberCount ?? 0),
    capacity: item.capacity ?? null,
    isFull: Boolean(item.isFull ?? (item.capacity && Number(item.memberCount) >= Number(item.capacity))),
  }
}

/** 그룹 목록 응답({ items })을 화면용 배열로 바꿉니다. */
export function normalizeGroups(data) {
  return listOf(data).filter((item) => item && item.id !== undefined).map(normalizeGroup)
}

/** 그룹 상세 응답({ group, members, myRole })을 화면용으로 바꿉니다. */
export function normalizeGroupDetail(data = {}) {
  const members = Array.isArray(data.members) ? data.members : []
  return {
    group: normalizeGroup({ ...data.group, memberCount: data.group?.memberCount ?? members.length }),
    members: members.map((member) => ({
      id: member.id,
      nickname: String(member.nickname ?? ''),
      tag: member.tag ?? '',
      totalExp: Number(member.totalExp ?? 0),
      role: member.role === 'owner' ? 'owner' : 'member',
    })),
    myRole: data.myRole ?? null,
  }
}

/** 그룹 랭킹 응답({ group, myRank, items })을 화면용으로 바꿉니다. */
export function normalizeGroupRanking(data = {}) {
  return {
    myRank: data.myRank ?? null,
    items: listOf(data).map((item, index) => ({
      rank: Number(item.rank ?? index + 1),
      id: item.user?.id ?? null,
      nickname: String(item.user?.nickname ?? ''),
      tag: item.user?.tag ?? '',
      totalExp: Number(item.user?.totalExp ?? 0),
    })),
  }
}

/** GET /me/groups — 내가 속한 그룹 목록 */
export async function fetchMyGroups({ signal } = {}) {
  return normalizeGroups(await request({ url: '/me/groups', method: 'GET', signal }))
}

/** GET /groups?q=&page= — 참여할 그룹 찾기 */
export async function searchGroups({ query = '', page = 1, limit = 20 } = {}, { signal } = {}) {
  const params = { page, limit }
  if (query.trim()) params.q = query.trim()
  const data = await request({ url: '/groups', method: 'GET', params, signal })
  return { items: normalizeGroups(data), total: Number(data?.pagination?.total ?? 0), page, limit }
}

/** POST /groups — 그룹 생성. 만든 사람이 방장이 됩니다. */
export async function createGroup(group, { signal } = {}) {
  return normalizeGroupDetail(await request({ url: '/groups', method: 'POST', data: groupCreateBody(group), signal }))
}

/** GET /groups/{id} — 그룹 상세(그룹 멤버만 조회 가능) */
export async function fetchGroup(groupId, { signal } = {}) {
  return normalizeGroupDetail(await request({ url: groupPath(groupId), method: 'GET', signal }))
}

/** POST /groups/join — 그룹 참여 */
export function joinGroup(groupId, { signal } = {}) {
  return request({ url: '/groups/join', method: 'POST', data: { group_id: Number(groupId) }, signal })
}

/** POST /groups/{id}/invites — 그룹에 사용자 초대 */
export function inviteToGroup(groupId, targetUserId, { signal } = {}) {
  return request({ url: groupPath(groupId) + '/invites', method: 'POST', data: { target_user_id: Number(targetUserId) }, signal })
}

/** POST /group-invites/{id}/accept — 받은 초대 수락 */
export function acceptGroupInvite(inviteId, { signal } = {}) {
  return request({ url: '/group-invites/' + encodeURIComponent(inviteId) + '/accept', method: 'POST', signal })
}

/** POST /group-invites/{id}/reject — 받은 초대 거절 */
export function rejectGroupInvite(inviteId, { signal } = {}) {
  return request({ url: '/group-invites/' + encodeURIComponent(inviteId) + '/reject', method: 'POST', signal })
}

/** GET /groups/{id}/ranking — 그룹 멤버 경험치 랭킹 */
export async function fetchGroupRanking(groupId, { signal } = {}) {
  return normalizeGroupRanking(await request({ url: groupPath(groupId) + '/ranking', method: 'GET', signal }))
}

/** POST /groups/{id}/owner — 방장 위임(방장만 가능) */
export function transferGroupOwner(groupId, targetUserId, { signal } = {}) {
  return request({ url: groupPath(groupId) + '/owner', method: 'POST', data: { target_user_id: Number(targetUserId) }, signal })
}

/** DELETE /groups/{id} — 그룹 삭제(방장만 가능) */
export function deleteGroup(groupId, { signal } = {}) {
  return request({ url: groupPath(groupId), method: 'DELETE', signal })
}

/** 받은 초대 목록 응답({ items })을 화면용으로 바꿉니다. id가 수락·거절 API의 초대 ID입니다. */
export function normalizeGroupInvites(data) {
  return listOf(data).filter((item) => item && item.id !== undefined && item.group).map((item) => ({
    id: String(item.id),
    groupId: String(item.group.id ?? ''),
    groupName: String(item.group.name ?? ''),
    inviter: item.inviter ? { nickname: String(item.inviter.nickname ?? ''), tag: item.inviter.tag ?? '' } : null,
    createdAt: item.createdAt ?? null,
  }))
}

/** GET /users/me/group-invites — 내가 받은 그룹 초대 */
export async function fetchMyGroupInvites({ signal } = {}) {
  return normalizeGroupInvites(await request({ url: '/users/me/group-invites', method: 'GET', signal }))
}
