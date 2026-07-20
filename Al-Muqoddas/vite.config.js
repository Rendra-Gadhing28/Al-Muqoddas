import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    host: true,
    proxy: {
      '/api/sheets': {
        target: 'https://script.google.com/macros/s/AKfycbwXca_pg69ssnx6bupPqXoe7Uw-TiFnXtPbst0cW8rOhe0JZUAxhzIaIYmJE-HKix-K/exec',
        changeOrigin: true,
        rewrite: () => '',
        secure: true,
        followRedirects: false,
      }
    }
  }
})
