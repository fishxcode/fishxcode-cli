[根目录](../CLAUDE.md) > **test**

# test — 单元测试

## 模块职责

存放项目的单元测试文件，使用 Bun 内置测试运行器（`bun:test`）。当前覆盖 `src/lib/config.ts` 中的 `maskKey` 函数和 `src/tools/utils.ts` 中的 `parseJsonc` 函数。

---

## 入口与启动

```bash
# 运行所有测试
bun test

# CI 中（.github/workflows/ci.yml）自动执行
```

---

## 测试文件说明

| 文件 | 测试对象 | 覆盖场景 |
| --- | --- | --- |
| `config.test.ts` | `src/lib/config.ts` — `maskKey()` | 短 key（< 10 字符）返回 `****`；正常 key 返回 `前8位...后4位` |
| `utils.test.ts` | `src/tools/utils.ts` — `parseJsonc()` | 含行注释（`//`）和块注释（`/* */`）的 JSON 能正确解析 |

---

## 对外接口

无对外接口，仅为内部质量保障。

---

## 关键依赖与配置

- 测试框架：`bun:test`（Bun 内置，无需额外安装）
- `tsconfig.json` 中 `"include": ["src", "test"]` 确保测试文件纳入类型检查

---

## 数据模型

无独立数据模型。

---

## 测试覆盖现状与缺口

**已覆盖（2 个测试套件，3 个用例）：**
- `config.maskKey`：2 个用例
- `utils.parseJsonc`：1 个用例

**主要缺口：**
- `src/commands/` 所有命令处理器（login、setup、doctor、reset、tools、balance）无测试
- `src/tools/` 所有适配器的 `configure` / `reset` / `checkInstalled` / `isConfigured` 无测试
- `src/lib/config.ts` 的 `loadConfig / saveConfig / clearConfig / getApiKey` 无测试

**建议补充方向：**
- 使用临时目录（`os.tmpdir()`）隔离文件系统副作用，对适配器 `configure` / `reset` 做集成测试
- 对命令处理器用 mock 方式覆盖正常流程和错误路径

---

## 常见问题 (FAQ)

**Q：如何新增测试文件？**
A：在 `test/` 目录添加 `*.test.ts` 文件，Bun 会自动发现并运行。

---

## 相关文件清单

```
test/
  config.test.ts  — maskKey 函数测试
  utils.test.ts   — parseJsonc 函数测试
```

---

## 变更记录 (Changelog)

| 时间 | 类型 | 内容 |
| --- | --- | --- |
| 2026-03-08 13:16:14 | 增量扫描 | 内容完整，无新缺口，无需更新 |
| 2026-03-08 12:31:46 | 初始化 | 首次生成模块 CLAUDE.md |
