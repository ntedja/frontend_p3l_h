import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8000', // ganti dengan URL Laravel kamu jika berbeda
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, 'api'),
      },
    },
  },
});
