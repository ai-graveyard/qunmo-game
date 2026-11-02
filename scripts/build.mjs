import { mkdir, rm, copyFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
export const files = [
  'index.html', 'favicon.svg', 'style.css', 'period.css', 'game.css',
  'app.mjs', 'data.mjs', 'engine.mjs', 'art.mjs', 'period-art.mjs'
];

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const manifest = {};
for (const file of files) {
  const source = new URL(file, root);
  await copyFile(source, new URL(file, dist));
  manifest[file] = createHash('sha256').update(await readFile(source)).digest('hex');
}
await mkdir(new URL('output/', root), { recursive: true });
await writeFile(new URL('output/deploy-manifest.json', root), JSON.stringify({
  target: 'https://game.v2ai.org/qunmo/', files: manifest
}, null, 2) + '\n');
console.log(`已生成 dist/：${files.length} 个浏览器文件，部署路径 /qunmo/。`);
