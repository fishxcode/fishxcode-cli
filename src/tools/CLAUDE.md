[根目录](../../CLAUDE.md) > [src](../) > **tools**

# src/tools — AI 工具适配器层

## 模块职责

实现"适配器模式"：为每个受支持的 AI 编码工具提供统一接口的配置驱动器。适配器知道该工具的配置文件路径、格式与字段，负责以幂等方式写入 FishXCode API 凭据，并能在 `reset` 时仅清除自己写入的内容。

---

## 入口与文件说明

| 文件 | 职责 |
| --- | --- |
| `types.ts` | `ToolAdapter` 接口与 `ConfigureContext` / `ConfigureResult` 类型定义 |
| `utils.ts` | 跨适配器工具函数：`commandExists`、`readTextIfExists`、`parseJsonc` |
| `index.ts` | 聚合并导出所有适配器实例列表 `adapters`，提供 `getAdapterById()` |
| `claude-code.ts` | Claude Code 适配器（写 `~/.claude/settings.json`） |
| `codex.ts` | Codex CLI 适配器（写 `~/.codex/config.toml` 及可选 `config.json`） |
| `aider.ts` | Aider 适配器（写 `~/.aider.conf.yml`，标记块管理） |
| `continue.ts` | Continue.dev 适配器（写 `~/.continue/config.yaml` 或 `config.json`） |
| `opencode.ts` | OpenCode 适配器（写 `~/.config/opencode/opencode.json` 等候选路径） |
| `openclaw.ts` | OpenClaw 适配器（写 `~/.openclaw/openclaw.json`） |

---

## 对外接口

### ToolAdapter 接口（`types.ts`）

```typescript
export type ConfigureContext = {
  apiKey: string;       // FishXCode API Key
  baseAnthropic: string; // https://fishxcode.com
  baseOpenAI: string;    // https://fishxcode.com/v1
};

export type ConfigureResult = {
  file: string;  // 写入的配置文件绝对路径
  hot: boolean;  // 是否支持热重载（true 表示无需重启工具）
};

export type ToolAdapter = {
  id: string;
  name: string;
  install: string;
  implemented: boolean;
  checkInstalled: () => boolean;
  isConfigured: () => boolean;
  configure: (ctx: ConfigureContext) => Promise<ConfigureResult>;
  reset: () => Promise<void>;
};
```

### adapters 列表（`index.ts`）

注册顺序：`claudeCode > codex > aider > continue > opencode > openclaw`

---

## 各适配器配置文件与策略

| 工具 | 配置文件 | 写入策略 | hot |
| --- | --- | --- | --- |
| Claude Code | `~/.claude/settings.json` | 写入 `env.ANTHROPIC_AUTH_TOKEN` / `ANTHROPIC_BASE_URL`，删除 `ANTHROPIC_API_KEY` | true |
| Codex CLI | `~/.codex/config.toml`（+可选 `config.json`） | 正则清理旧 fishxcode 块后追加 `[model_providers.fishxcode]` | false |
| Aider | `~/.aider.conf.yml` | 标记注释块隔离，幂等写入 `openai-api-key` / `openai-api-base` | false |
| Continue.dev | `~/.continue/config.yaml` 或 `config.json` | 自动检测格式，向 `models` 列表前插入 FishXCode 模型条目 | true |
| OpenCode | `~/.config/opencode/opencode.json`（多候选路径） | 写入 `provider.anthropic` 和 `provider.openai` 字段 | false |
| OpenClaw | `~/.openclaw/openclaw.json` | 写入 `env.ANTHROPIC_*`、`agents.defaults.model`、`models.providers.fishxcode` | false |

---

## 工具函数（`utils.ts`）

```typescript
// 检测命令是否存在于 PATH（跨平台：which / where）
export function commandExists(command: string): boolean

// 读取文本文件，若不存在返回空字符串
export async function readTextIfExists(file: string): Promise<string>

// 解析 JSONC（支持 // 和 /* */ 注释的 JSON）
export function parseJsonc(text: string): unknown
```

---

## 关键依赖与配置

- 仅使用 Node.js 内置模块（`node:fs`、`node:fs/promises`、`node:child_process`、`node:os`、`node:path`）
- 所有适配器配置文件均写入用户 HOME 目录，不写项目目录
- `checkInstalled()`：对大多数工具使用 `commandExists()`；Continue.dev 检测 `~/.continue` 目录存在性

---

## 测试与质量

- `test/utils.test.ts` 覆盖 `parseJsonc` 函数
- `configure` / `reset` / `checkInstalled` / `isConfigured` 均无测试
- 建议后续用临时 HOME 目录隔离方式补充各适配器的集成测试

---

## 常见问题 (FAQ)

**Q：如何新增一个工具适配器？**
A：
1. 在 `src/tools/` 新建 `<tool>.ts`，实现并导出 `ToolAdapter` 对象
2. 在 `src/tools/index.ts` 的 `adapters` 数组中追加
3. 在 `src/lib/tools.ts` 的 `SUPPORTED_TOOLS` 中添加元数据条目

**Q：`configure()` 是否会覆盖用户手动修改的配置？**
A：各适配器策略不同。aider 使用标记块隔离，只替换 fishxcode 托管区域；codex 使用正则清理再重建；claude-code 和 openclaw 做字段级合并。建议在 `reset()` 前备份。

---

## 相关文件清单

```text
src/tools/
  types.ts        — ToolAdapter / ConfigureContext / ConfigureResult 类型
  utils.ts        — commandExists / readTextIfExists / parseJsonc
  index.ts        — adapters 列表聚合与 getAdapterById()
  claude-code.ts  — Claude Code 适配器
  codex.ts        — Codex CLI 适配器
  aider.ts        — Aider 适配器
  continue.ts     — Continue.dev 适配器
  opencode.ts     — OpenCode 适配器
  openclaw.ts     — OpenClaw 适配器
```

---

## 变更记录 (Changelog)

| 时间 | 类型 | 内容 |
| --- | --- | --- |
| 2026-03-08 13:16:14 | 增量扫描 | 内容完整，无新缺口，无需更新 |
| 2026-03-08 12:31:46 | 初始化 | 首次生成模块 CLAUDE.md |
