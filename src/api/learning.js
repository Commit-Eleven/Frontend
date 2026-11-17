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

/** GET /users/me/home — 메인 페이지 요약(통계, 현재 단원, 추천 문제) */
export async function fetchHome({ signal } = {}) {
  return normalizeHome(await request({ url: '/users/me/home', method: 'GET', signal }))
}

/** GET /ranking?page=&size= — 전체 경험치 랭킹과 내 순위 */
export async function fetchRanking({ page = 1, size = 20 } = {}, { signal } = {}) {
  return normalizeRanking(await request({ url: '/ranking', method: 'GET', params: { page, size }, signal }))
}

/** GET /units/{unitId} — 단원 상세(문제별 상태, 다음 단원 잠금 여부) */
export async function fetchUnit(unitId, { signal } = {}) {
  return normalizeUnit(await request({ url: '/units/' + encodeURIComponent(unitId), method: 'GET', signal }))
}

/** 메인 페이지 응답을 화면용으로 맞춥니다. */
export function normalizeHome(data = {}) {
  const stats = data?.stats ?? {}
  const unit = data?.currentUnit
  return {
    stats: {
      solvedCount: Number(stats.solvedCount ?? 0),
      accuracy: Number(stats.accuracy ?? 0),
      streakDays: Number(stats.streakDays ?? 0),
      totalExp: Number(stats.totalExp ?? 0),
    },
    currentUnit: unit ? {
      unitId: String(unit.unitId ?? ''),
      title: String(unit.title ?? ''),
      courseTitle: String(unit.courseTitle ?? ''),
      solved: Number(unit.solved ?? 0),
      total: Number(unit.total ?? 0),
      remainingToUnlock: Number(unit.remainingToUnlock ?? 0),
      nextStageTitle: unit.nextStageTitle ?? null,
    } : null,
    recommendations: listOf(data?.recommendations).map((item) => ({
      problemId: String(item.problemId ?? ''),
      title: String(item.title ?? ''),
      type: String(item.type ?? ''),
      typeLabel: String(item.typeLabel ?? ''),
      xp: Number(item.xp ?? 0),
      solved: Number(item.progress?.solved ?? 0),
      total: Number(item.progress?.total ?? 0),
    })),
  }
}

/** 랭킹 응답({ items, page, size, total, me })을 화면용으로 맞춥니다. */
export function normalizeRanking(data = {}) {
  const me = data?.me ?? null
  return {
    items: listOf(data).map((item, index) => ({
      rank: Number(item.rank ?? index + 1),
      userId: item.userId ?? null,
      nickname: String(item.nickname ?? ''),
      tag: item.tag ?? '',
      totalExp: Number(item.totalExp ?? 0),
      isMe: me ? item.userId === me.userId : false,
    })),
    page: Number(data?.page ?? 1),
    size: Number(data?.size ?? 20),
    total: Number(data?.total ?? 0),
    me: me ? { rank: Number(me.rank), userId: me.userId, totalExp: Number(me.totalExp ?? 0) } : null,
  }
}

/** 단원 상세 응답을 화면용으로 맞춥니다. */
export function normalizeUnit(data = {}) {
  const next = data?.nextUnit
  return {
    unitId: String(data?.unitId ?? ''),
    title: String(data?.title ?? ''),
    courseTitle: String(data?.courseTitle ?? ''),
    completePercent: Number(data?.completePercent ?? 0),
    solved: Number(data?.solved ?? 0),
    wrong: Number(data?.wrong ?? 0),
    remaining: Number(data?.remaining ?? 0),
    problems: listOf(data?.problems).map((problem) => ({
      index: Number(problem.index ?? 0),
      id: String(problem.id ?? ''),
      type: String(problem.type ?? ''),
      typeLabel: String(problem.typeLabel ?? ''),
      title: String(problem.title ?? ''),
      status: ['correct', 'wrong'].includes(problem.status) ? problem.status : 'todo',
    })),
    nextUnit: next ? {
      unitId: String(next.unitId ?? ''),
      title: String(next.title ?? ''),
      total: Number(next.total ?? 0),
      solved: Number(next.solved ?? 0),
      completePercent: Number(next.completePercent ?? 0),
      unlocked: Boolean(next.unlocked),
    } : null,
  }
}

/** GET /users/me/exp — 내 경험치 */
export function fetchMyExp({ signal } = {}) {
  return request({ url: '/users/me/exp', method: 'GET', signal })
}

