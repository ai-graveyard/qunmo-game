import { PEOPLE, person, CHAPTERS, EVIDENCE, RELATIONS, SETTING } from './data.mjs';
import { newGame, visit, resolveEvent, restore, ending, SAVE_KEY } from './engine.mjs';
import { figure, sceneSVG, relationSVG, propSVG, WARDROBE } from './art.mjs';
import { MAX_SAVE_BYTES } from './save.mjs';
import { escapeHTML as escape, choiceButtons, focusDialogueControl } from './ui/dialogue.mjs';
import { stepMovement, cameraTarget } from './ui/movement.mjs';
import { createAmbientAudio } from './ui/audio.mjs';
import { downloadFile, journalText, peopleSVG } from './ui/downloads.mjs';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
const ambient = createAmbientAudio();

const $ = (s) => document.querySelector(s);
const icon = (name) => {
  const paths = {
    book: 'M4 4h7l1 2 1-2h7v15h-7l-1 1-1-1H4ZM12 6v14',
    map: 'm3 5 6-2 6 2 6-2v16l-6 2-6-2-6 2ZM9 3v16M15 5v16',
    note: 'M6 3h12v18H6ZM9 8h6M9 12h6M9 16h4',
    settings:
      'M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8ZM12 2v3M12 19v3M2 12h3M19 12h3M5 5l2 2M17 17l2 2M5 19l2-2M17 7l2-2',
    sound: 'M3 9h4l5-5v16l-5-5H3ZM16 8q5 4 0 8M19 5q8 7 0 14',
    mute: 'M3 9h4l5-5v16l-5-5H3ZM16 9l6 6M16 15l6-6',
    pin: 'M12 22S4 14 4 9a8 8 0 1 1 16 0c0 5-8 13-8 13ZM12 6a3 3 0 1 0 0 6 3 3 0 0 0 0-6',
    arrow: 'M4 12h15M13 6l6 6-6 6',
    leaf: 'M20 3Q4 2 4 13q0 8 8 6Q21 16 20 3ZM4 21 16 8',
    check: 'm5 12 4 4L19 6',
    restart: 'M4 8a9 9 0 1 1-1 9M4 2v6h6',
    menu: 'M4 6h16M4 12h16M4 18h16',
    full: 'M8 3H3v5M16 3h5v5M21 16v5h-5M8 21H3v-5',
    close: 'm6 6 12 12M6 18 18 6',
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${paths[name] || paths.note}"/></svg>`;
};
let storageOK = true,
  renderedChapter = -1;
function getSaved(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    storageOK = false;
    return null;
  }
}
let state = restore(getSaved(SAVE_KEY)) || newGame();
let settings = { font: window.innerWidth >= 1600 ? 28 : 24, sound: false };
try {
  const saved = JSON.parse(getSaved('qunmo-settings'));
  if (saved && Number.isFinite(saved.font)) settings.font = Math.min(32, Math.max(20, saved.font));
} catch {}
document.documentElement.style.setProperty('--text', settings.font + 'px');
let phase = 'browse',
  selected = null,
  result = null,
  toastTimer,
  walkTarget = null,
  keys = new Set(),
  frameTime = 0,
  focusBeforeModal = null,
  bookTab = 'people',
  spoilers = false;
let camera = 0,
  cameraRise = 0,
  dialogueRise = 0,
  worldWidth = 1500,
  viewWidth = 1500,
  viewHeight = 650,
  visualX = state.x,
  contextKey = '',
  chapterTimer,
  dialogueObserver;
