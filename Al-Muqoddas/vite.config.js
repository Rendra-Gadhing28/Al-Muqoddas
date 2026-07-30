import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true,
    proxy: {
      '/api/sheets': {
        target: 'https://script.google.com/macros/s/AKfycbz_phI1d9GBuGZW9S9AHuCN8VTGReP6Z72J85I-xvu8LyVLoH-ZyU82n3qJUJKDkmzW/exec',
        changeOrigin: true,
        rewrite: () => '',
        secure: true,
        followRedirects: false,
      }
    }
  }
})
