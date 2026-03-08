[根目录](../../CLAUDE.md) > [src](../) > **lib**

# src/lib — 共享基础库

## 模块职责

提供 CLI 各命令共用的基础能力：配置持久化、全局常量、交互式用户输入、以及工具元数据注册表。本目录中的代码不直接处理命令逻辑，也不引用 `src/tools/` 中具体适配器的配置细节（避免循环依赖）。

---

## 入口与文件说明

| 文件 | 职责 |
| --- | --- |
| `constants.ts` | 全局常量：APP 名称、API 端点、配置目录名 |
| `config.ts` | 配置文件读写（`~/.fishxcode/config.json`）、API Key 读取、脱敏 |
| `prompt.ts` | 基于 `node:readline/promises` 的单行交互式询问 |
| `tools.ts` | `SUPPORTED_TOOLS` 注册表（工具 id / 名称 / 安装命令 / 实装标志）和 `getImplementedAdapter()` |

---

## 对外接口

### constants.ts

```typescript
export const APP_NAME = "FishXCode CLI";
export const API_BASE = "https://fishxcode.com";
export const API_BASE_OPENAI = "https://fishxcode.com/v1";
export const CONFIG_DIRNAME = ".fishxcode";
```

### config.ts

```typescript
export type AppConfig = { apiKey?: string; savedAt?: string };

export const configDir: string;   // ~/.fishxcode
export const configFile: string;  // ~/.fishxcode/config.json

export async function loadConfig(): Promise<AppConfig>
export async function saveConfig(patch: AppConfig): Promise<AppConfig>
export async function clearConfig(): Promise<void>
export async function getApiKey(): Promise<string>   // 优先配置文件，fallback FISHXCODE_API_KEY 环境变量
export function maskKey(key: string): string          // "sk-12345...cdef"
```

### prompt.ts

```typescript
export async function ask(question: string): Promise<string>
```

### tools.ts

```typescript
export type ToolInfo = { id: string; name: string; install: string; implemented: boolean };
export const SUPPORTED_TOOLS: ToolInfo[];  // 7 条：claude-code/codex/aider/continue/opencode/openclaw/cursor
export function getImplementedAdapter(id: string): ToolAdapter | undefined
```

---

## 关键依赖与配置

- 仅使用 Node.js 内置模块（`node:fs/promises`、`node:os`、`node:path`、`node:readline/promises`）
- 无外部运行时依赖
- 配置文件路径：`~/.fishxcode/config.json`（JSON 格式，含 `apiKey` 和 `savedAt`）

---

## 数据模型

### AppConfig（持久化到磁盘）

```typescript
type AppConfig = {
  apiKey?: string;    // FishXCode API Key，以 sk- 开头
  savedAt?: string;   // ISO-8601 保存时间戳
};
```

### ToolInfo（内存注册表）

```typescript
type ToolInfo = {
  id: string;          // 唯一标识，如 "claude-code"
  name: string;        // 展示名，如 "Claude Code"
  install: string;     // 安装命令提示
  implemented: boolean; // 是否已有 ToolAdapter 实现
};
```

---

## 测试与质量

- `test/config.test.ts` 覆盖 `maskKey` 函数的边界场景
- `loadConfig / saveConfig / clearConfig / getApiKey` 无测试，依赖文件系统，建议用临时目录 mock

---

## 常见问题 (FAQ)

**Q：如何修改 API 端点？**
A：修改 `constants.ts` 中的 `API_BASE` 和 `API_BASE_OPENAI`，重新构建。

**Q：API Key 从哪里读取？优先级是？**
A：`getApiKey()` 先读 `~/.fishxcode/config.json`，若为空再读 `FISHXCODE_API_KEY` 环境变量。

---

## 相关文件清单

```
src/lib/
  constants.ts  — 全局常量（API 端点、目录名）
  config.ts     — 配置持久化与 API Key 管理
  prompt.ts     — readline 交互式输入封装
  tools.ts      — SUPPORTED_TOOLS 注册表与适配器查找
```

---

## 变更记录 (Changelog)

| 时间 | 类型 | 内容 |
| --- | --- | --- |
| 2026-03-08 13:16:14 | 增量扫描 | 内容完整，无新缺口，无需更新 |
| 2026-03-08 12:31:46 | 初始化 | 首次生成模块 CLAUDE.md |
