/** 설정된 백엔드에서 Google OAuth 로그인 시작 주소를 반환합니다. */
export function getGoogleLoginUrl() {
  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL?.trim() || window.location.origin;
  const loginUrl = new URL('/api/social/login/google', apiBaseUrl);
  if (!['http:', 'https:'].includes(loginUrl.protocol)) {
    throw new Error('지원하지 않는 인증 서버 주소입니다.');
  }
  return loginUrl.href;
}

/** 서버의 리다이렉트를 따라 Google 인증 페이지로 이동합니다. */
export function startGoogleLogin() {
  window.location.assign(getGoogleLoginUrl());
}
