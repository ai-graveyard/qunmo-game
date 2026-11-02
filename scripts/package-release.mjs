import { cp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { RUNTIME_FILES } from '../runtime-files.mjs';

const root = new URL('../', import.meta.url);
const { version } = JSON.parse(await readFile(new URL('package.json', root), 'utf8'));
const name = `qunmo-game-${version}`;
const releases = new URL('output/releases/', root);
const stage = new URL(`${name}/`, releases);
const archive = new URL(`${name}.zip`, releases);
await rm(stage, { recursive: true, force: true });
await mkdir(stage, { recursive: true });
for (const file of RUNTIME_FILES) {
  const destination = new URL(file, stage);
  await mkdir(new URL('.', destination), { recursive: true });
  await cp(new URL(`dist/${file}`, root), destination);
}
for (const file of [
  'LICENSE',
  'LICENSE-CONTENT.md',
  'LICENSES',
  'CREDITS.md',
  'README.md',
  'CONTRIBUTING.md',
  'CHANGELOG.md',
  'docs',
]) {
  await cp(new URL(file, root), new URL(file, stage), { recursive: true });
}
await writeFile(
  new URL('START-HERE.txt', stage),
  '群魔 · 小城纸影\n请通过静态 HTTP 服务器运行本目录，例如 python3 -m http.server 8080。\n然后打开 http://localhost:8080/ 。不要直接双击 index.html。\n源码及开发说明：https://github.com/ai-graveyard/qunmo-game\n软件 MIT；原创内容 CC BY 4.0，见随附许可证和 CREDITS.md。\n',
);
await rm(archive, { force: true });
execFileSync('zip', ['-qr', fileURLToPath(archive), name], { cwd: fileURLToPath(releases) });
const hash = createHash('sha256')
  .update(await readFile(archive))
  .digest('hex');
await writeFile(new URL(`${name}.zip.sha256`, releases), `${hash}  ${name}.zip\n`);
console.log(`发布包：${fileURLToPath(archive)}\nSHA-256：${hash}`);
