import assert from 'node:assert/strict';
import test from 'node:test';
import {
  readWrongNotes,
  recordWrongAnswer,
  resolveWrongNoteForProblem,
} from '../src/lib/wrongNotes.js';

class MemoryStorage {
  values = new Map();
  getItem(key) { return this.values.get(key) ?? null; }
  setItem(key, value) { this.values.set(key, String(value)); }
}

test('wrong answers are deduplicated, resolved, and reopened by another miss', () => {
  const previousStorage = globalThis.localStorage;
  const storage = new MemoryStorage();
  globalThis.localStorage = storage;

  try {
    const context = {
      language: 'javascript',
      lessonId: 'javascript-output',
      lessonTitle: '콘솔에 출력하기',
      type: 'mcq',
      problem: {
        id: 'problem-1',
        title: '출력하기',
        content: { choices: ['print()', 'console.log()'] },
      },
      source: 'server',
    };

    recordWrongAnswer({ ...context, submittedAnswer: 0, feedback: { answer: 1 } });
    recordWrongAnswer({ ...context, submittedAnswer: 0, feedback: { answer: 1 } });
    assert.equal(readWrongNotes().length, 1);
    assert.equal(readWrongNotes()[0].wrongCount, 2);
    assert.equal(readWrongNotes()[0].status, 'unresolved');

    resolveWrongNoteForProblem({
      language: context.language,
      lessonId: context.lessonId,
      type: context.type,
      problemId: context.problem.id,
    });
    assert.equal(readWrongNotes()[0].status, 'resolved');

    recordWrongAnswer({ ...context, submittedAnswer: 0, feedback: { answer: 1 } });
    assert.equal(readWrongNotes()[0].status, 'unresolved');
    assert.equal(readWrongNotes()[0].wrongCount, 3);
    assert.equal(readWrongNotes()[0].expectedAnswer, 1);
  } finally {
    if (previousStorage === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = previousStorage;
  }
});
