import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true,
    proxy: {
      '/api/sheets': {
        target: 'https://script.google.com/macros/s/AKfycbzOPmeOPxlKXw5B6gHVdSI-EW4KggHdoq21hxC5twQe0bZg8MytHhVljwcqFfrdevp7/exec',
        changeOrigin: true,
        rewrite: () => '',
        secure: true,
        followRedirects: false,
      }
    }
  }
})
