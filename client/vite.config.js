import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    // While developing, the React app runs on :5173 and Express on :3001.
    // Any request to /api/... is forwarded to Express, so the browser only ever
    // talks to ONE address (same origin). That means no CORS setup is needed.
    proxy: {
      '/api': 'http://localhost:3001',
    },
  },
})
