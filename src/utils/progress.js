import { initialCompleted } from '../constants/dummy/journey.js'

/** 브라우저에 저장된 학습 진행 상태를 읽습니다. */
export function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem('coddy-demo-progress') || '{}')
    return {
      completed: Array.isArray(saved.completed) ? saved.completed : initialCompleted,
      active: typeof saved.active === 'string' ? saved.active : 'paragraphs',
    }
  } catch {
    return { completed: initialCompleted, active: 'paragraphs' }
  }
}
