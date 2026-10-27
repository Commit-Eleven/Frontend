const storageKey = 'codegram-wrong-notes-v1';
export const wrongNotesChangeEvent = 'codegram-wrong-notes-change';

function getStorage() {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

function clone(value) {
  if (value === undefined) return undefined;
  try {
    return JSON.parse(JSON.stringify(value));
  } catch {
    return undefined;
  }
}

function notifyChange() {
  if (typeof window === 'undefined' || typeof window.dispatchEvent !== 'function') return;
  window.dispatchEvent(new Event(wrongNotesChangeEvent));
}

export function wrongNoteId({ language, lessonId, type, problemId }) {
  return [language, lessonId, type, problemId].map((value) => encodeURIComponent(String(value ?? ''))).join('::');
}

export function readWrongNotes() {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(storageKey) || '[]');
    return Array.isArray(parsed) ? parsed.filter((note) => note && typeof note.id === 'string') : [];
  } catch {
    return [];
  }
}

function writeWrongNotes(notes) {
  const storage = getStorage();
  if (!storage) return false;
  try {
    storage.setItem(storageKey, JSON.stringify(notes));
    notifyChange();
    return true;
  } catch {
    return false;
  }
}

export function recordWrongAnswer({
  language,
  lessonId,
  lessonTitle,
  type,
  problem,
  submittedAnswer,
  feedback,
  source = 'concept',
}) {
  if (!language || !lessonId || !type || !problem?.id) return null;
  const notes = readWrongNotes();
  const id = wrongNoteId({ language, lessonId, type, problemId: problem.id });
  const previous = notes.find((note) => note.id === id);
  const now = new Date().toISOString();
  const expectedAnswer = clone(feedback?.answer);
  const note = {
    id,
    language,
    lessonId: String(lessonId),
    lessonTitle: String(lessonTitle || ''),
    type,
    source,
    problem: clone(problem),
    submittedAnswer: clone(submittedAnswer),
    ...(expectedAnswer === undefined ? {} : { expectedAnswer }),
    explanation: String(feedback?.explanation || problem.content?.explanation || ''),
    lastResults: clone(feedback?.results) || [],
    wrongCount: (previous?.wrongCount || 0) + 1,
    status: 'unresolved',
    createdAt: previous?.createdAt || now,
    lastWrongAt: now,
    resolvedAt: null,
  };
  const next = previous
    ? notes.map((item) => (item.id === id ? note : item))
    : [note, ...notes];
  return writeWrongNotes(next) ? note : null;
}

export function resolveWrongNote(id) {
  const notes = readWrongNotes();
  const target = notes.find((note) => note.id === id);
  if (!target || target.status === 'resolved') return target ?? null;
  const resolved = { ...target, status: 'resolved', resolvedAt: new Date().toISOString() };
  return writeWrongNotes(notes.map((note) => (note.id === id ? resolved : note))) ? resolved : null;
}

export function resolveWrongNoteForProblem({ language, lessonId, type, problemId }) {
  return resolveWrongNote(wrongNoteId({ language, lessonId, type, problemId }));
}
