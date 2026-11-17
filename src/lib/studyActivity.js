const solvedDateKey = 'codegram.study.solved-date';
export const solvedProblemEvent = 'codegram:problem-solved';

function localDateKey(date = new Date()) {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${date.getFullYear()}-${month}-${day}`;
}

export function hasSolvedToday() {
  try {
    return window.localStorage.getItem(solvedDateKey) === localDateKey();
  } catch {
    return false;
  }
}

export function markProblemSolved() {
  try {
    window.localStorage.setItem(solvedDateKey, localDateKey());
  } catch {
    // The in-memory event still updates the flame for this open page.
  }
  window.dispatchEvent(new Event(solvedProblemEvent));
}

export function wasSolvedOnDate(timestamp, date = new Date()) {
  if (!timestamp) return false;
  const solvedAt = new Date(timestamp);
  return !Number.isNaN(solvedAt.getTime()) && localDateKey(solvedAt) === localDateKey(date);
}
