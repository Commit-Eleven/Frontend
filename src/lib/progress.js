import { journeyFor } from '../data/curricula.js'

function progressKey(language) {
  return language === 'html' ? 'coddy-demo-progress' : `coddy-demo-progress-${language}`
}

export function readSaved(language = 'html') {
  const journey = journeyFor(language)
  try {
    const saved = JSON.parse(localStorage.getItem(progressKey(language)) || '{}')
    return {
      completed: Array.isArray(saved.completed) ? saved.completed : journey.initialCompleted,
      active:
        typeof saved.active === 'string' && journey.allNodes.some((node) => node.id === saved.active)
          ? saved.active
          : journey.defaultActive,
    }
  } catch {
    return { completed: journey.initialCompleted, active: journey.defaultActive }
  }
}

export function saveProgress(language, progress) {
  localStorage.setItem(progressKey(language), JSON.stringify(progress))
}
