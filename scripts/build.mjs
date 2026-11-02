import { mkdir, rm, copyFile, writeFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';

const root = new URL('../', import.meta.url);
const dist = new URL('dist/', root);
export { RUNTIME_FILES as files } from '../runtime-files.mjs';
import { RUNTIME_FILES as files } from '../runtime-files.mjs';

await rm(dist, { recursive: true, force: true });
await mkdir(dist, { recursive: true });
const manifest = {};
for (const file of files) {
  const source = new URL(file, root);
  const destination = new URL(file, dist);
  await mkdir(new URL('.', destination), { recursive: true });
  await copyFile(source, destination);
  manifest[file] = createHash('sha256')
    .update(await readFile(source))
    .digest('hex');
}
await mkdir(new URL('output/', root), { recursive: true });
await writeFile(
  new URL('output/deploy-manifest.json', root),
  JSON.stringify(
    {
      files: manifest,
    },
    null,
    2,
  ) + '\n',
);
console.log(`已生成 dist/：${files.length} 个浏览器文件，可托管于根路径或任意子目录。`);
