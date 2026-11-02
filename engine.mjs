import { CHAPTERS } from './data.mjs';
export { restore, SAVE_KEY } from './save.mjs';
export function newGame() {
  return {
    version: 1,
    chapter: 0,
    visited: [],
    evidence: [],
    flags: {},
    stats: { clarity: 0, care: 0, complicity: 0, unrest: 0 },
    log: [],
    x: 12,
    finished: false,
    started: false,
  };
}
export function available(choice, s) {
  return (
    (!choice.requires || s.evidence.includes(choice.requires)) &&
    (!choice.requiresFlags || choice.requiresFlags.every((f) => s.flags[f]))
  );
}
export function apply(s, action) {
  const next = structuredClone(s);
  for (const [key, value] of Object.entries(action.effects || {}))
    next.stats[key] = (next.stats[key] || 0) + value;
  if (action.evidence && !next.evidence.includes(action.evidence))
    next.evidence.push(action.evidence);
  if (action.flag) next.flags[action.flag] = true;
  return next;
}
export function visit(s, id, choiceIndex) {
  if (s.finished || s.visited.length >= 2 || s.visited.includes(id))
    throw new Error('本次走访不可用');
  const spot = CHAPTERS[s.chapter].hotspots.find((h) => h.id === id);
  if (!spot) throw new Error('未知地点');
  let next = apply(s, spot),
    choice;
  if (spot.choices) {
    choice = spot.choices[choiceIndex];
    if (!choice || !available(choice, s)) throw new Error('尚未获得所需线索');
    next = apply(next, choice);
  }
  next.visited.push(id);
  next.log.push({
    chapter: s.chapter,
    title: spot.label,
    text: choice?.reply || spot.text,
    choice: choice?.label || '调查并记录',
    evidence: choice?.evidence || spot.evidence || null,
  });
  return next;
}
export function resolveEvent(s, index) {
  if (s.finished || s.visited.length < 2) throw new Error('请先完成两次走访');
  const choice = CHAPTERS[s.chapter].event.choices[index];
  if (!choice || !available(choice, s)) throw new Error('尚未获得所需线索');
  const next = apply(s, choice);
  next.log.push({
    chapter: s.chapter,
    title: '幕间抉择',
    text: choice.reply,
    choice: choice.label,
  });
  if (next.chapter === CHAPTERS.length - 1) next.finished = true;
  else {
    next.chapter++;
    next.visited = [];
    next.x = 12;
  }
  return next;
}
export function ending(s) {
  if (s.stats.complicity >= 5 && s.stats.complicity > s.stats.care)
    return {
      type: '传话者',
      title: '线的另一端',
      text: '你曾以为自己只是帮忙。把信件按时间排好后，你终于看见：自己的脚步，也替彼得织起了网。',
    };
  if (s.flags.savedLiza || s.flags.savedShatov || s.flags.helpedKirillov)
    return {
      type: '介入者',
      title: '你曾走到门前',
      text: '你没能走遍每一条路。但至少在一个时刻，你停止传话，带着核实的消息，走到了一个具体的人身边。',
    };
  return {
    type: '见证者',
    title: '纸上的清晨',
    text: '你把亲见与传闻分开，把不能确认的部分留白。这份记录不能挽回已经发生的事，却让小城没有只剩下操纵者的解释。',
  };
}
