const tokenKey = 'codegram-access-token'
const returnPathKey = 'codegram-login-return-path'
export const returnModeKey = 'codegram-login-return-mode'
const defaultJourneyPath = '/journeys/html/fundamentals'
const journeyPathPattern = /^\/journeys\/(?:html|javascript|python|java)\/fundamentals(?:\/[^/?#]+)?$/

export function authorizationHeaders() {
  const token = typeof sessionStorage === 'undefined' ? null : sessionStorage.getItem(tokenKey)
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export function setAccessToken(token) {
  if (typeof sessionStorage !== 'undefined') sessionStorage.setItem(tokenKey, token)
}

export function clearAccessToken() {
  if (typeof sessionStorage !== 'undefined') sessionStorage.removeItem(tokenKey)
}

const viteEnv = import.meta.env ?? {}
const productionLoginUrl = 'https://codegram.me/api/social/login/google'

/**
 * Google 로그인 시작 주소를 반환합니다.
 * 백엔드는 로그인 시작 때 OAuth 쿠키를 저장하고 콜백에서 다시 읽습니다.
 * 로컬 개발에서 운영 백엔드를 쓰면 콜백이 codegram.me로 오므로, 쿠키도 codegram.me에 저장되도록 절대 주소로 시작합니다.
 * 로컬 백엔드를 쓸 때(VITE_API_TARGET 지정)는 프록시를 거치는 상대 경로를 사용합니다.
 */
export function googleLoginUrl(env = viteEnv) {
  if (env.VITE_GOOGLE_LOGIN_URL) return env.VITE_GOOGLE_LOGIN_URL
  if (env.DEV && !env.VITE_API_TARGET) return productionLoginUrl
  return '/api/social/login/google'
}

export function beginGoogleLogin(returnMode) {
  sessionStorage.setItem(returnPathKey, location.pathname)
  if (returnMode === 'quiz') sessionStorage.setItem(returnModeKey, 'quiz')
  else sessionStorage.removeItem(returnModeKey)
  location.assign(googleLoginUrl())
}

export function completeGoogleLogin() {
  if (location.pathname !== '/auth/callback') return

  const token = new URLSearchParams(location.search).get('token')
  if (token) setAccessToken(token)

  const savedPath = sessionStorage.getItem(returnPathKey)
  sessionStorage.removeItem(returnPathKey)
  const returnPath = journeyPathPattern.test(savedPath || '') ? savedPath : defaultJourneyPath
  location.replace(returnPath)
}
