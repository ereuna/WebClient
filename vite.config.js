import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const REPO_API  = env.VITE_REPOSITORY_API_URL || 'http://localhost:8001'
  const DS_API    = env.VITE_DATASETS_API_URL   || 'http://localhost:8002'
  const AUTH_API  = env.VITE_AUTH_API_URL        || 'http://localhost:8000'
  const PLATFORM_API = env.VITE_PLATFORM_API_URL || 'http://localhost:8003'

  return {
    plugins: [react()],
    server: {
      port: 5173,
      proxy: {
        // AuthService  ->  :8000
        '/api/auth': {
          target: AUTH_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/auth/, '/api/v1'),
        },
        // RepositoryService  ->  :8001
        '/api/repository': {
          target: REPO_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/repository/, '/api/v1'),
        },
        // DatasetsService  ->  :8002
        '/api/datasets': {
          target: DS_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/datasets/, '/api/v1'),
        },
        // PlatformService  ->  :8003
        '/api/platform': {
          target: PLATFORM_API,
          changeOrigin: true,
          rewrite: path => path.replace(/^\/api\/platform/, '/api/v1'),
        },
      },
    },
  }
})
