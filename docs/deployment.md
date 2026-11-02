# 构建与独立部署

需要 Node.js 22 或更新版本。构建本身不依赖第三方包：

```sh
npm run build
```

`dist/` 只包含 `runtime-files.mjs` 声明的浏览器文件。所有浏览器资源使用相对地址，因此同一份构建可以放在域名根目录或任意子目录。保留 `ui/` 子目录结构。

## 静态服务器 / GitHub Pages / Nginx

将 `dist/` 的内容复制到静态目录即可。例如根路径 `https://example.com/`，或子路径 `https://example.com/games/qunmo/`。子路径入口应以 `/` 结束；请让服务器将 `/games/qunmo` 重定向到 `/games/qunmo/`，保留查询参数。不需要 SPA fallback、数据库或后端 API。

本机预览构建结果：

```sh
node server.mjs --dist
```

验证子路径（macOS / Linux）：

```sh
BASE_PATH=/games/qunmo PORT=4189 node server.mjs --dist
```

打开 `http://127.0.0.1:4189/games/qunmo/`。`BASE_PATH` 为空表示根路径；非空值以 `/` 开头、不带末尾 `/`，支持多层目录。

GitHub Pages：把 `dist/` 内容作为 Pages 站点产物发布。仓库没有默认开启 Pages 或自动部署，以免 Fork 后的推送触碰线上服务。使用其他静态托管时同样只发布 `dist/`。

## Cloudflare Workers：自己的站点

不要直接使用本项目的正式域名配置。复制不带个人域名的示例：

```sh
cp wrangler.example.jsonc wrangler.local.jsonc
npm run build
npx wrangler@4.156.0 login
npx wrangler@4.156.0 dev --config wrangler.local.jsonc --local --infer-origin-from-routes false
```

默认以根路径运行，使用自己的 `workers.dev` 地址发布：

```sh
npx wrangler@4.156.0 deploy --config wrangler.local.jsonc --dry-run
npx wrangler@4.156.0 deploy --config wrangler.local.jsonc
```

`wrangler.local.jsonc` 已被忽略，不提交账号配置或凭证。

如需挂在自己的已有域名子路径，修改该配置：

```json
{
  "workers_dev": false,
  "vars": { "BASE_PATH": "/games/qunmo", "HTTPS_HOST": "example.com" },
  "routes": [
    { "pattern": "example.com/games/qunmo", "zone_name": "example.com" },
    { "pattern": "example.com/games/qunmo/*", "zone_name": "example.com" }
  ]
}
```

这是需要合并到完整配置中的字段片段。路由和 `BASE_PATH` 必须对应。`HTTPS_HOST` 用于该域名的 HTTP → HTTPS 跳转；本地开发或使用托管平台自带 HTTPS 时可留空。Worker 只提供运行文件，其他路径返回 404；仅接受 GET / HEAD。

本项目原站配置仍是 `wrangler.jsonc`；2026-11-02 的历史发布记录见 `deploy/release-20261102.md`，其中的资源数量、哈希与验收结论仅对应当时版本。

## 生成带许可证的发布包

```sh
npm run release:pack
```

需要系统 `zip` 命令（macOS 与 Ubuntu 通常自带）。输出为 `output/releases/qunmo-game-<版本>.zip`，包含静态页面、内容来源、许可证和部署指南。可将包中的浏览器文件托管，也可直接将 `dist/` 内容上传；再分发时请附带适用许可证和署名。不要通过双击 `index.html` 运行 ES 模块。

存档仅在当前浏览器 origin 的 localStorage 中保存。换域名或浏览器前先导出存档。相同域名不同路径共享存储命名空间，部署多个独立改编时，应为各自版本更换 `SAVE_KEY`。
