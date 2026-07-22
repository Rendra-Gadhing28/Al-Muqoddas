import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true,
    proxy: {
      '/api/sheets': {
        target: 'https://script.google.com/macros/s/AKfycbzlOqJ1gUbEK8s1b_7U0juHD6E9YKI65k79VqnOEnDpZiex5k-vwH46Blk_83EYhOgS/exec',
        changeOrigin: true,
        rewrite: () => '',
        secure: true,
        followRedirects: false,
      }
    }
  }
})
