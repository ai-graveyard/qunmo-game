import { PEOPLE, CHAPTERS, EVIDENCE } from '../data.mjs';
import { ending } from '../engine.mjs';
import { escapeHTML as escape } from './dialogue.mjs';

export function downloadFile(name, body, type) {
  const url = URL.createObjectURL(new Blob([body], { type }));
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}
export function journalText(state) {
  const e = state.finished ? ending(state) : null;
  const body = `《群魔 · 小城纸影》见闻录\n${e ? `结局：${e.type} · ${e.title}\n${e.text}\n` : '旅程尚未结束\n'}\n【证据】\n${state.evidence.map((id) => `${EVIDENCE[id].title}（${EVIDENCE[id].source}）\n${EVIDENCE[id].text}`).join('\n\n')}\n\n【行动记录】\n${state.log.map((l) => `${CHAPTERS[l.chapter].subtitle} · ${l.title}\n行动：${l.choice}\n${l.text}`).join('\n\n')}\n\n说明：本作对白、任务与命运分支为原创改编；请与原著区分。\n原创内容：Ailln 与贡献者 · CC BY 4.0（https://creativecommons.org/licenses/by/4.0/）。\n项目：https://github.com/ai-graveyard/qunmo-game\n`;
  return body;
}
export function peopleSVG() {
  const rows = PEOPLE.map((p, i) => {
    const y = 215 + i * 119;
    const split = (s, n) =>
      Array.from({ length: Math.ceil(s.length / n) }, (_, j) => s.slice(j * n, (j + 1) * n));
    return `<g><rect x="55" y="${y}" width="1090" height="106" rx="5" fill="${i % 2 ? '#ebece0' : '#f0eee4'}"/><text x="78" y="${y + 37}" font-size="19" fill="#929e83">${String(i + 1).padStart(2, '0')}</text><text x="120" y="${y + 37}" font-size="25" font-weight="600" fill="#364b3d">${escape(p.name)}</text>${split(
      p.full,
      16,
    )
      .map(
        (line, j) =>
          `<text x="120" y="${y + 66 + j * 19}" font-size="14" fill="#858d79">${escape(line)}</text>`,
      )
      .join('')}${split(p.role, 16)
      .map(
        (line, j) =>
          `<text x="342" y="${y + 35 + j * 27}" font-size="20" fill="#65765a">${escape(line)}</text>`,
      )
      .join('')}${split(p.note, 23)
      .map(
        (line, j) =>
          `<text x="685" y="${y + 35 + j * 27}" font-size="21" fill="#48583f">${escape(line)}</text>`,
      )
      .join('')}</g>`;
  }).join('');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="2400" height="3300" viewBox="0 0 1200 1650"><rect width="1200" height="1650" fill="#f8f5eb"/><g font-family="Songti SC,STSong,serif"><text x="58" y="78" font-size="17" letter-spacing="5" fill="#81916e">БѢСЫ · ОСЕНЬ 1869</text><text x="55" y="147" font-size="54" font-weight="600" fill="#354b3b">群魔 · 人物身份图</text><text x="58" y="184" font-size="18" fill="#8b927e">完整原著提要 / 含剧透 · 与游戏改编分支分开阅读</text><text x="120" y="204" font-size="13" fill="#8c947e">人物</text><text x="342" y="204" font-size="13" fill="#8c947e">身份</text><text x="685" y="204" font-size="13" fill="#8c947e">一句话速记</text>${rows}<path d="M55 1560H1145" stroke="#cbd2bc"/><text x="58" y="1596" font-size="16" fill="#8a937c">《群魔》阅读手册 · 项目原创人物概述 · 小城纸影</text><text x="58" y="1625" font-size="14" fill="#8a937c">Ailln 与贡献者 · CC BY 4.0 · github.com/ai-graveyard/qunmo-game</text></g></svg>`;
  return svg;
}
