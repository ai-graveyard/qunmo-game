import test from 'node:test';
import assert from 'node:assert/strict';
import worker from '../cloudflare/worker.mjs';
import { RUNTIME_FILES } from '../runtime-files.mjs';

const env = {
  ASSETS: {
    fetch: async (request) =>
      new Response(new URL(request.url).pathname, {
        headers: { 'Content-Type': request.url.endsWith('.mjs') ? 'text/javascript' : 'text/html' },
      }),
  },
};
const request = (path, options) => new Request('https://game.v2ai.org' + path, options);

test('Fork 可以使用根路径或自己的嵌套子路径，所有运行模块均可访问', async () => {
  for (const base of ['', '/my-game', '/games/paper-town']) {
    const configured = { ...env, BASE_PATH: base, HTTPS_HOST: '' };
    for (const file of RUNTIME_FILES) {
      const response = await worker.fetch(request(`${base}/${file}`), configured);
      assert.equal(response.status, 200);
      assert.equal(await response.text(), '/' + file);
    }
    assert.equal(await (await worker.fetch(request(base + '/'), configured)).text(), '/index.html');
    assert.equal((await worker.fetch(request(base + '/README.md'), configured)).status, 404);
    const head = await worker.fetch(request(base + '/app.mjs', { method: 'HEAD' }), configured);
    assert.equal(head.status, 200);
    assert.equal(await head.text(), '');
  }
});

test('无效部署路径明确报错，非本游戏的路径保持 404', async () => {
  assert.equal((await worker.fetch(request('/'), { ...env, BASE_PATH: '/' })).status, 500);
  assert.equal(
    (await worker.fetch(request('/my-game-other/'), { ...env, BASE_PATH: '/my-game' })).status,
    404,
  );
});

test('入口补尾斜杠且保留查询参数，使相对模块地址正确', async () => {
  const response = await worker.fetch(request('/qunmo?from=share'), env);
  assert.equal(response.status, 308);
  assert.equal(response.headers.get('Location'), 'https://game.v2ai.org/qunmo/?from=share');
});
test('正式域名统一到 HTTPS，本地开发仍可使用 HTTP', async () => {
  const production = await worker.fetch(new Request('http://game.v2ai.org/qunmo?from=share'), env);
  assert.equal(production.status, 308);
  assert.equal(production.headers.get('Location'), 'https://game.v2ai.org/qunmo/?from=share');
  const local = await worker.fetch(new Request('http://127.0.0.1:8787/qunmo/'), env);
  assert.equal(local.status, 200);
});
test('游戏页面和嵌套路径资源映射到对应静态文件', async () => {
  for (const [path, file] of [
    ['/qunmo/', '/index.html'],
    ['/qunmo/app.mjs', '/app.mjs'],
    ['/qunmo/game.css', '/game.css'],
  ]) {
    const response = await worker.fetch(request(path), env);
    assert.equal(response.status, 200);
    assert.equal(await response.text(), file);
    assert.equal(response.headers.get('Cache-Control'), 'no-cache');
  }
});
test('不把其他游戏路径和服务端文件误当成游戏页面', async () => {
  for (const path of [
    '/other-game/',
    '/app.mjs',
    '/qunmo/server.mjs',
    '/qunmo/package.json',
    '/qunmo/.env',
    '/qunmo/tests/engine.test.mjs',
    '/qunmo/unknown.mjs',
  ]) {
    assert.equal((await worker.fetch(request(path), env)).status, 404);
  }
});
test('不接管根入口，写入方法不被接收', async () => {
  assert.equal((await worker.fetch(request('/'), env)).status, 404);
  const response = await worker.fetch(request('/qunmo/', { method: 'POST' }), env);
  assert.equal(response.status, 405);
  assert.equal(response.headers.get('Allow'), 'GET, HEAD');
});
