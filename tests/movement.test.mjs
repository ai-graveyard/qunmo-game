import test from 'node:test';
import assert from 'node:assert/strict';
import { stepMovement, cameraTarget } from '../ui/movement.mjs';

test('暂停时停止移动，恢复后继续原目标', () => {
  const target = { x: 80, id: 'stepan' };
  assert.deepEqual(stepMovement(30, new Set(['d']), target, 0.05, false), {
    x: 30,
    dir: 0,
    target,
    arrived: null,
  });
});
test('自动行走不会越过目标，手动移动取消目标，坐标保持边界内', () => {
  const target = { x: 31, id: 'stepan' };
  assert.equal(stepMovement(30, new Set(), target, 0.05, true).x, 31);
  assert.deepEqual(stepMovement(31, new Set(), target, 0.05, true).arrived, target);
  assert.equal(stepMovement(30, new Set(['d']), target, 0.05, true).target, null);
  assert.equal(stepMovement(94, new Set(['d']), null, 1, true).x, 94);
  assert.equal(cameraTarget(94, 1500, 390), 1110);
});

test('掉帧时按实际经过时间行走，长时间挂起仍限制单帧步长', () => {
  assert.equal(stepMovement(12, new Set(['d']), null, 0.2, true).x, 16);
  assert.equal(stepMovement(12, new Set(['d']), null, 10, true).x, 17);
});
