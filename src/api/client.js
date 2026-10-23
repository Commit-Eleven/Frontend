import axios from 'axios';
import { authorizationHeaders, clearAccessToken } from './auth.js';

/** 문제 API의 공통 주소와 JSON 응답 형식을 관리합니다. */
export const apiClient = axios.create({
  baseURL: '/api',
  headers: { Accept: 'application/json' },
});

/** 인증 헤더와 오류 처리를 적용해 API 응답 데이터를 반환합니다. */
export async function apiRequest(config) {
  try {
    const response = await apiClient.request({
      ...config,
      headers: { ...authorizationHeaders(), ...config.headers },
    });
    return response.data;
  } catch (error) {
    const status = error.response?.status;
    if (status === 401) clearAccessToken();
    const message = status === 401
      ? '문제를 불러오려면 로그인해 주세요.'
      : status
        ? `문제 서버 요청에 실패했습니다. (${status})`
        : error.message;
    const requestError = new Error(message);
    requestError.status = status;
    throw requestError;
  }
}
