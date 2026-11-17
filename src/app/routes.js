import { journeyFor } from '../data/curricula.js';

export const authPath = '/auth';

/** 현재 주소를 인증·홈·레슨 화면으로 구분합니다. */
export function getViewFromPath(pathname) {
  if (['/', authPath, '/login', '/auth/callback'].includes(pathname)) return 'auth';
  const match = pathname.match(/^\/journeys\/(html|javascript|python|java)\/fundamentals\/([^/]+)$/);
  if (!match) return 'home';
  return journeyFor(match[1]).allNodes.some((node) => node.id === match[2]) ? 'lesson' : 'home';
}

const homeTabSlugs = {
  '오답 노트': 'wrong-notes',
  친구: 'friends',
  그룹: 'groups',
  프로필: 'profile',
  랭킹: 'ranking',
  알림: 'notifications',
  설정: 'settings',
  도움말: 'help',
};

/** 주소의 ?tab= 값을 홈 화면 메뉴 이름으로 바꿉니다. 없거나 모르는 값이면 '학습'입니다. */
export function homeItemFromSearch(search = '') {
  const slug = new URLSearchParams(search).get('tab');
  const entry = Object.entries(homeTabSlugs).find(([, value]) => value === slug);
  return entry ? entry[0] : '학습';
}

/** 홈 화면 메뉴 이름을 주소 쿼리 문자열로 바꿉니다. '학습'은 쿼리 없이 기본 주소를 씁니다. */
export function searchForHomeItem(label) {
  const slug = homeTabSlugs[label];
  return slug ? `?tab=${slug}` : '';
}
