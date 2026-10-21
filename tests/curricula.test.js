import test from 'node:test';
import assert from 'node:assert/strict';
import { journeyFor } from '../src/data/curricula.js';
import { challengeFor, starterCodeFor } from '../src/data/challenges.js';

test('each programming language has its own curriculum and first lesson', () => {
  for (const language of ['javascript', 'python', 'java']) {
    const journey = journeyFor(language);
    assert.equal(journey.language, language);
    assert.ok(journey.title.toLowerCase().includes(language === 'javascript' ? 'javascript' : language));
    assert.equal(journey.allMainLessons[0].id, journey.defaultActive);
    assert.equal(journey.chapterData.length, 3);
    assert.ok(journey.allMainLessons.length >= 10);
  }

  assert.notEqual(journeyFor('javascript').defaultActive, journeyFor('html').defaultActive);
  assert.notEqual(journeyFor('python').defaultActive, journeyFor('java').defaultActive);
});

test('language lessons provide matching starter code and coding tasks', () => {
  const samples = [
    ['javascript', 'javascript-output', 'console.log('],
    ['python', 'python-output', 'print('],
    ['java', 'java-output', 'class Main'],
  ];

  for (const [language, lessonId, expectedStarter] of samples) {
    const journey = journeyFor(language);
    const lesson = journey.allNodes.find((node) => node.id === lessonId);
    const challenge = challengeFor(lesson, language);
    assert.ok(starterCodeFor(language).length > 0);
    assert.ok(challenge.instruction.length > 0);
    assert.ok(challenge.theory.length > 0);
    assert.ok(challenge.example.includes(expectedStarter));
    assert.ok(challenge.checks.length > 0);
  }
});
