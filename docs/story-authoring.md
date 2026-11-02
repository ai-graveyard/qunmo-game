# 扩展剧情

当前是六幕文学改编游戏。新增完整章节通常同时需要剧情数据、场景、美术、地图和存档兼容性设计，不能只添加一段对白。

## 数据约定

`data.mjs` 导出 `PEOPLE`、`EVIDENCE`、`RELATIONS`、`CHAPTERS`。每幕包含 `title`、`subtitle`、`place`、`time`、`mood`、`intro`、`objective`、`hotspots` 和 `event`。

一个交谈地点示例：

```js
{
  id: 'visitor',
  x: 45,
  label: '来访者',
  kind: '交谈',
  person: 'stepan',
  text: '这里写项目原创的场景对白。',
  choices: [
    {
      label: '核对信件来源',
      requires: 'patron',
      reply: '这里写行动结果。',
      effects: { clarity: 1 },
      flag: 'checkedVisitor',
    },
    { label: '暂时离开', reply: '这里写另一种结果。', effects: {} },
  ],
}
```

这是替换或新增地点的数据片段，不应直接覆盖完整文件。无 `choices` 的地点会显示“记入手册”，确认后视为调查。

- 地点 ID 在一幕内唯一，人物 ID 必须出现在 `PEOPLE`。
- `x` 为世界宽度百分比，建议 10–90，确保角色能走近。
- `evidence` 表示获得证据；先在 `EVIDENCE` 定义完整的标题、来源和说明。
- `requires` 仅支持一个证据 ID；`requiresFlags` 是必须全部为真的标记列表。
- `effects` 使用 `clarity`、`care`、`complicity`、`unrest`，当前实现只支持非负整数增量。
- `flag` 在确认行动后写入；界面中的条件名称在 `ui/dialogue.mjs` 中维护。
- 每幕最多完成两次走访，幕间抉择不再消耗走访。地点内的 `requires` 针对行动前的状态判断，不能要求同一地点刚获得的证据。
- 每组最多三个选项，与数字键 1 / 2 / 3 对应。

## 新增一幕

1. 在 `CHAPTERS` 中定义场景、至少两个地点和幕间选项。
2. 复用现有 `mood`，或在 `period-art.mjs` 的场景分派中加入新场景。
3. 按需增加人物绘制、物件和人物关系图坐标。关系图、人物表目前按十一人构图，新增人物需调整版式。
4. 检查两次走访内能否拿到所需证据，再运行 `npm run check:story`。
5. 为新路线添加状态测试，检查结局规则、地图与帮助文字中的幕数描述，并运行浏览器测试。
6. 设计旧存档迁移后再修改章节顺序或 ID。当前 v1 记录用章节索引，插入或删除章节会改变语义；不能仅凭存档格式版本仍为 1 就宣称兼容。

`npm run check:story` 检查引用、重复 ID、坐标、效果，并遍历实际两次走访规则下的选项可达性。它证明条件可满足，不证明故事合理、版式正确或各结局都得到充分叙述；这些仍需路线测试和人工审阅。

原创对白请与原著引文明确区分。引入第三方文本或视觉素材时，先提供来源与许可，再更新 `CREDITS.md`。
