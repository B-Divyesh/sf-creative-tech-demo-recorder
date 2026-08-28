import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';

export default defineConfig({
  plugins: [{
    name: 'static-app-routes',
    closeBundle() {
      for (const route of ['demo', 'privacy', 'terms', '404']) {
        mkdirSync(`dist/${route}`, { recursive: true });
        copyFileSync('dist/index.html', `dist/${route}/index.html`);
      }
      copyFileSync('dist/index.html', 'dist/404.html');
    },
  }],
  build: {
    target: 'es2022',
    outDir: 'dist',
    assetsInlineLimit: 2048,
    rollupOptions: {
      output: {
        entryFileNames: 'assets/app.js',
        chunkFileNames: 'assets/[name].js',
        assetFileNames: 'assets/[name][extname]',
      },
    },
  },
});
