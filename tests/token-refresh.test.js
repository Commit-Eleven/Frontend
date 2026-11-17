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

test('restores a missing access token from the refresh cookie', async (context) => {
  const values = setup(context, async (config) => {
    if (config.url === '/social/login/refresh') return { data: { data: { token: 'restored' } } }
    if (!config.headers.Authorization) throw { response: { status: 401 } }
    assert.equal(config.headers.Authorization, 'Bearer restored')
    return { data: { ok: true } }
  })
  values.delete('codegram-access-token')
  assert.deepEqual(await apiRequest({ url: '/one' }), { ok: true })
})

test('does not restore a token after logout while refresh is in flight', async (context) => {
  const { clearAccessToken } = await import('../src/api/auth.js')
  let finishRefresh
  let startedRefresh
  const started = new Promise((resolve) => { startedRefresh = resolve })
  const values = setup(context, async (config) => {
    if (config.url === '/social/login/refresh') {
      startedRefresh()
      return new Promise((resolve) => { finishRefresh = resolve })
    }
    throw { response: { status: 401 } }
  })
  const result = apiRequest({ url: '/one' })
  await started
  clearAccessToken()
  finishRefresh({ data: { data: { token: 'restored' } } })
  await assert.rejects(result)
  assert.equal(values.has('codegram-access-token'), false)
})
