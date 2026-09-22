import axios from 'axios';

const apiClient = axios.create({
  // 배포 환경에서는 현재 도메인의 HTTPS API만 호출하고, 개발 시에는 Vite 프록시를 사용합니다.
  baseURL: import.meta.env.VITE_API_BASE_URL || '/',
  timeout: 10_000,
  withCredentials: false,
  headers: {
    Accept: 'application/json',
  },
  validateStatus: (status) => status >= 200 && status < 300,
});

export default apiClient;
