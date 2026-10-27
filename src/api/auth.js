const tokenKey = 'codegram-access-token'
const returnPathKey = 'codegram-login-return-path'
export const returnModeKey = 'codegram-login-return-mode'
const defaultJourneyPath = '/journeys/html/fundamentals'
const journeyPathPattern = /^\/journeys\/(?:html|javascript|python|java)\/fundamentals(?:\/[^/?#]+)?$/

export function authorizationHeaders() {
  const token = typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(tokenKey)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function clearAccessToken() {
  if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(tokenKey)
}

export function beginGoogleLogin(returnMode) {
  sessionStorage.setItem(returnPathKey, location.pathname)
  if (returnMode === 'quiz') sessionStorage.setItem(returnModeKey, 'quiz')
  else sessionStorage.removeItem(returnModeKey)
  location.assign('https://codegram.me/api/social/login/google')
}

export function completeGoogleLogin() {
  if (location.pathname !== '/auth/callback') return

  const token = new URLSearchParams(location.search).get('token')
  if (token) sessionStorage.setItem(tokenKey, token)

  const savedPath = sessionStorage.getItem(returnPathKey)
  sessionStorage.removeItem(returnPathKey)
  const returnPath = journeyPathPattern.test(savedPath || '') ? savedPath : defaultJourneyPath
  location.replace(returnPath)
}
