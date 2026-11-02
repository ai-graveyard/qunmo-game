import { CHAPTERS, EVIDENCE } from './data.mjs';

export const SAVE_KEY = 'qunmo-paper-town-v1';
export const MAX_SAVE_BYTES = 500_000;
export const STAT_KEYS = ['clarity', 'care', 'complicity', 'unrest'];
const actions = CHAPTERS.flatMap((c) => [
  ...c.hotspots.flatMap((h) => [h, ...(h.choices || [])]),
  ...c.event.choices,
]);
const flagKeys = new Set(actions.flatMap((a) => (a.flag ? [a.flag] : [])));
const statBounds = Object.fromEntries(
  STAT_KEYS.map((key) => [
    key,
    actions.reduce((total, action) => total + Math.max(0, action.effects?.[key] || 0), 0),
  ]),
);
const record = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
const text = (value, max) => typeof value === 'string' && value.length <= max;
const chapterIndex = (value) => Number.isInteger(value) && value >= 0 && value < CHAPTERS.length;
const evidenceId = (value) => typeof value === 'string' && Object.hasOwn(EVIDENCE, value);
const uniqueList = (value, max, valid) =>
  Array.isArray(value) &&
  value.length <= max &&
  new Set(value).size === value.length &&
  value.every(valid);

// v1 remains readable. Validate before any UI consumes imported fields, then
// return only known state fields so extra properties cannot leak into the app.
export function restore(raw) {
  try {
    if (typeof raw !== 'string' || new TextEncoder().encode(raw).length > MAX_SAVE_BYTES)
      return null;
    const s = JSON.parse(raw);
    if (!record(s) || s.version !== 1 || !chapterIndex(s.chapter)) return null;
    if (
      !uniqueList(s.visited, 2, (id) => CHAPTERS[s.chapter].hotspots.some((h) => h.id === id)) ||
      !uniqueList(s.evidence, Object.keys(EVIDENCE).length, evidenceId)
    )
      return null;
    if (
      !record(s.flags) ||
      !Object.entries(s.flags).every(
        ([key, value]) => flagKeys.has(key) && typeof value === 'boolean',
      )
    )
      return null;
    if (
      !record(s.stats) ||
      Object.keys(s.stats).length !== STAT_KEYS.length ||
      !STAT_KEYS.every(
        (key) =>
          Number.isInteger(s.stats[key]) && s.stats[key] >= 0 && s.stats[key] <= statBounds[key],
      )
    )
      return null;
    if (
      !Array.isArray(s.log) ||
      s.log.length > CHAPTERS.length * 3 ||
      !s.log.every(
        (entry) =>
          record(entry) &&
          chapterIndex(entry.chapter) &&
          entry.chapter <= s.chapter &&
          text(entry.title, 200) &&
          text(entry.text, 5000) &&
          text(entry.choice, 500) &&
          (entry.evidence == null || evidenceId(entry.evidence)),
      )
    )
      return null;
    if (
      typeof s.started !== 'boolean' ||
      typeof s.finished !== 'boolean' ||
      (s.finished && (!s.started || s.chapter !== CHAPTERS.length - 1 || s.visited.length !== 2))
    )
      return null;
    if (s.log.length !== s.chapter * 3 + s.visited.length + (s.finished ? 1 : 0)) return null;
    if (
      !s.started &&
      (s.chapter !== 0 ||
        s.log.length ||
        s.evidence.length ||
        Object.keys(s.flags).length ||
        STAT_KEYS.some((key) => s.stats[key] !== 0))
    )
      return null;
    return {
      version: 1,
      chapter: s.chapter,
      visited: [...s.visited],
      evidence: [...s.evidence],
      flags: { ...s.flags },
      stats: { ...s.stats },
      log: s.log.map(({ chapter, title, text, choice, evidence }) => ({
        chapter,
        title,
        text,
        choice,
        ...(evidence !== undefined ? { evidence } : {}),
      })),
      x: Number.isFinite(s.x) ? Math.min(94, Math.max(6, s.x)) : 12,
      finished: s.finished,
      started: s.started,
    };
  } catch {
    return null;
  }
}
