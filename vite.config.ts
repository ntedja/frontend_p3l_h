import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': {
        target: 'https://reusemart.site', // ganti dengan URL Laravel kamu jika berbeda
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, 'api'),
      },
    },
  },
});
