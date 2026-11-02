import { EVIDENCE } from '../data.mjs';
import { available } from '../engine.mjs';

export const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );

export function requirements(choice, state) {
  const missing = [];
  if (choice.requires && !state.evidence.includes(choice.requires))
    missing.push(EVIDENCE[choice.requires].title);
  for (const flag of choice.requiresFlags || [])
    if (!state.flags[flag]) {
      missing.push(
        { exitOpened: '打开侧门', lizaWarned: '核实指控并提醒丽莎' }[flag] || '前置行动',
      );
    }
  return missing.length ? '需要：' + missing.join(' ＋ ') : '';
}

export function choiceButtons(choices, state) {
  return `<div class="choices">${choices
    .map((choice, index) => {
      const missing = requirements(choice, state);
      return `<button class="choice" data-choice="${index}" ${available(choice, state) ? '' : 'disabled'}><span class="choice-key">${index + 1}</span><span>${escapeHTML(choice.label)}${missing ? `<small>${escapeHTML(missing)}</small>` : ''}</span><span class="arrow">↗</span></button>`;
    })
    .join('')}</div>`;
}

// macOS Safari may skip buttons in native Tab navigation unless Full Keyboard
// Access is enabled. Keep action selection consistent within an open dialogue.
export function focusDialogueControl(event, root) {
  if (event.key !== 'Tab' || !root || root.hidden || !root.contains(document.activeElement))
    return false;
  const controls = [...root.querySelectorAll('button:not(:disabled)')];
  const current = controls.indexOf(document.activeElement);
  const index = event.shiftKey ? (current < 0 ? controls.length - 1 : current - 1) : current + 1;
  if (!controls[index]) return false;
  event.preventDefault();
  controls[index].focus({ preventScroll: true });
  controls[index].scrollIntoView({ block: 'nearest' });
  return true;
}
