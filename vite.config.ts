import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  root: './src/renderer',
  build: {
    outDir: '../../dist',
    emptyOutDir: true,
    rollupOptions: {
      input: './src/renderer/index.html',
    },
  },
  server: {
    port: 5173,
    host: true, // Allow access from network devices
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src/renderer/src'),
    },
  },
  base: './',
});