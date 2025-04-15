import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/chat': {
        target: 'https://api.intelligence.io.solutions',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/api\/chat/, '/api/v1/chat'),
        secure: true,
      },
    },
  },
})
