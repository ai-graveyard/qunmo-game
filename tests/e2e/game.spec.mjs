import { test, expect } from '@playwright/test';
import { readFile } from 'node:fs/promises';
import { SAVE_KEY } from '../../engine.mjs';
import { CHAPTERS } from '../../data.mjs';

test.beforeEach(async ({ page }) => {
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.__gameErrors = errors;
  await page.bringToFront();
  await page.goto('./');
  await expect(page.locator('#begin')).toBeVisible();
  // Fail each test for unhandled UI errors, including those after an import.
});
test.afterEach(async ({ page }, testInfo) => {
  if (testInfo.status !== testInfo.expectedStatus) {
    const diagnostics = await page
      .evaluate((key) => {
        const save = JSON.parse(localStorage.getItem(key) || 'null');
        return {
          visibility: document.visibilityState,
          focused: document.hasFocus(),
          modalOpen: document.querySelector('#modal')?.open,
          actor: document.querySelector('#actor')?.style.left,
          destinationHidden: document.querySelector('#destination')?.hidden,
          destination: document.querySelector('#destination')?.style.left,
          chapter: save?.chapter,
          visited: save?.visited,
        };
      }, SAVE_KEY)
      .catch((error) => ({ error: error.message }));
    console.log('Game diagnostics:', JSON.stringify(diagnostics));
    await testInfo.attach('game-state', {
      body: JSON.stringify(diagnostics, null, 2),
      contentType: 'application/json',
    });
  }
  expect(page.__gameErrors).toEqual([]);
});

async function begin(page) {
  await page.locator('#begin').click();
  await expect(page.locator('.visit-notice')).toContainText('每幕可以确认两次走访');
  await page.locator('#begin-explore').click();
}
async function approach(page, id) {
  await page.getByRole('button', { name: '小城地图', exact: true }).click();
  await page.locator(`[data-map-spot="${id}"]`).click();
  await expect(page.locator('#narrative')).toBeVisible();
}
async function confirmVisit(page, id, choice) {
  await approach(page, id);
  if (choice === undefined) await page.locator('#record').click();
  else await page.locator(`[data-choice="${choice}"]`).click();
  await page.locator('#continue').click();
}
async function settings(page) {
  await page.getByRole('button', { name: '暂停菜单', exact: true }).click();
  await page.locator('#pause-settings').click();
}
async function noPageOverflow(page) {
  expect(
    await page.evaluate(() => ({
      x: document.documentElement.scrollWidth > innerWidth,
      y: document.documentElement.scrollHeight > innerHeight,
    })),
  ).toEqual({ x: false, y: false });
}

test('走访提示、取消、免费回看、出口推进、暂停与刷新续玩', async ({ page }) => {
  await begin(page);
  await page.getByRole('button', { name: '小城地图', exact: true }).click();
  await page.locator('[data-map-spot="ledger"]').click();
  // A real tab switch during auto-walk must pause and retain the destination.
  const other = await page.context().newPage();
  await other.goto('about:blank');
  await other.close();
  await page.bringToFront();
  await expect(page.locator('#narrative')).toBeVisible();
  await expect(page.locator('.visit-notice')).toContainText('确认选项或记入手册会消耗 1 次');
  await page.locator('#back-explore').click();
  await expect(page.locator('#visit-counter')).toContainText('0 / 2');
  await confirmVisit(page, 'ledger');
  await approach(page, 'ledger');
  await expect(page.locator('#narrative')).toContainText('回看不消耗走访机会');
  await page.locator('#continue').click();
  await expect(page.locator('#visit-counter')).toContainText('1 / 2');
  await confirmVisit(page, 'stepan', 0);
  await page.getByRole('button', { name: '前往出口 →', exact: true }).click();
  await expect(page.locator('[data-choice="0"]')).toBeVisible();
  await page.locator('[data-choice="0"]').click();
  await page.locator('#continue').click();
  await expect(page.locator('h1')).toHaveText(CHAPTERS[1].place);
  await page.locator('#begin-explore').click();
  await page.keyboard.down('d');
  await expect
    .poll(async () => parseFloat(await page.locator('#actor').evaluate((el) => el.style.left)))
    .toBeGreaterThan(15);
  await page.getByRole('button', { name: '暂停菜单', exact: true }).click();
  await page.keyboard.up('d');
  const before = await page.locator('#actor').getAttribute('style');
  await page.keyboard.press('ArrowRight');
  await expect(page.locator('#actor')).toHaveAttribute('style', before);
  await page.locator('#pause-resume').click();
  await page.reload();
  await page.locator('#resume').click();
  await expect(page.locator('h1')).toHaveText(CHAPTERS[1].place);
  await noPageOverflow(page);
});

