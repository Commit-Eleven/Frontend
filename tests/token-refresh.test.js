import test from 'node:test'
import assert from 'node:assert/strict'
import { apiClient, apiRequest } from '../src/api/client.js'

function setup(context, handler) {
  const originalStorage = globalThis.sessionStorage
  const originalRequest = apiClient.request
  const values = new Map([['codegram-access-token', 'expired']])
  globalThis.sessionStorage = {
    getItem: (key) => values.get(key) ?? null,
    setItem: (key, value) => values.set(key, value),
    removeItem: (key) => values.delete(key),
  }
  apiClient.request = handler
  context.after(() => { globalThis.sessionStorage = originalStorage; apiClient.request = originalRequest })
  return values
}

test('concurrent unauthorized requests share a refresh and retry with the new token', async (context) => {
  let refreshes = 0
  const values = setup(context, async (config) => {
    if (config.url === '/social/login/refresh') {
      refreshes += 1
      assert.equal(config.withCredentials, true)
      return { data: { data: { token: 'renewed' } } }
    }
    if (config.headers.Authorization === 'Bearer expired') throw { response: { status: 401 } }
    assert.equal(config.headers.Authorization, 'Bearer renewed')
    return { data: { ok: true } }
  })
  assert.deepEqual(await Promise.all([apiRequest({ url: '/one' }), apiRequest({ url: '/two' })]), [{ ok: true }, { ok: true }])
  assert.equal(refreshes, 1)
  assert.equal(values.get('codegram-access-token'), 'renewed')
})

test('a rejected refresh clears the expired token', async (context) => {
  const values = setup(context, async () => { throw { response: { status: 401 } } })
  await assert.rejects(apiRequest({ url: '/one' }), { status: 401 })
  assert.equal(values.has('codegram-access-token'), false)
})
