const BASE = '/qunmo';
const ASSETS = new Set([
  '/index.html',
  '/favicon.svg',
  '/style.css',
  '/period.css',
  '/game.css',
  '/app.mjs',
  '/data.mjs',
  '/engine.mjs',
  '/art.mjs',
  '/period-art.mjs',
]);

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    if (
      url.hostname === 'game.v2ai.org' &&
      url.protocol === 'http:' &&
      (url.pathname === BASE || url.pathname.startsWith(BASE + '/'))
    ) {
      url.protocol = 'https:';
      if (url.pathname === BASE) url.pathname = BASE + '/';
      return Response.redirect(url.toString(), 308);
    }
    if (url.pathname === BASE) {
      url.pathname = BASE + '/';
      return Response.redirect(url.toString(), 308);
    }
    if (!url.pathname.startsWith(BASE + '/')) return missing();
    const file =
      url.pathname.slice(BASE.length) === '/' ? '/index.html' : url.pathname.slice(BASE.length);
    if (!ASSETS.has(file)) return missing();
    url.pathname = file;
    const response = await env.ASSETS.fetch(new Request(url, request));
    const headers = new Headers(response.headers);
    headers.set('Cache-Control', 'no-cache');
    headers.set('X-Content-Type-Options', 'nosniff');
    return new Response(response.body, {
      status: response.status,
      statusText: response.statusText,
      headers,
    });
  },
};

function missing() {
  return new Response('Not found', {
    status: 404,
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
}
