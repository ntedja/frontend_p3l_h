import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    chunkSizeWarningLimit: 1000, // Naikkan limit warning
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          vendor: ['axios', 'react-router-dom'],
        },
      },
    },
  },
  server: {
    proxy: {
      '/api': {
        target: 'https://reusemart.site',
        changeOrigin: true,
        rewrite: (path: string) => path.replace(/^\/api/, 'api'),
      },
    },
  },
});
