# 参与贡献

欢迎修复问题、改善阅读和触屏操作、校对剧情与改编说明，以及改进测试。较大的玩法调整请先开 Issue 说明目的和影响。

## 准备与检查

使用 Node.js 22 或更新版本。仅游玩不需要安装依赖；参与开发时执行：

```sh
npm ci
npx playwright install chromium firefox webkit
npm start
```

提交前运行：

```sh
npm run format
npm run check
npm run test:e2e
```

Linux 首次安装浏览器可使用 `npx playwright install --with-deps chromium firefox webkit`。测试服务器使用 4188 端口，需保持该端口空闲。

- 文案改动：检查实际显示、字号和换行；涉及来源时更新 `CREDITS.md`。
- 状态或存档改动：补充能证明行为的状态测试，保留 v1 存档兼容性。
- UI 或移动改动：运行相关浏览器测试；触屏模拟不能替代实体手机验收。
- 部署改动：同时检查根路径与子路径，见 [部署指南](docs/deployment.md)。

## 找到对应代码

| 工作                     | 文件                               |
| ------------------------ | ---------------------------------- |
| 人物、证据、章节和选项   | `data.mjs`                         |
| 走访、幕间、结局         | `engine.mjs`                       |
| 存档校验与兼容           | `save.mjs`                         |
| 页面流程、弹窗、输入事件 | `app.mjs`                          |
| 移动与镜头计算           | `ui/movement.mjs`                  |
| 对话选项与前置条件提示   | `ui/dialogue.mjs`                  |
| 合成音乐、导出内容       | `ui/audio.mjs`、`ui/downloads.mjs` |
| 人物与场景绘制           | `period-art.mjs`、`art.mjs`        |
| 浏览器文件白名单         | `runtime-files.mjs`                |

修改剧情前阅读 [剧情扩展指南](docs/story-authoring.md)。保持运行代码无第三方依赖；开发工具与运行依赖分开说明。增加浏览器模块时同步更新 `runtime-files.mjs`。

## 提交与审查

一个 PR 尽量解决一个问题。纯格式化与行为变更分开提交。描述实际变化、验证方式和仍未覆盖的情况；UI 修改附截图。

请使用尊重、具体的语言讨论问题，针对行为和实现给出反馈。不要提交凭证、账号配置、他人的存档、无授权译文或素材。贡献的软件实现沿用 MIT，原创非软件内容沿用 CC BY 4.0；提交前确认有权按对应条款贡献。

剧透请在标题注明 `[剧透]`，正文使用 GitHub 折叠区包裹结局或分支内容。不要将尚未运行的检查填写为已通过。
