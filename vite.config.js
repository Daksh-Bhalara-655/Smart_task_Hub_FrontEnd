import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  const apiUrl =
    env.NEXT_PUBLIC_API_URL ||
    env.VITE_API_URL ||
    env.API_URL ||
    env.VITE_PUBLIC_API_URL ||
    '/api'
  const proxyTarget =
    env.API_PROXY_TARGET || env.VITE_API_PROXY_TARGET || 'http://127.0.0.1:5000'

  return {
    plugins: [react()],
    define: {
      'process.env.NEXT_PUBLIC_API_URL': JSON.stringify(apiUrl),
      'process.env.VITE_API_URL': JSON.stringify(apiUrl),
      'process.env.API_URL': JSON.stringify(apiUrl),
      'process.env.VITE_PUBLIC_API_URL': JSON.stringify(apiUrl),
    },
    server: {
      port: 3000,
      strictPort: true,
      proxy: {
        '/api': {
          target: proxyTarget,
          changeOrigin: true,
        },
      },
    },
  }
})
