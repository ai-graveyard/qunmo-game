import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, visit } from '../engine.mjs';
import { restore, MAX_SAVE_BYTES } from '../save.mjs';
import { readFileSync } from 'node:fs';
const started = () => ({ ...newGame(), started: true });

test('2026-11-02 旧版本完整通关存档继续兼容', () => {
  const legacy = JSON.parse(readFileSync(new URL('./fixtures/v1-completed.json', import.meta.url)));
  assert.deepEqual(restore(JSON.stringify(legacy)), legacy);
});

test('拒绝会令见闻录越界、超长或引用未知证据的记录', () => {
  const state = visit(started(), 'ledger');
  for (const patch of [
    { chapter: 99 },
    { chapter: -1 },
    { chapter: 1 },
    { title: 'x'.repeat(201) },
    { text: 'x'.repeat(5001) },
    { evidence: 'toString' },
    { evidence: 'missing' },
  ]) {
    assert.equal(restore(JSON.stringify({ ...state, log: [{ ...state.log[0], ...patch }] })), null);
  }
  assert.equal(restore(JSON.stringify({ ...state, log: Array(19).fill(state.log[0]) })), null);
});

test('拒绝未知标记、继承属性证据、异常统计与不一致的状态', () => {
  for (const patch of [
    { flags: { invented: true } },
    { flags: { savedLiza: 'false' } },
    { evidence: ['toString'] },
    { evidence: ['patron', 'patron'] },
    { stats: { ...started().stats, care: 1e9 } },
    { stats: { ...started().stats, care: 0.5 } },
    { stats: { ...started().stats, extra: 1 } },
    { visited: ['ledger'] },
    { chapter: 1 },
  ])
    assert.equal(restore(JSON.stringify({ ...started(), ...patch })), null);
  assert.equal(restore(JSON.stringify({ ...newGame(), flags: { savedLiza: true } })), null);
  assert.equal(restore(' '.repeat(MAX_SAVE_BYTES + 1)), null);
});

test('旧 v1 存档保持兼容，坐标修正并丢弃额外字段', () => {
  const state = visit(started(), 'ledger');
  assert.deepEqual(restore(JSON.stringify(state)), state);
  assert.equal(restore(JSON.stringify({ ...state, x: 100 })).x, 94);
  assert.equal(restore(JSON.stringify({ ...state, x: null })).x, 12);
  assert.deepEqual(restore(JSON.stringify({ ...state, unknown: '<script>' })), state);
});
