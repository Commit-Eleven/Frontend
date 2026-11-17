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

export function wrongNoteId({ language, type, problemId, title }) {
  const key = String(title || '').trim() || problemId;
  return [language, type, key].map((value) => encodeURIComponent(String(value ?? ''))).join('::');
}

function noteKey(note) {
  return wrongNoteId({
    language: note.language,
    type: note.type,
    problemId: note.problem?.id,
    title: note.problem?.title,
  });
}

function mergeDuplicates(notes) {
  const map = new Map();
  notes.forEach((note) => {
    const id = noteKey(note);
    const prev = map.get(id);
    if (!prev) {
      map.set(id, { ...note, id });
      return;
    }
    const newer = (note.lastWrongAt || '') >= (prev.lastWrongAt || '') ? note : prev;
    map.set(id, {
      ...newer,
      id,
      lessonTitle: newer.lessonTitle || prev.lessonTitle || note.lessonTitle,
      wrongCount: (prev.wrongCount || 0) + (note.wrongCount || 0),
      createdAt: [prev.createdAt, note.createdAt].filter(Boolean).sort()[0] || newer.createdAt,
      status: prev.status === 'unresolved' || note.status === 'unresolved' ? 'unresolved' : 'resolved',
      resolvedAt: prev.status === 'unresolved' || note.status === 'unresolved' ? null : newer.resolvedAt,
    });
  });
  return [...map.values()];
}

export function readWrongNotes() {
  const storage = getStorage();
  if (!storage) return [];
  try {
    const parsed = JSON.parse(storage.getItem(storageKey) || '[]');
    return Array.isArray(parsed)
      ? mergeDuplicates(parsed.filter((note) => note && typeof note.id === 'string' && note.problem))
      : [];
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
  const id = wrongNoteId({ language, type, problemId: problem.id, title: problem.title });
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

export function resolveWrongNoteForProblem({ language, type, problemId, problem }) {
  return resolveWrongNote(
    wrongNoteId({ language, type, problemId, title: problem?.title }),
  );
}