test('存档下载、异常导入保留进度、旧版本恢复与见闻录下载', async ({ page }) => {
  await begin(page);
  await confirmVisit(page, 'ledger');
  await settings(page);
  const downloadPromise = page.waitForEvent('download');
  await page.locator('#download-save').click();
  const downloaded = await downloadPromise;
  const saved = JSON.parse(await readFile(await downloaded.path(), 'utf8'));
  expect(saved.visited).toEqual(['ledger']);
  const invalid = { ...saved, log: saved.log.map((l) => ({ ...l, chapter: 99 })) };
  await page.locator('#import-save').setInputFiles({
    name: 'invalid.json',
    mimeType: 'application/json',
    buffer: Buffer.from(JSON.stringify(invalid)),
  });
  await expect(page.locator('#toast')).toContainText('当前进度已保留');
  expect(
    await page.evaluate((key) => JSON.parse(localStorage.getItem(key)).visited, SAVE_KEY),
  ).toEqual(['ledger']);
  await page.locator('#import-save').setInputFiles('tests/fixtures/v1-completed.json');
  await page.locator('#confirm-import').click();
  await expect(page.locator('.ending-type')).toContainText('介入者');
  const journalPromise = page.waitForEvent('download');
  await page.locator('#ending-journal').click();
  const journal = await journalPromise;
  expect(await readFile(await journal.path(), 'utf8')).toContain('【行动记录】');
  await page.reload();
  await page.locator('#resume').click();
  await expect(page.locator('.ending-type')).toContainText('介入者');
});

test('最大字号、焦点、减少动态效果与窄屏触控', async ({ page }, testInfo) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
  await begin(page);
  await settings(page);
  await page.locator('#font-range').fill('32');
  await expect(page.locator('#font-number')).toHaveText('32');
  await page.getByRole('button', { name: '关闭窗口', exact: true }).click();
  if (testInfo.project.use.hasTouch) {
    const x = parseFloat(await page.locator('#actor').evaluate((el) => el.style.left));
    const button = page.locator('[data-move="1"]');
    const box = await button.boundingBox();
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
    await page.mouse.down();
    await expect
      .poll(async () => parseFloat(await page.locator('#actor').evaluate((el) => el.style.left)))
      .toBeGreaterThan(x + 2);
    await page.mouse.up();
  }
  await approach(page, 'stepan');
  await expect(page.locator('.dialogue-text')).toBeFocused();
  await page.keyboard.press('Tab');
  await expect(page.locator('[data-choice="0"]')).toBeFocused();
  const narrative = await page.locator('#narrative').boundingBox();
  const viewport = page.viewportSize();
  expect(narrative.x).toBeGreaterThanOrEqual(0);
  expect(narrative.y).toBeGreaterThanOrEqual(0);
  expect(narrative.x + narrative.width).toBeLessThanOrEqual(viewport.width + 1);
  expect(narrative.y + narrative.height).toBeLessThanOrEqual(viewport.height + 1);
  await page.locator('[data-choice="0"]').click();
  await expect(page.locator('#continue')).toBeVisible();
  await noPageOverflow(page);
});

test('六幕完整介入路线，真实走到出口并保留最终记录', async ({ page }, testInfo) => {
  test.setTimeout(180_000);
  test.skip(testInfo.project.use.hasTouch, '桌面三浏览器通关；触屏另有流程与布局检查');
  await begin(page);
  const route = [
    [['ledger'], ['stepan', 0]],
    [
      ['marya', 0],
      ['stavrogin2', 0],
    ],
    [['names'], ['shatov', 0]],
    [['crowd'], ['exit']],
    [
      ['invitation', 0],
      ['shatov5', 0],
    ],
    [['archive'], ['survivors']],
  ];
  for (let chapter = 0; chapter < route.length; chapter++) {
    for (const [id, choice] of route[chapter]) await confirmVisit(page, id, choice);
    await page.getByRole('button', { name: '前往出口 →', exact: true }).click();
    await expect(page.locator('[data-choice="0"]')).toBeVisible();
    await page.locator('[data-choice="0"]').click();
    await page.locator('#continue').click();
    if (chapter < route.length - 1) await page.locator('#begin-explore').click();
    if (chapter === 2) await page.screenshot({ path: testInfo.outputPath('fourth-act.png') });
  }
  await expect(page.locator('.ending-type')).toContainText('介入者');
  const final = await page.evaluate((key) => JSON.parse(localStorage.getItem(key)), SAVE_KEY);
  expect(final.log).toHaveLength(18);
  expect(final.flags.savedLiza).toBe(true);
  expect(final.flags.savedShatov).toBe(true);
});
