import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';

const root = fileURLToPath(new URL('.', import.meta.url));
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
};
const server = http.createServer(async (req, res) => {
  try {
    const name = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    const target = path.resolve(root, '.' + (name === '/' ? '/index.html' : name));
    if (
      !target.startsWith(root) ||
      name.split('/').some((part) => part.startsWith('.')) ||
      !['.html', '.css', '.mjs', '.svg', '.png'].includes(path.extname(target)) ||
      name.startsWith('/tests/')
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
    res.end(body);
  } catch {
    res.writeHead(404);
    res.end('Not found');
  }
});
let port = Number(process.env.PORT || 4173);
server.on('error', (error) => {
  if (error.code === 'EADDRINUSE' && port < 4200) server.listen(++port, '127.0.0.1');
  else {
    console.error(error.message);
    process.exit(1);
  }
});
server.listen(port, '127.0.0.1', () => {
  const url = `http://127.0.0.1:${port}`;
  console.log(`\n  群魔 · 小城纸影\n  本地游戏：${url}\n  按 Ctrl+C 停止\n`);
  if (process.argv.includes('--open') && process.platform === 'darwin') {
    import('node:child_process').then(({ spawn }) =>
      spawn('open', [url], { stdio: 'ignore' }).on('error', () => {}),
    );
  }
});
