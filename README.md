# 群魔 · 小城纸影

[在线游玩](https://game.v2ai.org/qunmo/) · [版本记录](CHANGELOG.md) · [参与贡献](CONTRIBUTING.md) · [部署指南](docs/deployment.md) · [剧情扩展](docs/story-authoring.md)

根据陀思妥耶夫斯基《群魔》改编的 2D 文学叙事游戏。你扮演小城中的叙述者，在六幕场景里走访十一位人物、核实传言，并决定何时介入。每幕只有两次走访机会，最终留下属于你的记录。

![游戏场景：会场外的广场](docs/images/gameplay.png)

浅色复古剪纸美术，以 **1869 年秋、俄国省城** 为游戏的美术设定。人物、场景与物件通过 SVG 绘制，音乐由浏览器实时合成。原生 JavaScript ES 模块与 CSS，无第三方运行依赖，无游戏账号和网络 API；加载完整资源后，游戏逻辑无需联网。

**含原著剧透、死亡与自杀主题。** 对白、调查任务、走访限制和可改变的局部命运属于游戏改编，不能代替原著阅读。人物概述、原创内容及时代参考的来源见 [CREDITS.md](CREDITS.md)。

## 本机游玩

需要 Node.js 22 或更高版本，无需安装依赖：

```sh
git clone https://github.com/ai-graveyard/qunmo-game.git
cd qunmo-game
npm start
```

打开终端显示的地址，默认是 `http://127.0.0.1:4173/`。服务器仅监听本机，默认端口占用时会尝试后续端口；显式设置 `PORT` 时端口占用会直接报错。

macOS 可双击 `启动游戏.command` 自动打开浏览器。保持终端窗口开启，按 Ctrl+C 停止。不要直接双击 `index.html`，浏览器需要通过 HTTP 加载 ES 模块。

也可下载 [Release](https://github.com/ai-graveyard/qunmo-game/releases) 中的静态 ZIP，解压后按 `START-HERE.txt` 运行。

## 操作与进度

| 操作                     | 按键或方式                               |
| ------------------------ | ---------------------------------------- |
| 移动 / 快走              | A、D 或左右方向键 / Shift                |
| 交谈与互动               | 靠近后按 E；也可点击人物或物件自动走近   |
| 选择 / 继续              | 数字键 1、2、3 / Space                   |
| 人物手册 / 见闻录 / 地图 | B / J / M                                |
| 结束交谈或暂停 / 全屏    | Esc / F                                  |
| 触屏                     | 点击目标，或使用场景下方的移动和互动按钮 |

每幕两次走访。打开对话不计次数，确认选项或调查才消耗一次；已走访地点可免费回看。完成两次走访后，点击任务栏“前往出口”，或自行走到右侧出口按 E，进入幕间抉择。阅读不倒计时，锁定选项会显示所缺证据或行动。

进度保存在当前浏览器的 localStorage，不会由游戏上传。隐私模式、清理站点数据或更换域名可能使进度不可用；可在“阅读与设置”导入、导出 JSON 存档和调整字号。音乐默认关闭。旧版 v1 存档继续兼容，异常导入会保留当前进度。

人物手册支持导出一页 SVG 身份表，见闻录支持下载 TXT。游戏遵循系统的“减少动态效果”偏好。建议使用当前版本的 Chrome、Firefox、Safari 或 Edge；系统全屏不可用时会保持铺满窗口的显示。

## 开发与验证

开发工具通过锁文件安装，游戏运行代码仍无第三方依赖：

```sh
npm ci
npx playwright install chromium firefox webkit
npm run check
npm run test:e2e
```

Linux 首次安装浏览器：`npx playwright install --with-deps chromium firefox webkit`。

| 命令                                      | 用途                             |
| ----------------------------------------- | -------------------------------- |
| `npm start`                               | 本机启动源码版本                 |
| `npm test`                                | 剧情状态、存档、移动和路由测试   |
| `npm run check:story`                     | 引用、坐标、效果及选项可达性检查 |
| `npm run build`                           | 按白名单生成 `dist/`             |
| `npm run format` / `npm run format:check` | 格式化 / 检查格式                |
| `npm run check`                           | 格式、剧情、状态测试与构建       |
| `npm run test:e2e`                        | 基于构建产物的浏览器测试         |
| `npm run release:pack`                    | 生成带许可证与哈希的静态 ZIP     |

浏览器测试覆盖 Chromium、Firefox、WebKit，以及 390×844、320×568、844×390 触屏模拟尺寸；桌面三浏览器执行六幕完整路线。包含走访取消与回看、出口推进、暂停、刷新续玩、存档导入导出、最大字号、焦点和布局检查。触屏模拟不等于实体手机验收，实际设备检查仍列于 [后续方向](docs/roadmap.md)。

自定义子路径测试：

```sh
npm run build
E2E_BASE_PATH=/games/qunmo npm run test:e2e -- --project=chromium
```

GitHub Actions 执行检查与浏览器测试，不自动部署。2026-11-02 的线上验收结论仅适用于当时发布版本，记录见 `deploy/release-20261102.md`。

## 代码结构

| 文件                                  | 职责                                    |
| ------------------------------------- | --------------------------------------- |
| `data.mjs`                            | 人物、证据、关系和六幕剧情              |
| `engine.mjs`                          | 走访、幕间抉择与结局的纯函数            |
| `save.mjs`                            | v1 存档校验、边界与字段规范化           |
| `app.mjs`                             | 游戏流程、页面、输入和弹窗编排          |
| `ui/`                                 | 移动、对话选项、音频与导出              |
| `period-art.mjs`、`art.mjs`           | SVG 美术与关系图                        |
| `style.css`、`period.css`、`game.css` | 阅读、时代视觉与全屏场景样式            |
| `runtime-files.mjs`                   | 构建、服务器、Worker 共享的运行文件清单 |
| `scripts/`、`tests/`                  | 构建、剧情检查、打包及测试              |
| `cloudflare/worker.mjs`               | 根路径或自定义子路径的静态路由          |

## 构建与部署

```sh
npm run build
node server.mjs --dist
```

同一份 `dist/` 可托管于根路径或子目录。Cloudflare 独立部署使用 `wrangler.example.jsonc`；`wrangler.jsonc` 是原站配置。详细步骤、子路径预览和再分发说明见 [部署指南](docs/deployment.md)。

## 许可与贡献

软件实现采用 [MIT](LICENSE)，本项目原创剧情、美术表达与文档采用 [CC BY 4.0](LICENSE-CONTENT.md)。两者均允许商业使用，内容使用需按条款署名并注明修改；具体文件范围与第三方材料边界见许可说明及 [来源清单](CREDITS.md)。

欢迎提交问题、改善阅读和触屏体验、校对剧情与参考资料。开发约定见 [贡献指南](CONTRIBUTING.md)，后续计划见 [roadmap](docs/roadmap.md)。
