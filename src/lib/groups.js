import { GROUP_CAPACITY_MAX, GROUP_CAPACITY_MIN, GROUP_DESCRIPTION_MAX, GROUP_NAME_MAX } from '../api/groups.js'

/** 그룹 생성 폼 입력을 서버 규칙대로 검증합니다. 문제가 없으면 빈 문자열을 반환합니다. */
export function validateGroup(group) {
  const name = String(group.name ?? '').trim()
  if (!name || name.length > GROUP_NAME_MAX) return `팀명은 1~${GROUP_NAME_MAX}자로 입력해 주세요.`
  if (String(group.description ?? '').trim().length > GROUP_DESCRIPTION_MAX) return `팀 소개는 ${GROUP_DESCRIPTION_MAX}자 이내로 입력해 주세요.`
  const capacity = String(group.capacity ?? '').trim()
  if (capacity && !(Number.isInteger(Number(capacity)) && Number(capacity) >= GROUP_CAPACITY_MIN && Number(capacity) <= GROUP_CAPACITY_MAX)) {
    return `정원은 ${GROUP_CAPACITY_MIN}~${GROUP_CAPACITY_MAX}명 사이로 입력해 주세요.`
  }
  return ''
}

/** 서버 오류를 그룹 화면에서 보여줄 문장으로 바꿉니다. */
export function groupErrorMessage(error, fallback) {
  if (error?.status === 401) return '로그인이 만료됐어요. 다시 로그인해 주세요.'
  if (error?.status === 403) return '이 작업을 할 권한이 없어요.'
  if (error?.status === 404) return '그룹을 찾을 수 없어요.'
  return error?.message || fallback
}
