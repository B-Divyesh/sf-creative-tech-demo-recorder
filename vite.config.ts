import { defineConfig } from 'vite';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';

export default defineConfig({
  plugins: [{
    name: 'static-app-routes',
    closeBundle() {
      const html = readFileSync('dist/index.html', 'utf8');
      const appScript = html.match(/src="(\/assets\/app-[^"]+\.js)"/)?.[1];
      const appStyles = html.match(/href="(\/assets\/index-[^"]+\.css)"/)?.[1];
      if (!appScript || !appStyles) throw new Error('Could not find hashed app assets for service-worker precache.');
      const worker = readFileSync('dist/sw.js', 'utf8').replace('__APP_JS__', appScript).replace('__APP_CSS__', appStyles);
      writeFileSync('dist/sw.js', worker);
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
        entryFileNames: 'assets/app-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
      },
    },
  },
});