/** POST /lessons/{lessonId}/complete — 정답 확인 후 레슨 완료 기록 */
export async function completeLesson(lessonId, language, { signal } = {}) {
  const result = await request({ url: '/lessons/' + encodeURIComponent(lessonId) + '/complete', method: 'POST', data: { language }, signal })
  if (result?.lessonId !== lessonId || result.language !== language) throw new Error('레슨 완료 저장 응답을 확인하지 못했어요.')
  return result
}

/** GET /curriculum — 커리큘럼 */
export function fetchCurriculum({ signal } = {}) {
  return request({ url: '/curriculum', method: 'GET', signal })
}

/** GET /tags — 선택 가능한 언어 태그 */
export async function fetchTags({ signal } = {}) {
  return listOf(await request({ url: '/tags', method: 'GET', signal }), ['tags'])
}

/** PATCH /users/me/learning — 학습 언어·등급 저장 */
export function updateLearningSettings({ language, level } = {}, { signal } = {}) {
  const data = {}
  if (language) data.language = language
  if (level) data.level = level
  return request({ url: '/users/me/learning', method: 'PATCH', data, signal })
}

/** GET /users/me/learning — 현재 학습 언어·등급과 고를 수 있는 목록 */
export function fetchLearningSettings({ signal } = {}) {
  return request({ url: '/users/me/learning', method: 'GET', signal })
}

/** GET /users/onboarding — 온보딩이 필요한지와 선택지 */
export function fetchOnboarding({ signal } = {}) {
  return request({ url: '/users/onboarding', method: 'GET', signal })
}

/** POST /users/onboarding — 첫 로그인 때 학습 언어·등급 저장(한 번만 가능) */
export function completeOnboarding({ language, level }, { signal } = {}) {
  return request({ url: '/users/onboarding', method: 'POST', data: { language, level }, signal })
}

/** GET /users/me/submissions — 내 제출 이력. cursor는 이전 응답의 nextCursor */
export async function fetchMySubmissions({ cursor, limit = 20 } = {}, { signal } = {}) {
  const params = { limit }
  if (cursor) params.cursor = cursor
  const data = await request({ url: '/users/me/submissions', method: 'GET', params, signal })
  return { items: listOf(data, ['submissions']), nextCursor: data?.nextCursor ?? null }
}

/** 내 경험치 응답({ totalExp, tier, recent })을 화면용으로 맞춥니다. 응답이 없으면 null입니다. */
export function expSummary(exp) {
  if (!exp || typeof exp !== 'object') return null
  return {
    totalExp: Number(exp.totalExp ?? 0),
    tier: exp.tier ?? 'normal',
    recent: (Array.isArray(exp.recent) ? exp.recent : []).map((row) => ({
      amount: Number(row.amount ?? 0),
      reason: String(row.reason ?? ''),
      problemTitle: row.problemTitle ?? null,
      createdAt: row.createdAt ?? null,
    })),
  }
}

/** GET /users/me/wrong-notes — 서버 오답 노트 */
export async function fetchServerWrongNotes({ signal } = {}) {
  return normalizeServerWrongNotes(await request({ url: '/users/me/wrong-notes', method: 'GET', signal }))
}

/** GET /users/{id} — 다른 유저 프로필 */
export function fetchUserProfile(userId, { signal } = {}) {
  return request({ url: '/users/' + encodeURIComponent(userId), method: 'GET', signal })
}

/** DELETE /users/me — 회원 탈퇴 */
export function deleteMyAccount({ signal } = {}) {
  return request({ url: '/users/me', method: 'DELETE', signal })
}

/** 서버 오답 노트를 오답 노트 화면의 기록 형식으로 바꿉니다. 문제 본문이 없어 다시 풀기는 지원하지 않습니다. */
export function normalizeServerWrongNotes(data) {
  return listOf(data, ['notes', 'wrongNotes'])
    .filter((item) => item && typeof item === 'object')
    .map((item, index) => {
      const problem = item.problem && typeof item.problem === 'object' ? item.problem : item
      const id = item.problemId ?? item.id ?? problem.id ?? index
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
        lastWrongAt: item.wrongAt ?? item.lastWrongAt ?? item.updatedAt ?? item.createdAt ?? null,
        readOnly: true,
      }
    })
}
