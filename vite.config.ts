import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync } from 'node:fs';

export default defineConfig({
  plugins: [{
    name: 'static-legal-routes',
    closeBundle() {
      for (const route of ['privacy', 'terms']) {
        mkdirSync(`dist/${route}`, { recursive: true });
        copyFileSync('dist/index.html', `dist/${route}/index.html`);
      }
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
