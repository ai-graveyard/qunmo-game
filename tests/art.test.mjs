import test from 'node:test';
import assert from 'node:assert/strict';
import { sceneSVG } from '../period-art.mjs';

test('多个场景同时显示时 SVG 定义互不冲突，缩略图省略纸纹滤镜', () => {
  const first = sceneSVG('salon'),
    second = sceneSVG('night');
  const ids = (svg) => [...svg.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
  assert.ok(ids(first).length > 0);
  assert.equal(
    ids(first).some((id) => ids(second).includes(id)),
    false,
  );
  assert.match(first, /<g filter="url\(#scene-\d+-paper\)"/);
  assert.doesNotMatch(sceneSVG('house', { texture: false }), /<g filter="url\(#scene-\d+-paper\)"/);
});
