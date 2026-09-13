import { defineConfig } from 'vite';
import path from 'node:path';

/**
 * GitHub Pages serves project sites from /<repo-name>/.
 * Locally we use "/". CI sets VITE_BASE_PATH to "/<repo>/" when deploying.
 */
const base = process.env.VITE_BASE_PATH || '/';

export default defineConfig({
  base,
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  server: {
    port: 5173,
    open: true,
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
