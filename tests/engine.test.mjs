import test from 'node:test';
import assert from 'node:assert/strict';
import { newGame, visit, resolveEvent, ending, available, restore } from '../engine.mjs';
import { CHAPTERS } from '../data.mjs';

function act(s, a, b, event) {
  s = visit(s, ...a);
  s = visit(s, ...b);
  return resolveEvent(s, event);
}
function beginning() {
  let s = newGame();
  s.started = true;
  return s;
}
test('走访需要确认，不能重复消耗、超额走访或提前推进', () => {
  const original = beginning(),
    s = visit(original, 'ledger');
  assert.equal(original.visited.length, 0);
  assert.deepEqual(s.evidence, ['patron']);
  assert.throws(() => visit(s, 'ledger'));
  assert.throws(() => resolveEvent(s, 0));
  const two = visit(s, 'stepan', 0);
  assert.throws(() => visit(two, 'varvara', 0));
  const next = resolveEvent(two, 0);
  assert.equal(next.chapter, 1);
  assert.deepEqual(next.visited, []);
});
test('秘密婚姻须先获得证言，确认后记录持久保存', () => {
  let s = act(beginning(), ['ledger'], ['stepan', 0], 0);
  assert.throws(() => visit(s, 'stavrogin2', 0));
  s = visit(s, 'marya', 0);
  s = visit(s, 'stavrogin2', 0);
  assert.equal(s.flags.marriageConfirmed, true);
  assert.equal(s.stats.clarity, 4);
  assert.deepEqual(restore(JSON.stringify(s)), s);
});
test('六幕介入路线可达，两个走访内可完成丽莎撤离条件', () => {
  let s = act(beginning(), ['ledger'], ['stepan', 0], 0);
  s = act(s, ['marya', 0], ['stavrogin2', 0], 0);
  s = act(s, ['names'], ['shatov', 0], 0);
  s = visit(s, 'crowd');
  s = visit(s, 'exit');
  assert.equal(available(CHAPTERS[3].event.choices[0], s), true);
  s = resolveEvent(s, 0);
  assert.equal(s.flags.savedLiza, true);
  s = act(s, ['invitation', 0], ['shatov5', 0], 0);
  assert.equal(s.flags.savedShatov, true);
  s = act(s, ['archive'], ['survivors'], 0);
  assert.equal(s.finished, true);
  assert.equal(s.log.length, 18);
  assert.equal(ending(s).type, '介入者');
  assert.throws(() => resolveEvent(s, 0));
  assert.throws(() => visit(s, 'empty'));
  assert.deepEqual(restore(JSON.stringify(s)), s);
});
test('基里洛夫支线可达，最后一夜不同时营救两边', () => {
  let s = act(beginning(), ['stepan', 0], ['varvara', 1], 0);
  s = act(s, ['marya', 0], ['receipt'], 0);
  s = act(s, ['shigalyov', 0], ['pyotr', 0], 0);
  s = act(s, ['liza', 1], ['exit'], 1);
  assert.equal(available(CHAPTERS[4].event.choices[0], s), false);
  s = visit(s, 'kirillov', 0);
  s = visit(s, 'shatov5', 0);
  s = resolveEvent(s, 1);
  assert.equal(s.flags.helpedKirillov, true);
  assert.equal(s.flags.savedShatov, undefined);
  s = act(s, ['archive'], ['empty'], 0);
  assert.equal(ending(s).type, '介入者');
});
test('传话者与见证者都有完整可达路线', () => {
  let s = act(beginning(), ['varvara', 0], ['stepan', 1], 1);
  s = act(s, ['lebyadkin', 1], ['receipt'], 1);
  s = act(s, ['pyotr', 1], ['shigalyov', 1], 1);
  s = act(s, ['stepan4', 1], ['liza', 1], 2);
  s = act(s, ['pyotr5', 1], ['shatov5', 1], 2);
  s = act(s, ['varvara6', 1], ['empty'], 1);
  assert.equal(s.finished, true);
  assert.equal(ending(s).type, '传话者');
  let w = act(beginning(), ['ledger'], ['stepan', 0], 0);
  w = act(w, ['receipt'], ['lebyadkin', 0], 0);
  w = act(w, ['names'], ['shigalyov', 0], 0);
  w = act(w, ['crowd'], ['stepan4', 1], 2);
  w = act(w, ['invitation', 0], ['pyotr5', 0], 2);
  w = act(w, ['archive'], ['empty'], 0);
  assert.equal(ending(w).type, '见证者');
});
test('损坏的、越界的和不兼容存档安全退回', () => {
  assert.equal(restore('bad json'), null);
  assert.equal(restore('null'), null);
  for (const patch of [
    { chapter: 99 },
    { evidence: ['unknown'] },
    { visited: ['missing'] },
    { stats: {} },
    { log: [{}] },
    { finished: true },
    { flags: [] },
    { visited: ['ledger', 'ledger'] },
  ]) {
    assert.equal(restore(JSON.stringify({ ...beginning(), ...patch })), null);
  }
});
