import { pathToFileURL } from 'node:url';
import { CHAPTERS, PEOPLE, EVIDENCE, RELATIONS } from '../data.mjs';
import { newGame, visit, resolveEvent, available } from '../engine.mjs';
import { STAT_KEYS } from '../save.mjs';

export function validateStory({ chapters, people, evidence, relations }) {
  const errors = [];
  const check = (condition, message) => {
    if (!condition) errors.push(message);
  };
  const peopleIds = new Set(people.map((p) => p.id));
  check(peopleIds.size === people.length, '人物 ID 重复');
  const actions = chapters.flatMap((c) => [
    ...c.hotspots.flatMap((h) => [h, ...(h.choices || [])]),
    ...c.event.choices,
  ]);
  const flags = new Set(actions.flatMap((a) => (a.flag ? [a.flag] : [])));
  const hasEvidence = (id) => Object.hasOwn(evidence, id);
  chapters.forEach((chapter, index) => {
    const label = `第 ${index + 1} 幕`;
    check(chapter.hotspots.length >= 2, `${label}需要至少两个地点`);
    check(
      new Set(chapter.hotspots.map((h) => h.id)).size === chapter.hotspots.length,
      `${label}地点 ID 重复`,
    );
    check(
      chapter.event.choices.length > 0 && chapter.event.choices.length <= 3,
      `${label}幕间选项需要 1–3 个`,
    );
    for (const hotspot of chapter.hotspots) {
      check(
        Number.isFinite(hotspot.x) && hotspot.x >= 10 && hotspot.x <= 90,
        `${label} ${hotspot.id} 坐标不在可走近范围`,
      );
      if (hotspot.choices)
        check(
          hotspot.choices.length > 0 && hotspot.choices.length <= 3,
          `${hotspot.id}选项需要 1–3 个`,
        );
    }
    if (chapter.event.person) check(peopleIds.has(chapter.event.person), `${label}幕间人物不存在`);
  });
  for (const action of actions) {
    if (action.person) check(peopleIds.has(action.person), `人物不存在：${action.person}`);
    for (const id of [action.evidence, action.requires].filter(Boolean))
      check(hasEvidence(id), `证据不存在：${id}`);
    for (const flag of action.requiresFlags || []) check(flags.has(flag), `标记不存在：${flag}`);
    for (const [key, value] of Object.entries(action.effects || {})) {
      check(
        STAT_KEYS.includes(key) && Number.isInteger(value) && value >= 0,
        `无效数值效果：${key}`,
      );
    }
  }
  for (const [from, to, , requirement] of relations) {
    check(peopleIds.has(from) && peopleIds.has(to), `关系人物不存在：${from} / ${to}`);
    if (requirement)
      check(
        hasEvidence(requirement) || flags.has(requirement),
        `关系前置条件不存在：${requirement}`,
      );
  }
  return errors;
}

// Merge paths only when future choice eligibility is identical. Statistics and
// prose do not gate choices; evidence, required flags and this act's visits do.
export function unreachableChoices() {
  const requiredFlags = [
    ...new Set(
      CHAPTERS.flatMap((c) =>
        [...c.hotspots.flatMap((h) => h.choices || []), ...c.event.choices].flatMap(
          (a) => a.requiresFlags || [],
        ),
      ),
    ),
  ];
  const key = (s) =>
    JSON.stringify([
      s.chapter,
      s.finished,
      [...s.evidence].sort(),
      requiredFlags.map((f) => !!s.flags[f]),
      [...s.visited].sort(),
    ]);
  const initial = { ...newGame(), started: true };
  const queue = [initial],
    seen = new Set([key(initial)]),
    reachable = new Set(),
    expected = [];
  CHAPTERS.forEach((c, chapter) => {
    c.hotspots.forEach((h) =>
      (h.choices || []).forEach((_, i) => expected.push(`${chapter}:${h.id}:${i}`)),
    );
    c.event.choices.forEach((_, i) => expected.push(`${chapter}:event:${i}`));
  });
  for (let cursor = 0; cursor < queue.length; cursor++) {
    const state = queue[cursor];
    if (state.finished) continue;
    const add = (next) => {
      const id = key(next);
      if (!seen.has(id)) {
        seen.add(id);
        queue.push(next);
      }
    };
    if (state.visited.length === 2) {
      CHAPTERS[state.chapter].event.choices.forEach((choice, i) => {
        if (!available(choice, state)) return;
        reachable.add(`${state.chapter}:event:${i}`);
        add(resolveEvent(state, i));
      });
    } else
      for (const spot of CHAPTERS[state.chapter].hotspots) {
        if (state.visited.includes(spot.id)) continue;
        if (!spot.choices) {
          add(visit(state, spot.id));
          continue;
        }
        spot.choices.forEach((choice, i) => {
          if (!available(choice, state)) return;
          reachable.add(`${state.chapter}:${spot.id}:${i}`);
          add(visit(state, spot.id, i));
        });
      }
  }
  return expected.filter((id) => !reachable.has(id));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const errors = validateStory({
    chapters: CHAPTERS,
    people: PEOPLE,
    evidence: EVIDENCE,
    relations: RELATIONS,
  });
  if (!errors.length) errors.push(...unreachableChoices().map((id) => `不可达选项：${id}`));
  if (errors.length) {
    console.error(errors.join('\n'));
    process.exitCode = 1;
  } else console.log('剧情引用、坐标、效果及两次走访约束下的所有选项可达性检查通过。');
}
