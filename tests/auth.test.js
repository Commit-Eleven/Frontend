import test from 'node:test'
import assert from 'node:assert/strict'
import { authorizationHeaders, beginGoogleLogin, completeGoogleLogin, returnModeKey } from '../src/api/auth.js'

test('starts Google login at the backend and returns to the current lesson', (context) => {
  const originalLocation = globalThis.location
  const originalStorage = globalThis.sessionStorage
  const values = new Map()
  let loginUrl
  let returnUrl
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
  globalThis.location = {
    pathname: '/journeys/html/fundamentals/text-intro',
    assign: (url) => { loginUrl = url },
  }
  context.after(() => {
    globalThis.location = originalLocation
    globalThis.sessionStorage = originalStorage
  })

  beginGoogleLogin('quiz')
  assert.equal(loginUrl, 'https://codegram.me/api/social/login/google')
  assert.equal(values.get(returnModeKey), 'quiz')

  globalThis.location = {
    pathname: '/auth/callback',
    search: '?token=sample-token',
    replace: (url) => { returnUrl = url },
  }
  completeGoogleLogin()

  assert.deepEqual(authorizationHeaders(), { Authorization: 'Bearer sample-token' })
  assert.equal(returnUrl, '/journeys/html/fundamentals/text-intro')
})

test('returns to the selected programming language after Google login', (context) => {
  const originalLocation = globalThis.location
  const originalStorage = globalThis.sessionStorage
  const values = new Map()
  let returnUrl
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
  globalThis.location = {
    pathname: '/journeys/javascript/fundamentals/javascript-output',
    assign: () => {},
  }
  context.after(() => {
    globalThis.location = originalLocation
    globalThis.sessionStorage = originalStorage
  })

  beginGoogleLogin()
  globalThis.location = {
    pathname: '/auth/callback',
    search: '?token=sample-token',
    replace: (url) => { returnUrl = url },
  }
  completeGoogleLogin()

  assert.equal(returnUrl, '/journeys/javascript/fundamentals/javascript-output')
})
