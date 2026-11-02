import { RUNTIME_FILES } from '../runtime-files.mjs';
const ASSETS = new Set(RUNTIME_FILES.map((file) => '/' + file));

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const BASE = env.BASE_PATH ?? '/qunmo';
    if (BASE !== '' && !/^\/(?:[a-zA-Z0-9_-]+\/)*[a-zA-Z0-9_-]+$/.test(BASE)) {
      return new Response('Invalid BASE_PATH', { status: 500 });
    }
    const httpsHost = env.HTTPS_HOST ?? 'game.v2ai.org';
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', { status: 405, headers: { Allow: 'GET, HEAD' } });
    }
    if (
      httpsHost &&
      url.hostname === httpsHost &&
      url.protocol === 'http:' &&
      (url.pathname === BASE || url.pathname.startsWith(BASE + '/'))
    ) {
      url.protocol = 'https:';
      if (BASE && url.pathname === BASE) url.pathname = BASE + '/';
      return Response.redirect(url.toString(), 308);
    }
    if (BASE && url.pathname === BASE) {
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
    return new Response(request.method === 'HEAD' ? null : response.body, {
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
