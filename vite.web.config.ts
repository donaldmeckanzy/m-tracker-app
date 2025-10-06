import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './src/web',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/web/index.html',
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer/src'),
    },
  },
  base: './',
});