import react from '@vitejs/plugin-react'
import { defineConfig, loadEnv } from 'vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '')
  // 로컬 백엔드를 쓰려면 .env.local에 VITE_API_TARGET을 지정합니다. 기본값은 운영 서버입니다.
  const apiTarget = env.VITE_API_TARGET || 'https://codegram.me'

  return {
    plugins: [react()],
    server: {
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
