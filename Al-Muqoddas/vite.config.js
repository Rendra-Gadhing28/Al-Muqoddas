import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true,
    proxy: {
      '/api/sheets': {
<<<<<<< HEAD
        target: 'https://script.google.com/macros/s/AKfycbz_phI1d9GBuGZW9S9AHuCN8VTGReP6Z72J85I-xvu8LyVLoH-ZyU82n3qJUJKDkmzW/exec',
=======
        target: 'https://script.google.com/macros/s/AKfycbzlOqJ1gUbEK8s1b_7U0juHD6E9YKI65k79VqnOEnDpZiex5k-vwH46Blk_83EYhOgS/exec',
>>>>>>> d3a5e732e687607c9a88aea930cd1a784711ceba
        changeOrigin: true,
        rewrite: () => '',
        secure: true,
        followRedirects: false,
      }
    }
  }
})
