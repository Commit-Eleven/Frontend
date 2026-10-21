import assert from 'node:assert/strict';
import test from 'node:test';
import { getViewFromPath } from '../src/app/routes.js';

// 인증 화면 진입 주소와 기존 학습 경로가 서로 겹치지 않는지 확인합니다.
test('opens the auth screen for entry and auth URLs', () => {
  for (const pathname of ['/', '/auth', '/login']) {
    assert.equal(getViewFromPath(pathname), 'auth');
  }
});

test('keeps each language journey and valid lesson routes available', () => {
  assert.equal(getViewFromPath('/journeys/html/fundamentals'), 'home');
  assert.equal(getViewFromPath('/journeys/html/fundamentals/paragraphs'), 'lesson');
  assert.equal(getViewFromPath('/journeys/javascript/fundamentals/javascript-output'), 'lesson');
  assert.equal(getViewFromPath('/journeys/python/fundamentals/python-output'), 'lesson');
  assert.equal(getViewFromPath('/journeys/java/fundamentals/java-output'), 'lesson');
  assert.equal(getViewFromPath('/journeys/html/fundamentals/not-a-lesson'), 'home');
});
