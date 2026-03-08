# FishXCode CLI

[简体中文](./README.zh-CN.md) · [English](./README.en.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Português](./README.pt.md)

[![npm version](https://img.shields.io/npm/v/fishxcode-cli)](https://www.npmjs.com/package/fishxcode-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

AI 编码工具管理器 — 一键将 claude-code、aider、codex、opencode 等主流工具接入 FishXCode API。

**[📖 文档站](https://cli.fishxcode.com)** · **[🚀 注册账号](https://fishxcode.com/register?aff=9CTW)** · **[🔑 获取 API Key](https://fishxcode.com/console/token)**

## 安装

```bash
npm i -g fishxcode-cli
# 或直接运行，无需全局安装
npx fishxcode-cli@latest fishx setup
```

## 快速开始

```bash
fishx login     # 保存 FishXCode API Key
fishx setup     # 自动配置所有 AI 工具
fishx doctor    # 验证配置状态
```

## 支持的工具

| 工具 | 配置文件 | 自动配置 |
| --- | --- | --- |
| Claude Code | `~/.claude/settings.json` | ✅ |
| Codex CLI | `~/.codex/config.toml` | ✅ |
| Aider | `~/.aider.conf.yml` | ✅ |
| Continue.dev | `~/.continue/config.yaml` | ✅ |
| OpenCode | `~/.config/opencode/opencode.json` | ✅ |
| OpenClaw | `~/.openclaw/openclaw.json` | ✅ |

## 命令一览

| 命令 | 说明 |
| --- | --- |
| `fishx login` | 保存 FishXCode API Key |
| `fishx logout` | 删除本地凭据 |
| `fishx whoami` | 查看当前 API Key（脱敏展示） |
| `fishx setup` | 配置所有 AI 工具 |
| `fishx doctor` | 检查环境与工具状态 |
| `fishx tools` | 列出所有支持工具 |
| `fishx reset` | 还原所有工具配置 |
| `fishx balance` | 查看账户余额 *（即将开放）* |

## 环境变量

```bash
export FISHXCODE_API_KEY=sk-xxx   # 替代 fishx login 持久化配置
```

## 相关链接

- **文档站**：<https://cli.fishxcode.com>
- **API 控制台**：<https://fishxcode.com/console/token>
- **GitHub**：<https://github.com/fishxcode/fishxcode-cli>