const modal = $('#modal');
function save() {
  try {
    localStorage.setItem(SAVE_KEY, JSON.stringify(state));
  } catch {
    storageOK = false;
  }
  updateSaved();
}
function updateSaved() {
  const el = $('.saved-label');
  if (el) el.innerHTML = `<i class="save-light"></i>${storageOK ? '已保存' : '暂无法存档'}`;
}
function toast(text) {
  $('#toast').textContent = text;
  $('#toast').classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => $('#toast').classList.remove('show'), 2800);
}
function chapter() {
  return CHAPTERS[state.chapter];
}
function propKind(id) {
  if (id === 'ledger') return 'ledger';
  if (['names', 'archive'].includes(id)) return 'manuscript';
  if (id === 'crowd') return 'crowd';
  if (id === 'exit') return 'exit';
  if (id === 'survivors') return 'bench';
  if (id === 'empty') return 'window';
  return 'letter';
}
function render() {
  const c = chapter(),
    changed = renderedChapter !== state.chapter;
  if (!changed && $('#game-root')) {
    updateHUD();
    renderNarrative();
    return;
  }
  renderedChapter = state.chapter;
  visualX = state.x;
  contextKey = '';
  $('#app').innerHTML =
    `<main id="game-root" class="game-shell mood-${c.mood}" aria-label="群魔 · 全屏剪纸冒险">
 <section id="stage" class="game-stage" aria-label="可探索的剪纸场景" tabindex="-1"><div id="world" class="game-world">${sceneSVG(c.mood)}<div class="scene-depth"></div>
 ${c.hotspots.map((h) => `<button class="hotspot ${state.visited.includes(h.id) ? 'visited' : ''}" data-spot="${h.id}" style="left:${h.x}%" aria-label="${h.kind}：${h.label}${state.visited.includes(h.id) ? '（已走访）' : ''}"><span class="hotspot-marker">${state.visited.includes(h.id) ? '✓' : '◇'}</span>${h.person ? `<span class="npc-figure">${figure(h.person, person(h.person).color)}</span>` : `<span class="prop-icon">${propSVG(propKind(h.id))}</span>`}<span class="hotspot-label">${h.label}<small>${h.kind}</small></span></button>`).join('')}
 <button id="scene-exit" class="scene-exit" style="left:95%" aria-label="前往出口" hidden><span class="exit-arrow">➜</span><span>离开这里<small>继续故事</small></span></button>
 <div id="destination" class="destination" hidden></div><div class="actor" id="actor" style="left:${state.x}%">${figure()}<div class="actor-label">叙述者</div></div></div><div class="screen-grain"></div><div class="scene-shade"></div></section>
 <header class="game-hud"><div class="hud-location"><button class="game-seal" id="era" aria-label="查看1869年时代手记">群</button><div><div class="hud-kicker">${SETTING.label} <span>／ ${c.subtitle}</span></div><h1>${c.place}</h1></div></div><div class="hud-actions"><span class="saved-label"></span><button class="hud-icon" id="fullscreen" aria-label="切换全屏" title="全屏 F">${icon('full')}</button><button class="hud-icon" id="pause" aria-label="暂停菜单" title="暂停 Esc">${icon('menu')}</button></div></header>
 <aside class="quest-hud" aria-label="当前任务"><div class="quest-heading"><span>手头的差事</span><div id="visit-counter" class="quest-dots"></div></div><p id="quest-text"></p><div class="quest-foot"><span id="quest-act">${c.title}</span><button id="quest-direction" disabled>探索小城 →</button></div></aside>
 <div class="chapter-ribbon" id="chapter-ribbon"><span>${c.subtitle} · ${String(state.chapter + 1).padStart(2, '0')}</span><strong>${c.title}</strong><i>${c.time}</i></div>
 <div class="game-bottom"><div class="control-legend"><span><kbd>A</kbd><kbd>D</kbd> 移动</span><span><kbd>E</kbd> 互动</span><span><kbd>Shift</kbd> 快走</span></div><button id="context-prompt" class="context-prompt" hidden></button><nav class="inventory-dock" aria-label="随身物品"><button data-nav="map" aria-label="小城地图">${icon('map')}<span>地图</span><kbd>M</kbd></button><button data-nav="book" aria-label="人物手册">${icon('book')}<span>人物</span><kbd>B</kbd></button><button data-nav="journal" aria-label="见闻录">${icon('note')}<span>见闻</span><b id="evidence-badge">${state.evidence.length}</b><kbd>J</kbd></button></nav></div>
 <div class="touch-gamepad"><div class="touch-walk"><button data-move="-1" aria-label="向左移动">‹</button><button data-move="1" aria-label="向右移动">›</button></div><button id="touch-interact" aria-label="与附近人物交谈">E</button></div>
 <section class="game-dialogue" id="narrative" aria-label="剧情与选择" hidden></section></main>`;
  bindShell();
  sizeWorld();
  camera = cameraTarget(state.x, worldWidth, viewWidth);
  updateHUD();
  renderNarrative();
  dialogueObserver?.disconnect();
  dialogueObserver = new ResizeObserver(measureDialogue);
  dialogueObserver.observe($('#narrative'));
  clearTimeout(chapterTimer);
  chapterTimer = setTimeout(() => $('#chapter-ribbon')?.classList.add('fade-out'), 2600);
}
function updateHUD() {
  const count = $('#visit-counter');
  if (count)
    count.innerHTML = `<i class="${state.visited.length >= 1 ? 'used' : ''}"></i><i class="${state.visited.length >= 2 ? 'used' : ''}"></i><span>${state.visited.length} / 2</span>`;
  const q = $('#quest-text');
  if (q)
    q.textContent = state.finished
      ? '旅程结束。翻开手册，回看你留下的记录。'
      : state.visited.length >= 2
        ? '走访完成。前往右侧出口，继续故事。'
        : chapter().objective;
  const gate = $('#scene-exit');
  if (gate) gate.hidden = state.visited.length < 2 || state.finished;
  const badge = $('#evidence-badge');
  if (badge) badge.textContent = state.evidence.length;
  const direction = $('#quest-direction');
  if (direction) {
    direction.disabled = state.finished || state.visited.length < 2;
    direction.textContent = state.finished
      ? '终幕'
      : state.visited.length >= 2
        ? '前往出口 →'
        : '走近人物与物件';
  }
  document.querySelectorAll('[data-spot]').forEach((b) => {
    const seen = state.visited.includes(b.dataset.spot),
      h = chapter().hotspots.find((h) => h.id === b.dataset.spot);
    b.classList.toggle('visited', seen);
    b.querySelector('.hotspot-marker').textContent = seen ? '✓' : '◇';
    if (h) b.setAttribute('aria-label', `${h.kind}：${h.label}${seen ? '（已走访）' : ''}`);
  });
  updateSaved();
}
function displayTag(p) {
  return p.id === 'marya' && !knownRelation('marriageConfirmed') ? '待确认' : p.tag;
}
function portrait(id) {
  const p = person(id) || person('narrator');
  return `<div class="portrait-area"><div class="portrait">${figure(p.id, p.color)}</div><div class="portrait-caption">${displayTag(p)}</div></div>`;
}
function explore() {
  phase = 'browse';
  selected = null;
  walkTarget = null;
  renderNarrative();
  $('#stage')?.focus({ preventScroll: true });
}
function renderNarrative() {
  const el = $('#narrative');
  if (!el) return;
  const browsing = phase === 'browse';
  el.hidden = browsing;
  $('#game-root').classList.toggle('has-dialogue', !browsing);
  $('#stage').inert = !browsing;
  if (browsing) {
    el.innerHTML = '';
    contextKey = '';
    dialogueRise = 0;
    return;
  }
  let id = 'narrator',
    text = chapter().intro,
    html = '';
  if (phase === 'chapter-intro') {
    html = `<p class="visit-notice">每幕可以确认两次走访。先交谈再决定，离开对话不消耗机会；已走访地点可免费回看。</p><div class="continue-row"><span class="quiet">走近人物，听他们说话</span><button class="primary" id="begin-explore">开始探索 →</button></div>`;
  } else if (phase === 'spot') {
    id = selected.person || 'narrator';
    text = selected.text;
    html = selected.choices
      ? choiceButtons(selected.choices, state)
      : '<div class="continue-row"><span class="quiet">调查消耗 1 次走访</span><button class="primary" id="record">记入手册 →</button></div>';
    html += `<p class="visit-notice" role="status">本幕还可走访 ${2 - state.visited.length} 处。确认选项或记入手册会消耗 1 次。</p>`;
    html += '<button class="dialogue-leave" id="back-explore">结束交谈 <kbd>Esc</kbd></button>';
  } else if (phase === 'event') {
    id = chapter().event.person;
    text = chapter().event.text;
    html = choiceButtons(chapter().event.choices, state);
  } else if (['result', 'event-result', 'revisit'].includes(phase)) {
    id = result.person || 'narrator';
    text = result.text;
    if (result.evidence)
      html = `<div class="result-tag">${icon('check')} 获得证据：${EVIDENCE[result.evidence].title}</div>`;
    if (result.flag === 'marriageConfirmed')
      html += '<div class="result-tag">已确认：秘密婚姻</div>';
    html += `<div class="continue-row"><span class="quiet">${phase === 'revisit' ? '回看不消耗走访机会' : '已记入见闻录'}</span><button class="primary" id="continue">${phase === 'event-result' ? (state.finished ? '展开最终记录' : '前往下一幕') : '返回场景'} <span>→</span><kbd>Space</kbd></button></div>`;
  }
  const p = person(id) || person('narrator');
  el.innerHTML = `${portrait(id)}<div class="dialogue-body"><div class="speaker-row"><span class="speaker-name">${p.name}</span><span class="speaker-role">${id === 'narrator' ? '小城的观察者 · 你' : displayTag(p)}</span><span class="dialogue-mode">${phase === 'event' ? '幕间抉择' : phase === 'chapter-intro' ? chapter().subtitle : phase === 'spot' ? '交谈中' : '见闻手记'}</span></div><p class="dialogue-text" tabindex="-1">${escape(text)}</p>${html}</div>`;
  el.querySelectorAll('[data-choice]').forEach(
    (b) => (b.onclick = () => choose(Number(b.dataset.choice))),
  );
  $('#record')?.addEventListener('click', () => commitVisit());
  $('#begin-explore')?.addEventListener('click', explore);
  $('#back-explore')?.addEventListener('click', explore);
  $('#continue')?.addEventListener('click', () => {
    if (phase === 'event-result') {
      phase = state.finished ? 'browse' : 'chapter-intro';
      render();
      if (state.finished) showEnding();
    } else explore();
  });
  el.scrollTop = 0;
  measureDialogue();
  if (!modal.open) el.querySelector('.dialogue-text')?.focus({ preventScroll: true });
}
function measureDialogue() {
  const el = $('#narrative');
  dialogueRise =
    el && !el.hidden
      ? Math.min(
          viewHeight * 0.42,
          Math.max(viewHeight * 0.15, el.offsetHeight - viewHeight * 0.13 + 48),
        )
      : 0;
}
function bindShell() {
  document.querySelectorAll('[data-nav]').forEach(
    (b) =>
      (b.onclick = () => {
        const nav = b.dataset.nav;
        if (nav === 'map') showMap();
        else if (nav === 'book') showBook();
        else showJournal();
      }),
  );
  $('#pause').onclick = showPause;
  $('#quest-direction').onclick = approachExit;
  $('#fullscreen').onclick = toggleFullscreen;
  $('#era').onclick = showEra;
  document.querySelectorAll('[data-spot]').forEach(
    (b) =>
      (b.onclick = (e) => {
        e.stopPropagation();
        approach(b.dataset.spot);
      }),
  );
  $('#scene-exit').onclick = (e) => {
    e.stopPropagation();
    approachExit();
  };
  $('#context-prompt').onclick = interactNearby;
  $('#stage').onclick = (e) => {
    if (!state.started) {
      showIntro();
      return;
    }
    if (!['browse', 'chapter-intro'].includes(phase)) return;
    if (phase === 'chapter-intro') explore();
    const rect = $('#world').getBoundingClientRect();
    const x = Math.min(94, Math.max(6, ((e.clientX - rect.left) / worldWidth) * 100));
    walkTarget = { x };
    showDestination(x);
  };
  document.querySelectorAll('[data-move]').forEach((b) => {
    b.onpointerdown = (e) => {
      e.preventDefault();
      b.setPointerCapture(e.pointerId);
      if (phase === 'chapter-intro') explore();
      keys.add(b.dataset.move === '-1' ? 'ArrowLeft' : 'ArrowRight');
      walkTarget = null;
    };
    b.onpointerup = b.onpointercancel = () => {
      keys.clear();
      save();
    };
  });
  $('#touch-interact').onclick = interactNearby;
}
function showDestination(x) {
  const el = $('#destination');
  if (el) {
    el.hidden = false;
    el.style.left = x + '%';
  }
}
function approach(id) {
  if (!state.started) {
    showIntro();
    return;
  }
  if (!['browse', 'chapter-intro'].includes(phase)) return;
  if (state.finished) {
    showEnding();
    return;
  }
  const h = chapter().hotspots.find((h) => h.id === id);
  if (!h) return;
  if (!state.visited.includes(id) && state.visited.length >= 2) {
    toast('本幕走访已完成。前往右侧出口继续故事。');
    return;
  }
  if (phase === 'chapter-intro') explore();
  walkTarget = { x: Math.max(6, h.x - 4), id };
  keys.clear();
  showDestination(walkTarget.x);
}
function approachExit() {
  if (phase !== 'browse' || state.visited.length < 2 || state.finished) return;
  walkTarget = { x: 93, exit: true };
  keys.clear();
  showDestination(93);
}
function enterEvent() {
  keys.clear();
  walkTarget = null;
  phase = 'event';
  renderNarrative();
}
function openSpot(id) {
  const h = chapter().hotspots.find((h) => h.id === id);
  if (!h) return;
  if (state.visited.includes(id)) {
    phase = 'revisit';
    const l = state.log.findLast((l) => l.chapter === state.chapter && l.title === h.label);
    result = { text: l?.text || h.text, person: h.person };
  } else {
    phase = 'spot';
    selected = h;
  }
  keys.clear();
  renderNarrative();
}
function commitVisit(index) {
  const h = selected,
    before = state.evidence.length;
  try {
    state = visit(state, h.id, index);
  } catch (e) {
    toast(e.message);
    return;
  }
  const choice = h.choices?.[index];
  result = {
    text: choice?.reply || h.text,
    person: h.person,
    evidence: choice?.evidence || h.evidence,
    flag: choice?.flag,
  };
  phase = 'result';
  save();
  render();
  if (state.evidence.length > before) toast('新证据已收进手册');
}
function choose(index) {
  if (phase === 'spot') commitVisit(index);
  else if (phase === 'event') {
    const event = chapter().event,
      ch = event.choices[index],
      oldX = state.x;
    try {
      state = resolveEvent(state, index);
    } catch (e) {
      toast(e.message);
      return;
    }
    visualX = oldX;
    result = { text: ch.reply, person: event.person, flag: ch.flag };
    phase = 'event-result';
    save();
    renderNarrative();
  }
}
function interactNearby() {
  if (modal.open) return;
  if (!state.started) {
    showIntro();
    return;
  }
  if (phase === 'chapter-intro') {
    explore();
    return;
  }
  if (phase !== 'browse') return;
  if (state.finished) {
    showEnding();
    return;
  }
  if (state.visited.length >= 2 && state.x >= 87) {
    enterEvent();
    return;
  }
  const nearest = [...chapter().hotspots].sort(
    (a, b) => Math.abs(a.x - state.x) - Math.abs(b.x - state.x),
  )[0];
  if (Math.abs(nearest.x - state.x) < 11) approach(nearest.id);
  else
    toast(
      state.visited.length >= 2 ? '出口在右侧，继续向右走。' : '再靠近一些，或点击场景中的人物。',
    );
}
function sizeWorld() {
  const stage = $('#stage'),
    world = $('#world');
  if (!stage || !world) return;
  viewWidth = stage.clientWidth;
  viewHeight = stage.clientHeight;
  worldWidth = Math.max(viewWidth, (viewHeight * 1500) / 650);
  world.style.width = worldWidth + 'px';
  world.style.height = viewHeight + 'px';
  world.style.setProperty('--world-scale', viewHeight / 650);
  camera = Math.max(0, Math.min(worldWidth - viewWidth, camera));
  measureDialogue();
}
function updateContext() {
  if (phase !== 'browse' || modal.open) {
    $('#context-prompt').hidden = true;
    return;
  }
  const nearest = [...chapter().hotspots].sort(
    (a, b) => Math.abs(a.x - state.x) - Math.abs(b.x - state.x),
  )[0];
  const near = Math.abs(nearest.x - state.x) < 11,
    gate = state.visited.length >= 2 && state.x >= 87;
  const key = state.finished ? 'ending' : gate ? 'exit' : near ? nearest.id : '';
  if (key === contextKey) return;
  contextKey = key;
  document
    .querySelectorAll('[data-spot]')
    .forEach((b) => b.classList.toggle('near', b.dataset.spot === key));
  const p = $('#context-prompt');
  p.hidden = !key;
  if (key)
    p.innerHTML = `<kbd>E</kbd><span>${key === 'ending' ? '查看最终记录' : key === 'exit' ? '离开这里 · 继续故事' : `${state.visited.includes(key) ? '回看' : nearest.kind} · ${nearest.label}`}</span>`;
}
function moveFrame(time) {
  const dt = Math.min((time - frameTime) / 1000, 0.1);
  frameTime = time;
  if (document.hidden || modal.open) {
    requestAnimationFrame(moveFrame);
    return;
  }
  const movement = stepMovement(
    state.x,
    keys,
    walkTarget,
    dt,
    !modal.open && state.started && !state.finished && ['browse', 'chapter-intro'].includes(phase),
  );
  const { dir, arrived } = movement;
  if (movement.manual && phase === 'chapter-intro') explore();
  state.x = movement.x;
  walkTarget = movement.target;
  if (arrived) {
    save();
    if (arrived.exit) enterEvent();
    else if (arrived.id) openSpot(arrived.id);
  }
  if (phase !== 'event-result') visualX = state.x;
  const actor = $('#actor'),
    world = $('#world');
  if (actor && world) {
    const left = visualX + '%';
    if (actor.style.left !== left) actor.style.left = left;
    if (actor.classList.contains('walking') !== !!dir) actor.classList.toggle('walking', !!dir);
    if (dir && actor.classList.contains('facing-left') !== dir < 0)
      actor.classList.toggle('facing-left', dir < 0);
    const target = cameraTarget(visualX, worldWidth, viewWidth);
    camera += (target - camera) * (reducedMotion.matches ? 1 : Math.min(1, dt * 6));
    cameraRise += (dialogueRise - cameraRise) * (reducedMotion.matches ? 1 : Math.min(1, dt * 8));
    if (Math.abs(target - camera) < 0.1) camera = target;
    if (Math.abs(dialogueRise - cameraRise) < 0.1) cameraRise = dialogueRise;
    const transform = `translate3d(${-camera}px,${-cameraRise}px,0)`;
    if (world.style.transform !== transform) world.style.transform = transform;
    $('#destination').hidden = !walkTarget;
    updateContext();
  }
  requestAnimationFrame(moveFrame);
}
document.addEventListener('keydown', (e) => {
  if (['INPUT', 'TEXTAREA'].includes(document.activeElement?.tagName)) return;
  if (!modal.open && focusDialogueControl(e, $('#narrative'))) return;
  if (modal.open) {
    if ((e.key === 'f' || e.key === 'F') && modal.classList.contains('title-modal')) {
      e.preventDefault();
      toggleFullscreen();
    }
    if (modal.classList.contains('pause-modal')) {
      const key = e.key.toLowerCase();
      if (key === 'm') {
        e.preventDefault();
        showMap();
      }
      if (key === 'b') {
        e.preventDefault();
        showBook();
      }
      if (key === 'j') {
        e.preventDefault();
        showJournal();
      }
    }
    return;
  }
  if (['ArrowLeft', 'ArrowRight', 'a', 'A', 'd', 'D', 'Shift'].includes(e.key)) {
    e.preventDefault();
    keys.add(e.key);
  }
  if (e.repeat) return;
  if (e.key === 'Escape') {
    e.preventDefault();
    if (['spot', 'revisit', 'result', 'chapter-intro'].includes(phase)) explore();
    else showPause();
    return;
  }
  if (e.key === 'f' || e.key === 'F') {
    e.preventDefault();
    toggleFullscreen();
    return;
  }
  if (e.key === 'e' || e.key === 'E') {
    e.preventDefault();
    interactNearby();
  }
  if (e.code === 'Space') {
    e.preventDefault();
    if ($('#continue')) $('#continue').click();
    else if ($('#begin-explore')) $('#begin-explore').click();
    else if ($('#record')) $('#record').click();
  }
  if (['1', '2', '3'].includes(e.key)) {
    const b = $(`[data-choice="${Number(e.key) - 1}"]`);
    if (b && !b.disabled) b.click();
  }
  if (e.key === 'j' || e.key === 'J') showJournal();
  if (e.key === 'b' || e.key === 'B') showBook();
  if (e.key === 'm' || e.key === 'M') showMap();
});
document.addEventListener('keyup', (e) => {
  keys.delete(e.key);
  if (['ArrowLeft', 'ArrowRight', 'a', 'd', 'A', 'D'].includes(e.key)) save();
});
window.addEventListener('resize', sizeWorld);
window.addEventListener('blur', () => {
  keys.clear();
  walkTarget = null;
  save();
});
window.addEventListener('pagehide', () => {
  save();
  ambient.pause().catch(() => {});
  settings.sound = false;
});
function openModal(title, subtitle, body, className = '') {
  keys.clear();
  walkTarget = null;
  contextKey = '';
  if (!modal.open) focusBeforeModal = document.activeElement;
  modal.className = className;
  modal.innerHTML = `<div class="modal-header"><div><h2 id="modal-title">${title}</h2><p>${subtitle}</p></div><button class="close-btn" aria-label="关闭窗口">×</button></div><div class="modal-body">${body}</div>`;
  if (!modal.open) modal.showModal();
  $('#context-prompt').hidden = true;
  $('#actor')?.classList.remove('walking');
  modal.scrollTop = 0;
  modal.querySelector('.close-btn').onclick = () => modal.close();
  (
    modal.querySelector('.modal-body button:not(:disabled)') || modal.querySelector('.close-btn')
  )?.focus({ preventScroll: true });
}
modal.addEventListener('close', () => {
  contextKey = '';
  if (!state.started) {
    queueMicrotask(showIntro);
    return;
  }
  if (modal.open) return;
  const focus =
    focusBeforeModal?.isConnected && !focusBeforeModal.closest('[inert]')
      ? focusBeforeModal
      : $('#narrative:not([hidden]) .dialogue-text') || $('#stage');
  focus?.focus({ preventScroll: true });
});
modal.addEventListener('cancel', (e) => {
  if (modal.classList.contains('title-modal')) e.preventDefault();
});
modal.addEventListener('click', (e) => {
  if (e.target === modal && !modal.classList.contains('title-modal')) {
    const r = modal.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom)
      modal.close();
  }
});
async function toggleFullscreen() {
  try {
    if (document.fullscreenElement) await document.exitFullscreen();
    else if (document.documentElement.requestFullscreen)
      await document.documentElement.requestFullscreen();
    else toast('当前浏览器已按窗口铺满显示。');
  } catch {
    toast('当前窗口不支持系统全屏，游戏已铺满浏览器。');
  }
  sizeWorld();
}
function showPause() {
  openModal(
    '旅程暂停',
    '场景已暂停 · 进度自动保存在本机',
    `<div class="pause-scene">${chapter().subtitle}<h3>${chapter().title}</h3><p>${chapter().place}</p></div><div class="pause-menu"><button class="pause-resume" id="pause-resume">继续旅程 <span>Esc</span></button><button id="pause-map">小城地图 <span>M</span></button><button id="pause-book">人物手册 <span>B</span></button><button id="pause-journal">见闻录 <span>J</span></button><button id="pause-settings">阅读与设置</button><button id="pause-help">操作指南</button><button id="pause-about">关于改编</button><button id="pause-title">返回标题画面</button></div>`,
    'pause-modal',
  );
  $('#pause-resume').onclick = () => modal.close();
  $('#pause-map').onclick = showMap;
  $('#pause-book').onclick = () => showBook();
  $('#pause-journal').onclick = () => showJournal();
  $('#pause-settings').onclick = showSettings;
  $('#pause-help').onclick = showHelp;
  $('#pause-about').onclick = showAbout;
  $('#pause-title').onclick = showIntro;
}
function showIntro() {
  openModal(
    '群魔 · 小城纸影',
    '一八六九 · 秋日省城',
    `<div class="title-screen"><div class="title-landscape">${sceneSVG('dawn')}</div><div class="title-wash"></div><div class="title-content"><div class="title-overline">БѢСЫ <span>／ ОСЕНЬ 1869</span></div><h2>群魔</h2><p class="title-subtitle">小城纸影</p><div class="title-rule"></div><p class="title-description">秋风经过省城。<br>有人请你递一封信，有人请你保守秘密。<br>这一次，你会怎样走进他们的生活？</p><div class="title-menu">${state.started ? '<button id="resume">继续旅程 <span>→</span></button><button id="fresh">重新开始</button>' : '<button id="begin">进入小城 <span>→</span></button>'}<button id="title-settings">阅读与设置</button><button id="title-help">操作指南</button></div></div><div class="title-cast"><div class="cast-person cast-one">${figure('pyotr', '#a0664f')}</div><div class="cast-person cast-two">${figure('stavrogin', '#4c6064')}</div><div class="cast-person cast-three">${figure('liza', '#a87968')}</div></div><div class="title-footer"><span>原创剪纸叙事冒险 · 根据陀思妥耶夫斯基《群魔》改编</span><span>含原著剧透、死亡与自杀主题 · 本机自动存档</span></div><button class="title-fullscreen" id="title-fullscreen" aria-label="切换全屏">${icon('full')} 全屏游玩 <kbd>F</kbd></button></div>`,
    'title-modal',
  );
  const start = () => {
    state.started = true;
    phase = state.log.length === 0 ? 'chapter-intro' : 'browse';
    save();
    render();
    modal.close();
    if (state.finished) showEnding();
  };
  $('#begin')?.addEventListener('click', start);
  $('#resume')?.addEventListener('click', start);
  $('#fresh')?.addEventListener('click', confirmRestart);
  $('#title-settings').onclick = showSettings;
  $('#title-help').onclick = showHelp;
  $('#title-fullscreen').onclick = toggleFullscreen;
}

