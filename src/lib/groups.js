export const GROUPS_KEY = 'codegram.groups.v1'
export const categories = ['스터디', '프로젝트', '알고리즘', '취업 준비', '기타']
export const languages = ['HTML', 'CSS', 'JavaScript', 'TypeScript', 'Python', 'Java', 'C', 'C++', 'Go', 'Kotlin', 'Swift']

export function validateGroup(group) {
  if (!group.name.trim() || group.name.trim().length > 30) return '팀명은 1~30자로 입력해 주세요.'
  if (group.description.length > 500) return '팀 소개는 500자 이내로 입력해 주세요.'
  if (!categories.includes(group.category)) return '카테고리를 선택해 주세요.'
  if (!group.languages.length || group.languages.some(language => !languages.includes(language))) return '사용 언어를 하나 이상 선택해 주세요.'
  if (group.members.length > 30 || group.members.some(member => !member.trim() || member.length > 40)) return '팀원은 40자 이내의 이름으로 최대 30명까지 추가할 수 있어요.'
  if (new Set(group.members.map(member => member.toLowerCase())).size !== group.members.length) return '같은 팀원을 중복해서 추가할 수 없어요.'
  return ''
}

export function readGroups(storage) {
  try {
    const parsed = JSON.parse(storage.getItem(GROUPS_KEY) || '[]')
    if (!Array.isArray(parsed)) return []
    return parsed.filter(group => group && typeof group.id === 'string' && typeof group.name === 'string' && typeof group.description === 'string' && Array.isArray(group.members) && group.members.every(member => typeof member === 'string') && Array.isArray(group.languages) && typeof group.image === 'string' && (!group.image || /^data:image\/(png|jpeg|webp);base64,/.test(group.image)) && !validateGroup(group))
  } catch { return [] }
}

export function persistGroups(storage, groups) {
  storage.setItem(GROUPS_KEY, JSON.stringify(groups))
}
