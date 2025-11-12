import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

// Финальный vite.config.ts
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
    extensions: ['.js', '.jsx', '.ts', '.tsx', '.json'],
  },
  build: {
    target: 'esnext', // современный JS
    outDir: 'build',  // куда будет собираться проект
    sourcemap: true,  // удобнее дебажить в проде
  },
  server: {
    port: 3000,       // можно поменять, если нужно
    open: true,       // откроет браузер автоматически
  },
});