function showMap() {
  openModal(
    '小城地图',
    '六个场景，按故事顺序抵达',
    `<p class="map-tip">${state.visited.length < 2 ? `本幕还可以走访 ${2 - state.visited.length} 处。点击当前地点的目标，可直接走近。` : '本幕走访已完成，请返回场景，走到右侧出口继续故事。'} 阅读不计时；未来的地点随剧情开放。</p><div class="map-grid">${CHAPTERS.map((c, i) => `<section class="map-location ${i === state.chapter ? 'current' : ''}"><div class="map-vignette">${sceneSVG(c.mood, { texture: false })}</div><small>ACT ${i + 1} · ${i < state.chapter ? '已留下记录' : i === state.chapter ? '你在这里' : '尚未抵达'}</small><h3>${c.place}</h3><p>${c.subtitle} · ${c.title}</p>${i === state.chapter ? `<div class="choices">${c.hotspots.map((h) => `<button class="secondary" data-map-spot="${h.id}" ${state.finished ? 'disabled' : ''}>${state.visited.includes(h.id) ? '✓ ' : ''}${h.label} ↗</button>`).join('')}</div>` : ''}</section>`).join('')}</div>`,
  );
  document.querySelectorAll('[data-map-spot]').forEach(
    (b) =>
      (b.onclick = () => {
        modal.close();
        approach(b.dataset.mapSpot);
      }),
  );
}
function knownRelation(key) {
  return (
    !key ||
    spoilers ||
    state.finished ||
    (key === 'marriageConfirmed' ? state.flags[key] : state.evidence.includes(key))
  );
}
function showBook(tab = bookTab) {
  bookTab = tab;
  openModal(
    '人物手册',
    '十一位人物 · 一座小城里的牵连',
    `<div class="tabs"><button data-book-tab="people" class="${tab === 'people' ? 'active' : ''}">人物身份</button><button data-book-tab="relations" class="${tab === 'relations' ? 'active' : ''}">关系图</button><button id="toggle-spoilers">${spoilers || state.finished ? '完整身份 · 含剧透' : '展开原著身份与命运'}</button></div><div class="spoiler-banner">${spoilers || state.finished ? '当前显示完整原著提要。游戏中的改写结果请以最终记录为准。' : '秘密关系随证据揭示。你也可以主动展开完整原著提要，包含人物结局。'}</div>${
      tab === 'people'
        ? `<div class="people-grid">${PEOPLE.map((p) => {
            const secret = p.id === 'marya' && !knownRelation('marriageConfirmed');
            const hideFate = ['liza', 'lebyadkin'].includes(p.id) && !spoilers && !state.finished;
            return `<button class="person-card" data-person="${p.id}"><span class="costume-specimen">${figure(p.id, p.color)}</span><span class="tag">${displayTag(p)}</span><h3>${p.name}</h3><div class="person-full">${p.full}</div><p class="identity">${secret ? '列比亚金之妹 · 还有待确认的身份' : p.role}</p><p>${hideFate ? (p.id === 'liza' ? '在崇拜与仇恨之间摇摆。' : '与斯塔夫罗金纠葛不清。') : p.note}</p></button>`;
          }).join('')}</div>`
        : `<div class="graph-legend"><span>实线：亲属、资助与事件关联</span><span>虚线：思想影响与利用</span></div><div class="graph-wrap">${relationSVG(
            PEOPLE.map((p) => ({ ...p, tag: displayTag(p) })),
            RELATIONS,
            knownRelation,
          )}</div>`
    }<div class="continue-row"><span class="quiet">可导出完整一页身份表（含原著剧透）</span><button class="secondary" id="export-people">导出一页人物图 ↓</button></div>`,
  );
  document
    .querySelectorAll('[data-book-tab]')
    .forEach((b) => (b.onclick = () => showBook(b.dataset.bookTab)));
  $('#toggle-spoilers').onclick = () => {
    spoilers = !spoilers;
    showBook();
  };
  document.querySelectorAll('[data-person]').forEach((b) => {
    const handler = () => showPerson(b.dataset.person);
    b.onclick = handler;
    if (b.tagName.toLowerCase() === 'g')
      b.onkeydown = (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      };
  });
  $('#export-people').onclick = exportPeople;
}
function showPerson(id) {
  const p = person(id),
    secret = p.id === 'marya' && !knownRelation('marriageConfirmed');
  const hideFate = ['liza', 'lebyadkin'].includes(p.id) && !spoilers && !state.finished;
  openModal(
    '人物小传',
    '人物身份与已经确认的牵连',
    `<div class="person-detail"><div class="portrait">${figure(id, p.color)}</div><div><small>${displayTag(p)}</small><h3>${p.full}</h3><p>${secret ? '列比亚金之妹 · 身份仍待核实' : p.role}</p><p>${hideFate ? (id === 'liza' ? '在崇拜与仇恨之间摇摆。' : '与斯塔夫罗金纠葛不清。') : p.note}</p><div class="costume-note"><span>衣饰手记 · 剪纸演绎</span><p>${WARDROBE[id]}</p></div></div></div><div class="continue-row"><button class="secondary" id="back-book">← 返回人物手册</button></div>`,
  );
  $('#back-book').onclick = () => showBook();
}
function showJournal(tab = 'evidence') {
  openModal(
    '见闻录',
    '你所见、所闻，以及你采取过的行动',
    `<div class="tabs"><button data-journal-tab="evidence" class="${tab === 'evidence' ? 'active' : ''}">证据 · ${state.evidence.length}</button><button data-journal-tab="log" class="${tab === 'log' ? 'active' : ''}">行动记录 · ${state.log.length}</button></div>${
      tab === 'evidence'
        ? state.evidence.length
          ? `<div class="evidence-grid">${state.evidence.map((id) => `<article class="evidence-card"><span class="source">${EVIDENCE[id].source}</span><h3>${EVIDENCE[id].title}</h3><p>${EVIDENCE[id].text}</p></article>`).join('')}</div>`
          : '<div class="empty-state">手册的第一页还空着。<br>走近一位人物，或调查一件物品。</div>'
        : state.log.length
          ? [...state.log]
              .reverse()
              .map(
                (l) =>
                  `<article class="log-entry"><span class="source">${CHAPTERS[l.chapter].subtitle} · ${CHAPTERS[l.chapter].title}</span><h3>${escape(l.title)}</h3><div class="log-choice">你的行动：${escape(l.choice)}</div><p>${escape(l.text)}</p></article>`,
              )
              .join('')
          : '<div class="empty-state">你的足迹会记在这里。</div>'
    }<div class="continue-row"><span class="quiet">所有记录仅保存在当前浏览器</span><button class="secondary" id="export-journal">下载我的见闻录 ↓</button></div>`,
  );
  document
    .querySelectorAll('[data-journal-tab]')
    .forEach((b) => (b.onclick = () => showJournal(b.dataset.journalTab)));
  $('#export-journal').onclick = exportJournal;
}
function showSettings() {
  openModal(
    '阅读与设置',
    '调整阅读体验 · 进度自动保存在当前浏览器',
    `<div class="settings-row"><div><h3>对话字号 <span id="font-number">${settings.font}</span> px</h3><p>场景文字和对话保持清晰可读</p></div><input id="font-range" aria-label="对话字号" type="range" min="20" max="32" step="1" value="${settings.font}"></div><div class="settings-row"><div><h3>纸上小调</h3><p>轻柔的合成音色，默认关闭</p></div><button class="secondary" id="setting-sound">${settings.sound ? '关闭音乐' : '开启音乐'}</button></div><div class="settings-row"><div><h3>保存与导出</h3><p>${storageOK ? '当前浏览器可用自动存档' : '浏览器存储不可用，请使用导出保存'}</p></div><button class="secondary" id="download-save">导出存档</button></div><div class="settings-row"><div><h3>导入存档</h3><p>用先前导出的 JSON 恢复进度</p></div><label class="secondary" style="cursor:pointer">选择文件<input id="import-save" type="file" accept="application/json,.json" class="screenreader-only"></label></div><div class="settings-row"><div><h3>重新来到小城</h3><p>清除当前旅程；可以先导出存档</p></div><button class="secondary danger" id="restart">重新开始</button></div>`,
  );
  $('#font-range').oninput = (e) => {
    settings.font = Number(e.target.value);
    document.documentElement.style.setProperty('--text', settings.font + 'px');
    $('#font-number').textContent = settings.font;
    try {
      localStorage.setItem('qunmo-settings', JSON.stringify({ font: settings.font }));
    } catch {}
  };
  $('#setting-sound').onclick = async () => {
    await toggleSound();
    const button = $('#setting-sound');
    if (button) button.textContent = settings.sound ? '关闭音乐' : '开启音乐';
  };
  $('#download-save').onclick = () =>
    download('群魔-小城纸影-存档.json', JSON.stringify(state, null, 2), 'application/json');
  $('#restart').onclick = confirmRestart;
  $('#import-save').onchange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > MAX_SAVE_BYTES) {
      toast('存档文件过大，请选择本游戏导出的 JSON。');
      return;
    }
    try {
      const loaded = restore(await file.text());
      if (!loaded) {
        toast('无法识别这个存档，当前进度已保留。');
        return;
      }
      pendingImport = loaded;
      openModal(
        '恢复这份旅程？',
        '导入会覆盖当前浏览器中的游戏进度',
        `<p class="about-copy">存档位置：${CHAPTERS[loaded.chapter].subtitle} · ${CHAPTERS[loaded.chapter].title}<br>已收集 ${loaded.evidence.length} 条证据，${loaded.log.length} 条记录。</p><div class="continue-row"><button class="secondary" id="cancel-import">取消</button><button class="primary" id="confirm-import">恢复这个存档 →</button></div>`,
      );
      $('#cancel-import').onclick = showSettings;
      $('#confirm-import').onclick = () => {
        state = pendingImport;
        phase = state.started && !state.log.length ? 'chapter-intro' : 'browse';
        selected = null;
        result = null;
        pendingImport = null;
        keys.clear();
        walkTarget = null;
        renderedChapter = -1;
        cameraRise = 0;
        dialogueRise = 0;
        save();
        render();
        modal.close();
        if (state.finished) showEnding();
        toast('已恢复旅程。');
      };
    } catch {
      toast('读取失败，当前进度已保留。');
    }
  };
}
let pendingImport = null;
function confirmRestart() {
  openModal(
    '重新开始这段旅程？',
    '当前旅程将被替换',
    `<p class="about-copy">你也可以先保留一份存档，再去走另一条路。</p><div class="ending-actions"><button class="secondary" id="backup">先导出当前存档</button><button class="secondary" id="cancel-restart">保留旅程</button><button class="primary danger" id="confirm-restart">确认重新开始</button></div>`,
  );
  $('#backup').onclick = () =>
    download('群魔-小城纸影-存档.json', JSON.stringify(state, null, 2), 'application/json');
  $('#cancel-restart').onclick = () => modal.close();
  $('#confirm-restart').onclick = () => {
    state = newGame();
    state.started = true;
    phase = 'chapter-intro';
    selected = null;
    result = null;
    renderedChapter = -1;
    cameraRise = 0;
    save();
    render();
    modal.close();
  };
}
function showHelp() {
  openModal(
    '如何走进这座小城',
    '随时可以停下来阅读，不会错过倒计时',
    `<div class="about-copy"><p>使用 <b>A / D</b> 或 <b>← / →</b> 移动，靠近人物后按 <b>E</b>。也可以直接点击人物或物件，叙述者会走过去。按住 <b>Shift</b> 可以快走。场景横向展开，镜头会跟随你。手机下方提供移动按钮。</p><p>每幕可完成 <b>两次走访</b>。点开对话不计次数，确认选项或“记入手册”才消耗一次。走访后可以免费回看。</p><p>完成两次走访后，向右走到发光的出口，按 <b>E</b>，或直接点击出口，进入 <b>幕间抉择</b>。灰色选项会写明所需证据或行动。选项可用数字键 <b>1 / 2 / 3</b> 选择。</p><p>按 <b>Esc</b> 打开暂停菜单，按 <b>F</b> 切换系统全屏。人物手册按 <b>B</b> 打开，见闻录按 <b>J</b>，地图按 <b>M</b>。按 <b>Space</b> 确认记录或继续对话。对话字号、存档导入导出和重新开始，都在“阅读与设置”里。</p><p>故事按照六幕推进。未来场景随剧情开放，地图不提供回溯修改；想尝试另一条路线，可导出存档后重新开始。</p></div><button class="secondary" id="help-settings">打开阅读与设置 →</button>`,
  );
  $('#help-settings').onclick = showSettings;
}
function showAbout() {
  openModal(
    '关于小城纸影',
    '《群魔》文学改编 · 本地独立网页游戏',
    `<div class="about-copy"><p>你扮演叙述者，走访小城，核实传言并决定如何介入。六幕从原著场景中取材，压缩时间顺序；任务、对白、走访次数和结局判定均为游戏设计。</p><p>原著提要与改编结局分别展示。丽莎、沙托夫或基里洛夫受到及时帮助的路线属于反事实改编。人物手册中的简介为本项目重新撰写的阅读概述，并非原著译文。</p><p>游戏包含死亡与自杀主题，以对话、场外叙事和事后记录表现。基里洛夫的观点属于人物思想，不代表游戏结论。</p><p>本作采用 1869 年秋作为改编的美术时间锚点。衣饰参考 1860 年代服装图版，布景为原创剪纸演绎。音乐由浏览器实时合成。无外部字体、图片、账号或网络 API。进度保存在当前浏览器，不会上传。</p><p>作者：Ailln 与贡献者。软件实现采用 MIT，原创内容采用 CC BY 4.0。<a href="https://github.com/ai-graveyard/qunmo-game" target="_blank" rel="noreferrer">源码、许可与来源说明 ↗</a></p><p>原著参考：<a href="https://www.gutenberg.org/ebooks/8117" target="_blank" rel="noreferrer">The Possessed / The Devils · Project Gutenberg ↗</a></p></div><div class="ending-actions"><button class="secondary" id="about-era">时代与美术参考 →</button><button class="secondary" id="about-settings">阅读与设置 →</button></div>`,
  );
  $('#about-settings').onclick = showSettings;
  $('#about-era').onclick = showEra;
}
function showEra() {
  openModal(
    '时代手记',
    '一八六九年秋 · 俄国省城',
    `<div class="era-intro"><div class="era-year">1869<span>ОСЕНЬ · 秋</span></div><div><h3>改革之后的小城</h3><p>1861 年农奴解放改革之后，旧贵族的体面生活仍在延续，新思想、报刊与秘密结社也进入省城。玩家从贵妇的沙龙走到普通人的住处，听见不同处境中的人如何谈论自由。</p></div></div><div class="spoiler-banner">${SETTING.note} 场景、服装为结合时代资料的剪纸演绎，剧情时间顺序有所压缩。</div><div class="era-notes"><section><h3>衣饰与身份</h3><p>长礼服、马甲、领巾与怀表链；高领日装、长裙、披肩与盘发。衣料、剪裁和磨损程度帮助区分人物的处境。</p></section><section><h3>日常生活</h3><p>沙龙里的茶炊、钢琴与瓷砖炉；普通住处的木床、炉子、圣像与烛台。纸条以封蜡信件、账簿和手稿呈现。</p></section><section><h3>秋日省城</h3><p>平缓河岸、木屋与灰泥宅邸，远处的教堂、桦树、马车与落叶。明亮纸色中保留秋日的清冷。</p></section></div><div class="era-sources"><h3>可查阅的时代参考</h3><a href="https://uritextilecollection.omeka.net/items/show/204" target="_blank" rel="noreferrer">1860 年男性服装图版 · 罗德岛大学服装收藏 ↗</a><a href="https://www.loc.gov/item/2021669208/" target="_blank" rel="noreferrer">1860 年代俄国女性肖像 · 美国国会图书馆 ↗</a><a href="https://www.thejohnbrightcollection.co.uk/costume/dress-35/" target="_blank" rel="noreferrer">1868—1870 年长裙 · John Bright 服装收藏 ↗</a><a href="https://rumyancev.pushkinmuseum.art/data/catalogue/canvas/rossiya/gtg5249.php" target="_blank" rel="noreferrer">佩罗夫《梅季希饮茶》1862 · 普希金博物馆资料 ↗</a></div>`,
  );
}
function showEnding() {
  const e = ending(state);
  openModal(
    '你的小城记录',
    '终幕 · 这一趟旅程，已经写在纸上',
    `<div class="ending-wrap"><div class="ending-type">${e.type} / YOUR CHRONICLE</div><h3>${e.title}</h3><p>${e.text}</p><div class="ending-stats"><div><strong>${state.evidence.length}</strong><span>已收集证据</span></div><div><strong>${state.stats.care}</strong><span>照料与介入</span></div><div><strong>${state.stats.complicity}</strong><span>参与操纵</span></div></div><div class="fates"><div class="fate"><b>丽莎</b>${state.flags.savedLiza ? '<small>改编分支</small><br>你核实指控、打开侧门，带她离开了人群。' : '<br>你没有完成侧门撤离。她的结局沿用原著：死于人群。'}</div><div class="fate"><b>沙托夫</b>${state.flags.savedShatov ? '<small>改编分支</small><br>你带着交叉核对的证据阻止赴约，让他留在家中。' : '<br>你没有及时阻止邀约。他的结局沿用原著：遭到谋杀。'}</div><div class="fate"><b>基里洛夫</b>${state.flags.helpedKirillov ? '<small>改编分支</small><br>你陪伴并找人共同求助，阻止彼得独自进入，争取到这一夜。' : '<br>你没有在最后一夜赶到。他的结局沿用原著：在彼得的操纵下留下认罪并自杀。'}</div><div class="fate"><b>你的记录</b><br>${state.flags.honestRecord ? '你写下自己的参与，并给事实与推测留下界限。' : '你淡化了自己的参与。记录中仍有需要下一位读者追问的空白。'}</div></div><p class="quiet" style="font:12px/1.9 var(--sans)">局部命运改变属于游戏改编。原著人物身份与命运可在人物手册中查看。</p><div class="ending-actions"><button class="primary" id="ending-journal">下载这趟旅程 ↓</button><button class="secondary" id="ending-book">打开人物手册</button><button class="secondary" id="ending-restart">再走一条路 ↗</button></div></div>`,
  );
  $('#ending-journal').onclick = exportJournal;
  $('#ending-book').onclick = () => showBook();
  $('#ending-restart').onclick = confirmRestart;
}
function download(name, body, type) {
  downloadFile(name, body, type);
  toast('文件已准备下载。');
}
function exportJournal() {
  download('群魔-我的小城见闻录.txt', journalText(state), 'text/plain;charset=utf-8');
}
function exportPeople() {
  download('群魔-一页人物身份图.svg', peopleSVG(), 'image/svg+xml;charset=utf-8');
}
async function toggleSound() {
  try {
    if (settings.sound) await ambient.pause();
    else await ambient.play();
    settings.sound = !settings.sound;
  } catch (error) {
    toast(error.message || '浏览器暂时未能开启音乐，请再点击一次。');
  }
}
render();
requestAnimationFrame(moveFrame);
showIntro();
