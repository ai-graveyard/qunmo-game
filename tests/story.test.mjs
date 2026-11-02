import test from 'node:test';
import assert from 'node:assert/strict';
import { CHAPTERS, PEOPLE, EVIDENCE, RELATIONS } from '../data.mjs';
import { validateStory, unreachableChoices } from '../scripts/check-story.mjs';
const story = () =>
  structuredClone({ chapters: CHAPTERS, people: PEOPLE, evidence: EVIDENCE, relations: RELATIONS });

test('剧情引用完整，每个选项都能在两次走访约束下抵达', () => {
  assert.deepEqual(validateStory(story()), []);
  assert.deepEqual(unreachableChoices(), []);
});
test('贡献者引入重复地点、未知人物或前置条件时明确报错', () => {
  const data = story();
  data.chapters[0].hotspots[1].id = data.chapters[0].hotspots[0].id;
  data.chapters[0].hotspots[1].person = 'missing';
  data.chapters[0].event.choices[0].requires = 'missing';
  const errors = validateStory(data);
  assert.ok(errors.some((e) => e.includes('重复')));
  assert.ok(errors.some((e) => e.includes('人物不存在')));
  assert.ok(errors.some((e) => e.includes('证据不存在')));
});
