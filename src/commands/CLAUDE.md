[根目录](../../CLAUDE.md) > [src](../) > **commands**

# src/commands — 命令处理层

## 模块职责

实现 `fishx` CLI 的所有用户命令，每个文件对应一组命令。命令处理器负责参数校验、调用 `src/lib/` 和 `src/tools/` 的业务逻辑、以及格式化终端输出。

---

## 入口与命令清单

所有命令在 `src/index.ts` 中通过 Commander 注册，处理器实现在本目录。

| 文件 | 导出函数 | 命令 | 功能 |
| --- | --- | --- | --- |
| `login.ts` | `loginCommand` | `fishx login [-k <key>]` | 交互式或参数化输入 API Key，校验格式（须以 `sk-` 开头），保存到 `~/.fishxcode/config.json` |
| `login.ts` | `whoamiCommand` | `fishx whoami` | 读取当前保存的 API Key 并脱敏展示 |
| `login.ts` | `logoutCommand` | `fishx logout` | 删除本地凭据文件 |
| `setup.ts` | `setupCommand` | `fishx setup` | 读取 API Key，遍历所有已实装适配器依次调用 `configure()`，输出配置摘要 |
| `doctor.ts` | `doctorCommand` | `fishx doctor` | 检查运行环境（Bun/Node 版本、API 配置），以及各工具安装与配置状态 |
| `tools.ts` | `toolsCommand` | `fishx tools` | 列出所有支持工具，显示实装状态和安装命令 |
| `reset.ts` | `resetCommand` | `fishx reset` | 清除本地凭据，并对所有适配器调用 `reset()` |
| `balance.ts` | `balanceCommand` | `fishx balance` | 占位命令，待接入服务端余额接口 |

---

## 对外接口

命令处理器均为 `async function`，无返回值（`Promise<void>`），错误以 `throw new Error(message)` 抛出，由 `src/index.ts` 统一捕获并以红色打印后 `process.exit(1)`。

---

## 关键依赖与配置

- `src/lib/config.ts`：`loadConfig / saveConfig / clearConfig / getApiKey / maskKey`
- `src/lib/constants.ts`：`API_BASE / API_BASE_OPENAI`
- `src/lib/prompt.ts`：`ask()`（交互式读取用户输入）
- `src/lib/tools.ts`：`SUPPORTED_TOOLS / getImplementedAdapter()`
- `src/tools/index.ts`：`adapters`（所有适配器实例列表）

---

## 数据模型

无独立数据模型，依赖 `src/lib/config.ts` 中的 `AppConfig`：

```typescript
type AppConfig = {
  apiKey?: string;
  savedAt?: string;
};
```

---

## 测试与质量

当前无命令层单元测试。`setup` / `doctor` / `reset` 等命令均依赖文件系统与外部命令检测，建议通过 mock 文件系统或集成测试补充覆盖。

---

## 常见问题 (FAQ)

**Q：`fishx setup` 报"未检测到 API Key"？**
A：先执行 `fishx login` 或设置环境变量 `FISHXCODE_API_KEY`。

**Q：`fishx setup` 显示工具"未安装"但跳过了？**
A：`configure()` 无论工具是否安装都会执行（适配器不做安装前置检查），如需仅配置已安装工具，需在适配器或命令层增加判断。

---

## 相关文件清单

```text
src/commands/
  balance.ts    — balance 命令（占位）
  doctor.ts     — doctor 命令（环境检查）
  login.ts      — login / logout / whoami 命令
  reset.ts      — reset 命令
  setup.ts      — setup 命令（核心配置流程）
  tools.ts      — tools 命令（工具列表）
```

---

## 变更记录 (Changelog)

| 时间 | 类型 | 内容 |
| --- | --- | --- |
| 2026-03-08 13:16:14 | 增量扫描 | 内容完整，无新缺口，无需更新 |
| 2026-03-08 12:31:46 | 初始化 | 首次生成模块 CLAUDE.md |
