# 创作与参考来源

《群魔 · 小城纸影》由 Ailln 与贡献者制作，开发过程中使用了 AI 辅助编程与文本、美术代码创作。软件实现采用 MIT，原创内容采用 CC BY 4.0；范围见 [内容许可](LICENSE-CONTENT.md)。

## 文学改编

文学基础为陀思妥耶夫斯基的《群魔》（Бесы / The Devils / The Possessed）。阅读入口：[Project Gutenberg ebook 8117](https://www.gutenberg.org/ebooks/8117)。此链接为参考入口，仓库未打包该电子书或任何完整中文译本。

游戏的调查任务、对话、两次走访限制、证据系统和结局判定为本项目的改编设计。人物名字与关系来自原著；人物简介在 1.1.0 中重新撰写为项目概述，不作为任何译本的引文。希加廖夫场景中的台词也已改写为游戏对白。界面中的引号表示人物说话，不表示原著逐字引用。

丽莎、沙托夫和基里洛夫获得帮助的分支属于反事实改编。游戏中的叙述者也是为交互需要设计的角色视角。1869 年秋是本作的美术时间设定，不是对原著时间的逐项考证。

原著、译本、书籍封面、照片和馆藏图像可能具有不同的权利状态。Gutenberg 的版权判定以美国法律为基础，不能替代其他地区或具体译本的核验。后续贡献如包含逐字引文、译文或外部素材，应提供来源和适用许可；无法确认的素材请勿提交。

## 美术与声音

- 人物、服装、室内外场景和物件由 `period-art.mjs` 通过 SVG 几何形状生成。
- 人物关系图由 `art.mjs` 绘制，人物表由 `ui/downloads.mjs` 生成。
- `docs/images/gameplay.png` 为本项目游戏画面截图。
- 音乐由 `ui/audio.mjs` 的 Web Audio 振荡器实时合成，无外部录音或采样。
- 字体使用设备自带字体，无随项目分发的字体文件。

时代视觉参考（提供阅读链接，不随包分发馆藏照片或原图）：

- [1860 年男性服装图版 · 罗德岛大学服装收藏](https://uritextilecollection.omeka.net/items/show/204)
- [1860 年代俄国女性肖像 · 美国国会图书馆](https://www.loc.gov/item/2021669208/)
- [1868—1870 年长裙 · John Bright 服装收藏](https://www.thejohnbrightcollection.co.uk/costume/dress-35/)
- [佩罗夫《梅季希饮茶》1862 · 普希金博物馆资料](https://rumyancev.pushkinmuseum.art/data/catalogue/canvas/rossiya/gtg5249.php)

这些来源用于时代氛围参考，场景与服装不是对具体物品的逐件复原。

## 开发工具

游戏运行时无第三方库。Prettier、Playwright 仅作为开发依赖，其许可证由各软件包提供。开发依赖不包含在静态发布 ZIP 中。
