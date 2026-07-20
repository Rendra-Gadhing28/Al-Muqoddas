import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
   server: {
    proxy: {
      '/api/sheets': {
        target: 'https://script.google.com/macros/s/AKfycbxzC5Hv3l-X0q78gW0XVu4LA4AI3ZjXfQmobi2HCjlQqDnZSXVGkGTLJFypMy-0uH5L/exec',
        changeOrigin: true,
        rewrite: () => '',
        secure: true,
        followRedirects: true,
      }
    }
  }
})
