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
