import axios from 'axios';
import { authorizationHeaders, clearAccessToken, setAccessToken } from './auth.js';

/** 문제 API의 공통 주소와 JSON 응답 형식을 관리합니다. */
export const apiClient = axios.create({
  baseURL: '/api',
  headers: { Accept: 'application/json' },
});

let refreshPromise = null;

async function refreshAccessToken(previousAuthorization) {
  if (!refreshPromise) {
    refreshPromise = apiClient.request({
      url: '/social/login/refresh',
      method: 'POST',
      withCredentials: true,
    }).then((response) => {
      const token = response.data?.data?.token ?? response.data?.token;
      if (typeof token !== 'string' || !token.trim()) throw new Error('토큰 갱신 응답이 올바르지 않습니다.');
      if (authorizationHeaders().Authorization !== previousAuthorization) throw new Error('로그인 상태가 변경되었습니다.');
      setAccessToken(token);
      return token;
    }).finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}

/** 인증 토큰이 만료되면 쿠키로 한 번 갱신한 뒤 원래 요청을 재시도합니다. */
export async function apiRequest(config) {
  const authorization = authorizationHeaders().Authorization;
  const headers = { ...authorizationHeaders(), ...config.headers };
  try {
    try {
      return (await apiClient.request({ ...config, headers })).data;
    } catch (error) {
      const canRefresh = error.response?.status === 401 && authorization &&
        (!config.headers?.Authorization || config.headers.Authorization === authorization) &&
        !config.signal?.aborted && !config.url?.includes('/social/login/');
      if (!canRefresh) throw error;
      try {
        const current = authorizationHeaders().Authorization;
        const token = current && current !== authorization
          ? current.replace(/^Bearer /, '')
          : await refreshAccessToken(authorization);
        if (config.signal?.aborted) throw new axios.CanceledError();
        return (await apiClient.request({ ...config, headers: { ...headers, Authorization: `Bearer ${token}` } })).data;
      } catch (refreshError) {
        if (refreshError.response?.status === 401 && authorizationHeaders().Authorization === authorization) clearAccessToken();
        throw refreshError;
      }
    }
  } catch (error) {
    if (axios.isCancel(error) || config.signal?.aborted) throw error;
    const status = error.response?.status;
    const serverMessage = error.response?.data?.error?.message ?? error.response?.data?.message;
    const message = status === 401
      ? '로그인이 만료되었습니다. 다시 로그인해 주세요.'
      : serverMessage || (status ? `서버 요청에 실패했습니다. (${status})` : error.message);
    const requestError = new Error(message);
    requestError.status = status;
    requestError.code = error.response?.data?.error?.code;
    throw requestError;
  }
}
