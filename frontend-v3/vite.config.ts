import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    emptyOutDir: true
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://servicenexus.shuttleapp.rs',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, '/timetable')
      }
    }
  }
})
