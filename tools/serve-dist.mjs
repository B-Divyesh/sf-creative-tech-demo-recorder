import { createReadStream, existsSync, statSync } from 'node:fs';
import { createServer } from 'node:http';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve('dist');
const portArgument = process.argv.indexOf('--port');
const port = Number(portArgument >= 0 ? process.argv[portArgument + 1] : process.env.PORT || 4173);
const routeFiles = new Map([
  ['/', 'index.html'],
  ['/demo', 'demo/index.html'],
  ['/privacy', 'privacy/index.html'],
  ['/terms', 'terms/index.html'],
  ['/404', '404/index.html'],
]);
const contentTypes = new Map([
  ['.avif', 'image/avif'],
  ['.css', 'text/css; charset=utf-8'],
  ['.html', 'text/html; charset=utf-8'],
  ['.jpg', 'image/jpeg'],
  ['.js', 'text/javascript; charset=utf-8'],
  ['.json', 'application/json; charset=utf-8'],
  ['.png', 'image/png'],
  ['.svg', 'image/svg+xml'],
  ['.txt', 'text/plain; charset=utf-8'],
  ['.webm', 'video/webm'],
  ['.webmanifest', 'application/manifest+json'],
  ['.webp', 'image/webp'],
  ['.woff2', 'font/woff2'],
  ['.xml', 'application/xml; charset=utf-8'],
]);
const securityHeaders = {
  'content-security-policy': "default-src 'self'; script-src 'self'; style-src 'self'; img-src 'self' data: blob:; media-src 'self' blob:; font-src 'self'; connect-src 'self' https://api.sociobot.in; worker-src 'self'; manifest-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self' https://api.sociobot.in; frame-ancestors 'none'; upgrade-insecure-requests",
  'permissions-policy': 'camera=(), geolocation=(), display-capture=(self), microphone=(self)',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'x-content-type-options': 'nosniff',
  'x-frame-options': 'DENY',
};

function resolveRequest(pathname) {
  const route = pathname.length > 1 ? pathname.replace(/\/$/, '') : pathname;
  const routeFile = routeFiles.get(route);
  if (routeFile) return { file: join(root, routeFile), status: 200 };

  const relative = normalize(decodeURIComponent(pathname)).replace(/^[/\\]+/, '');
  const candidate = resolve(root, relative);
  if (candidate.startsWith(`${root}/`) && existsSync(candidate) && statSync(candidate).isFile()) {
    return { file: candidate, status: 200 };
  }
  return { file: join(root, '404.html'), status: 404 };
}

createServer((request, response) => {
  if (!['GET', 'HEAD'].includes(request.method || '')) {
    response.writeHead(405, { allow: 'GET, HEAD' });
    response.end();
    return;
  }

  let resolved;
  try {
    resolved = resolveRequest(new URL(request.url || '/', 'http://127.0.0.1').pathname);
  } catch {
    resolved = { file: join(root, '404.html'), status: 404 };
  }
  const stats = statSync(resolved.file);
  const headers = {
    ...securityHeaders,
    'content-type': contentTypes.get(extname(resolved.file)) || 'application/octet-stream',
    'accept-ranges': 'bytes',
  };
  const range = resolved.status === 200 && request.headers.range?.match(/^bytes=(\d+)-(\d*)$/);
  if (range) {
    const start = Number(range[1]);
    const end = range[2] ? Math.min(Number(range[2]), stats.size - 1) : stats.size - 1;
    if (start > end || start >= stats.size) {
      response.writeHead(416, { ...headers, 'content-range': `bytes */${stats.size}` });
      response.end();
      return;
    }
    response.writeHead(206, { ...headers, 'content-length': String(end - start + 1), 'content-range': `bytes ${start}-${end}/${stats.size}` });
    if (request.method === 'HEAD') response.end();
    else createReadStream(resolved.file, { start, end }).pipe(response);
    return;
  }

  response.writeHead(resolved.status, { ...headers, 'content-length': String(stats.size) });
  if (request.method === 'HEAD') response.end();
  else createReadStream(resolved.file).pipe(response);
}).listen(port, '127.0.0.1', () => {
  process.stdout.write(`Demo Loop test server listening on http://127.0.0.1:${port}\n`);
});
