[根目录](../CLAUDE.md) > **docs**

# docs — VitePress 文档站

## 模块职责

存放 FishXCode CLI 的用户文档站点源码，使用 VitePress 构建，部署到 `https://cli.fishxcode.com`。支持简体中文（根路径）、英语、法语、西班牙语、葡萄牙语五种语言，采用自定义主题（暖金 + 玫瑰粉，支持深色模式）。

---

## 目录结构

```text
docs/
  zh-CN/          — 简体中文内容（重写到根路径，如 /quick-start）
  en/             — 英语内容（/en/quick-start）
  fr/             — 法语内容（/fr/quick-start）
  es/             — 西班牙语内容（/es/quick-start）
  pt/             — 葡萄牙语内容（/pt/quick-start）
  public/         — 静态资源（logo.svg 等）
  .vitepress/
    config.mts    — VitePress 主配置（i18n、导航、侧边栏、PWA、SEO）
    theme/        — 自定义主题
      index.ts    — 主题入口（扩展 DefaultTheme，注入 NotFound / BackToTop）
      NotFound.vue         — 多语言 404 页
      components/
        BackToTop.vue      — 回到顶部按钮
      style.css            — 品牌色变量与全局样式
      dark-mode.css        — 深色模式覆盖样式
```

每个语言目录下均有以下页面文件：

| 文件 | 内容 |
| --- | --- |
| `index.md` | 首页（Hero + Features） |
| `quick-start.md` | 快速开始（安装、初始化流程、获取 API Key） |
| `commands.md` | 命令参考 |
| `tools.md` | 支持工具列表 |
| `release.md` | 发布日志 |

---

## 构建与开发

```bash
# 本地预览（热更新）
bun run docs:dev      # 等价于 vitepress dev docs

# 生产构建（输出到 docs/.vitepress/dist/）
bun run docs:build    # 等价于 vitepress build docs

# 预览生产构建结果
bun run docs:preview  # 等价于 vitepress preview docs
```

构建产物目录 `docs/.vitepress/dist/` 和缓存目录 `docs/.vitepress/cache/` 均已 gitignore。

---

## 技术选型与配置要点

| 项目 | 说明 |
| --- | --- |
| 框架 | VitePress `^1.6.4` |
| PWA | `@vite-pwa/vitepress ^1.1.0`，registerType: autoUpdate |
| 图标组 | `vitepress-plugin-group-icons ^1.7.1` |
| 图片缩放 | `medium-zoom ^1.1.0`，挂载到 `.vp-doc img` |
| 搜索 | VitePress 内置 local search，各语言有独立翻译配置 |
| 部署 | Vercel（站点地址 `https://cli.fishxcode.com`） |
| 主题色 | `--vp-c-brand-1: #c9973e`（暖金色） |
| Base 路径 | 通过环境变量 `VITEPRESS_BASE` 控制，默认 `/` |

---

## 国际化（i18n）结构

| locale key | 语言 | URL 前缀 | 中文内容路径 |
| --- | --- | --- | --- |
| `root` | 简体中文 | `/` | `docs/zh-CN/` |
| `en` | English | `/en/` | `docs/en/` |
| `fr` | Français | `/fr/` | `docs/fr/` |
| `es` | Español | `/es/` | `docs/es/` |
| `pt` | Português | `/pt/` | `docs/pt/` |

中文通过 `rewrites: { 'zh-CN/:path': ':path' }` 重写到根路径，无需 `/zh-CN/` 前缀。

GitHub 编辑链接各语言指向对应的源文件目录（如 `docs/en/:path`）。

---

## 自定义主题说明

- `theme/index.ts`：扩展 VitePress DefaultTheme，在布局插槽 `not-found` 注入 `NotFound.vue`，在 `layout-bottom` 注入 `BackToTop.vue`；并初始化 `medium-zoom` 图片缩放（路由切换时重新初始化）。
- `theme/NotFound.vue`：根据当前路径前缀（`/en/`、`/fr/` 等）自动切换 404 页多语言文案。
- `theme/BackToTop.vue`：滚动超过阈值时显示的浮动按钮。

---

## 常见问题 (FAQ)

**Q：新增一种语言怎么操作？**
A：在 `docs/` 下新建语言目录（如 `docs/de/`），创建对应页面文件，然后在 `docs/.vitepress/config.mts` 的 `locales` 字段中添加新语言配置（nav、sidebar、editLink 等），并在 `NotFound.vue` 的 `i18n` 对象中添加对应翻译。

**Q：如何修改品牌色？**
A：编辑 `docs/.vitepress/theme/style.css` 中的 CSS 变量，`--vp-c-brand-*` 系列控制主色调。

**Q：构建后部署到非根路径怎么配置？**
A：设置环境变量 `VITEPRESS_BASE=/your-path/`，`config.mts` 中的 `p()` 工具函数会自动处理资源路径前缀。

---

## 相关文件清单

```text
docs/
  .vitepress/config.mts           — 主配置（i18n、PWA、SEO、插件）
  .vitepress/theme/index.ts       — 主题入口
  .vitepress/theme/NotFound.vue   — 多语言 404 页
  .vitepress/theme/components/BackToTop.vue  — 回到顶部
  .vitepress/theme/style.css      — 品牌色与全局样式
  .vitepress/theme/dark-mode.css  — 深色模式样式
  public/logo.svg                 — 站点 Logo
  zh-CN/{index,quick-start,commands,tools,release}.md  — 简体中文内容
  en/{index,quick-start,commands,tools,release}.md     — 英语内容
  fr/{index,quick-start,commands,tools,release}.md     — 法语内容
  es/{index,quick-start,commands,tools,release}.md     — 西班牙语内容
  pt/{index,quick-start,commands,tools,release}.md     — 葡萄牙语内容
```

---

## 变更记录 (Changelog)

| 时间 | 类型 | 内容 |
| --- | --- | --- |
| 2026-03-08 13:16:14 | 新建 | 首次生成 docs 模块 CLAUDE.md（VitePress 文档站，5 语言） |
