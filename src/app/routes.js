import { journeyFor } from '../data/curricula.js';

export const authPath = '/auth';

/** 현재 주소를 인증·홈·레슨 화면으로 구분합니다. */
export function getViewFromPath(pathname) {
  if (['/', authPath, '/login', '/auth/callback'].includes(pathname)) return 'auth';
  const match = pathname.match(/^\/journeys\/(html|javascript|python|java)\/fundamentals\/([^/]+)$/);
  if (!match) return 'home';
  return journeyFor(match[1]).allNodes.some((node) => node.id === match[2]) ? 'lesson' : 'home';
}
