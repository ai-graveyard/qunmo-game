import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

import { RUNTIME_FILES } from './runtime-files.mjs';
const root = fileURLToPath(
  new URL(process.argv.includes('--dist') ? './dist/' : '.', import.meta.url),
);
const base = process.env.BASE_PATH ?? '';
if (base && !/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+$/.test(base))
  throw new Error('BASE_PATH 必须为空或不带末尾斜杠的路径');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};
const server = http.createServer(async (req, res) => {
  try {
    if (!['GET', 'HEAD'].includes(req.method)) {
      res.writeHead(405, { Allow: 'GET, HEAD' });
      res.end();
      return;
    }
    const url = new URL(req.url, 'http://localhost');
    if (base && url.pathname === base) {
      res.writeHead(308, { Location: base + '/' + url.search });
      res.end();
      return;
    }
    if (!url.pathname.startsWith(base + '/')) {
      res.writeHead(404);
      res.end();
      return;
    }
    const name = decodeURIComponent(url.pathname.slice(base.length));
    const target = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (
      !target.startsWith(root) ||
      !RUNTIME_FILES.includes(name === '/' ? 'index.html' : name.slice(1))
    ) {
      res.writeHead(404);
      res.end('Not found');
      return;
    }
    const body = await readFile(target);
    res.writeHead(200, {
      'Content-Type': types[path.extname(target)] || 'application/octet-stream',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    });
    res.end(req.method === 'HEAD' ? undefined : body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
let port = Number(process.env.PORT || 4173);
server.on('error', (error) => {
  if (!process.env.PORT && error.code === 'EADDRINUSE' && port < 4200)
    server.listen(++port, '127.0.0.1');
  else {
    console.error(error.message);
    process.exit(1);
  }
});
server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}${base}/`;
  console.log(`\n  群魔 · 小城纸影\n  本地游戏：${url}\n  按 Ctrl+C 停止\n`);
  if (process.argv.includes('--open') && process.platform === 'darwin') {
    import('node:child_process').then(({ spawn }) =>
      spawn('open', [url], { stdio: 'ignore' }).on('error', () => {}),
    );
  }
});
