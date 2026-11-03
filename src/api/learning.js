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

function listOf(data, keys = []) {
  if (Array.isArray(data)) return data
  for (const key of ['items', ...keys]) {
    if (Array.isArray(data?.[key])) return data[key]
  }
  return []
}

const languageAliases = { js: 'javascript', html_css: 'html' }

/** 서버 태그 코드를 앱의 언어 코드로 맞춥니다. */
export function toLanguageCode(tag) {
  const code = String(tag ?? '').toLowerCase()
  return languageAliases[code] || code
}

/** GET /me/home — 메인 페이지 요약 */
export function fetchHome({ signal } = {}) {
  return request({ url: '/me/home', method: 'GET', signal })
}

/** GET /ranking — 전체 경험치 랭킹 */
export async function fetchRanking({ signal } = {}) {
  return normalizeRanking(await request({ url: '/ranking', method: 'GET', signal }))
}

/** GET /me/exp — 내 경험치 */
export function fetchMyExp({ signal } = {}) {
  return request({ url: '/me/exp', method: 'GET', signal })
}

/** GET /curriculum — 커리큘럼 */
export function fetchCurriculum({ signal } = {}) {
  return request({ url: '/curriculum', method: 'GET', signal })
}

/** GET /units/{unit_id} — 단원 상세 */
export function fetchUnit(unitId, { signal } = {}) {
  return request({ url: '/units/' + encodeURIComponent(unitId), method: 'GET', signal })
}

/** GET /tags — 선택 가능한 언어 태그 */
export async function fetchTags({ signal } = {}) {
  return listOf(await request({ url: '/tags', method: 'GET', signal }), ['tags'])
}

/** PATCH /me/learning — 학습 언어·등급 저장 */
export function updateLearningSettings({ language, level } = {}, { signal } = {}) {
  const data = {}
  if (language) data.study_language = language
  if (level) data.study_level = level
  return request({ url: '/me/learning', method: 'PATCH', data, signal })
}

/** GET /me/wrong-notes — 서버 오답 노트 */
export async function fetchServerWrongNotes({ signal } = {}) {
  return normalizeServerWrongNotes(await request({ url: '/me/wrong-notes', method: 'GET', signal }))
}

/** PATCH /me/avatar — 프로필 사진 변경 */
export function updateMyAvatar(avatarUrl, { signal } = {}) {
  return request({ url: '/me/avatar', method: 'PATCH', data: { avatar_url: avatarUrl }, signal })
}

/** GET /users/{id} — 다른 유저 프로필 */
export function fetchUserProfile(userId, { signal } = {}) {
  return request({ url: '/users/' + encodeURIComponent(userId), method: 'GET', signal })
}

/** DELETE /users/me — 회원 탈퇴 */
export function deleteMyAccount({ signal } = {}) {
  return request({ url: '/users/me', method: 'DELETE', signal })
}

/** 랭킹 응답을 화면용 행으로 바꿉니다. */
export function normalizeRanking(data) {
  return listOf(data, ['ranking', 'rankings', 'users'])
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const user = item.user && typeof item.user === 'object' ? item.user : item
      return {
        id: String(user.id ?? item.userId ?? index),
        rank: Number(item.rank ?? index + 1),
        nickname: String(user.nickname ?? item.nickname ?? ''),
        tag: user.tag ?? item.tag ?? '',
        totalExp: Number(item.totalExp ?? item.exp ?? user.totalExp ?? user.exp ?? 0),
        isMe: Boolean(item.isMe ?? item.me ?? false),
      }
    })
}

/** 내 경험치 응답에서 레벨 카드에 필요한 값만 꺼냅니다. 없는 값은 null입니다. */
export function levelSummary(exp) {
  if (!exp || typeof exp !== 'object') return null
  const number = (value) => (Number.isFinite(Number(value)) && value !== null && value !== undefined ? Number(value) : null)
  const total = number(exp.totalExp ?? exp.exp)
  const next = number(exp.nextLevelExp ?? exp.nextLevelTotalExp)
  const remaining = number(exp.remainingExp ?? exp.expToNextLevel) ?? (total !== null && next !== null ? Math.max(0, next - total) : null)
  const percent = number(exp.progressPercent ?? exp.progress)
  return {
    level: number(exp.level),
    totalExp: total,
    remaining,
    percent: percent === null ? null : Math.max(0, Math.min(100, percent)),
  }
}

/** 서버 오답 노트를 오답 노트 화면의 기록 형식으로 바꿉니다. 문제 본문이 없어 다시 풀기는 지원하지 않습니다. */
export function normalizeServerWrongNotes(data) {
  return listOf(data, ['notes', 'wrongNotes'])
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const problem = item.problem && typeof item.problem === 'object' ? item.problem : item
      const id = item.id ?? item.problemId ?? problem.id ?? index
      const language = toLanguageCode(item.language ?? item.tag ?? problem.tag ?? '')
      return {
        id: 'server::' + id,
        language,
        lessonId: String(item.lessonId ?? ''),
        lessonTitle: String(item.lessonTitle ?? ''),
        type: String(item.type ?? item.problemType ?? problem.type ?? 'mcq'),
        problem: {
          title: String(problem.title ?? item.problemTitle ?? '문제 ' + id),
          description: String(problem.description ?? item.description ?? ''),
        },
        wrongCount: Number(item.wrongCount ?? item.count ?? 1),
        status: item.resolved === true || item.status === 'resolved' ? 'resolved' : 'unresolved',
        lastWrongAt: item.lastWrongAt ?? item.updatedAt ?? item.createdAt ?? null,
        readOnly: true,
      }
    })
}
