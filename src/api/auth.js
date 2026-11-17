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

function finishLogin() {
  const savedPath = sessionStorage.getItem(returnPathKey)
  sessionStorage.removeItem(returnPathKey)
  const returnPath = journeyPathPattern.test(savedPath || '') ? savedPath : defaultJourneyPath
  location.replace(returnPath)
}

/**
 * 구글 로그인 콜백을 마무리합니다.
 * 백엔드는 /auth/callback?code=... 로 일회용 코드를 넘기므로, 이 코드를 POST /social/login/exchange 로 토큰으로 바꿉니다.
 * 예전 방식(?token=...)도 그대로 받아 줍니다.
 */
export async function completeGoogleLogin() {
  if (location.pathname !== '/auth/callback') return

  const params = new URLSearchParams(location.search)
  const token = params.get('token')
  const code = params.get('code')

  if (token) {
    setAccessToken(token)
  } else if (code) {
    try {
      const response = await fetch('/api/social/login/exchange', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ code }),
      })
      const payload = await response.json().catch(() => ({}))
      const issued = payload?.data?.token ?? payload?.token
      if (response.ok && typeof issued === 'string' && issued) setAccessToken(issued)
    } catch {
      // 교환에 실패하면 로그인 없이 학습 화면으로 돌아갑니다.
    }
  }

  finishLogin()
}
