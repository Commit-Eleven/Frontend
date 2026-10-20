import { allNodes } from '../constants/dummy/journey.js';

export const journeyPath = '/journeys/html/fundamentals';

/** 현재 URL에서 유효한 레슨 ID를 가져옵니다. */
export function getLessonIdFromPath(pathname = location.pathname) {
  const lessonId = pathname.slice((journeyPath + '/').length);
  const isLessonPath = pathname.startsWith(journeyPath + '/');
  return isLessonPath && allNodes.some((node) => node.id === lessonId) ? lessonId : null;
}

/** 레슨 ID에 해당하는 브라우저 경로를 반환합니다. */
export function getLessonPath(lessonId) {
  return journeyPath + '/' + lessonId;
}

export const authPath = '/auth';

/** 현재 주소를 인증·홈·레슨 화면으로 구분합니다. */
export function getViewFromPath(pathname = location.pathname) {
  if (['/', authPath, '/login'].includes(pathname)) return 'auth';
  return getLessonIdFromPath(pathname) ? 'lesson' : 'home';
}
