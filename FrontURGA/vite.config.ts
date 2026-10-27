import react from '@vitejs/plugin-react'
import { defineConfig } from 'vitest/config'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'X-Content-Type-Options': 'nosniff',
      'Content-Security-Policy': "default-src 'self'; connect-src 'self' https://weburga.onrender.com http://localhost:3000; img-src 'self' blob: data:; style-src 'self' 'unsafe-inline'; script-src 'self' 'unsafe-inline'; frame-src 'self' blob: data:; object-src 'self' blob: data:;",
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: './src/setupTests.ts',
    css: true,
  }
})
