# FishXCode CLI

[简体中文](./README.zh-CN.md) · [English](./README.en.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Português](./README.pt.md)

[![npm version](https://img.shields.io/npm/v/fishxcode-cli)](https://www.npmjs.com/package/fishxcode-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

AI coding tool manager — one-click integration with FishXCode API for claude-code, aider, codex, opencode and more.

**[📖 Docs](https://cli.fishxcode.com)** · **[📦 npm Package](https://www.npmjs.com/package/fishxcode-cli)** · **[🚀 Register](https://fishxcode.com/register?aff=9CTW)** · **[🔑 Get API Key](https://fishxcode.com/console/token)**

## Install

```bash
npm i -g fishxcode-cli
# or run directly without installing
npx fishxcode-cli@latest setup
```

## Quick Start

```bash
fishx login     # save your FishXCode API Key
fishx setup     # configure all AI tools automatically
fishx doctor    # verify configuration status
```

## Supported Tools

| Tool | Config File | Auto-configured |
| --- | --- | --- |
| Claude Code | `~/.claude/settings.json` | ✅ |
| Codex CLI | `~/.codex/config.toml` | ✅ |
| Aider | `~/.aider.conf.yml` | ✅ |
| Continue.dev | `~/.continue/config.yaml` | ✅ |
| OpenCode | `~/.config/opencode/opencode.json` | ✅ |
| OpenClaw | `~/.openclaw/openclaw.json` | ✅ |

## Commands

| Command | Description |
| --- | --- |
| `fishx login` | Save FishXCode API Key |
| `fishx logout` | Remove saved credentials |
| `fishx whoami` | Show current API Key (masked) |
| `fishx setup` | Configure all AI tools |
| `fishx doctor` | Check environment and tool status |
| `fishx tools` | List all supported tools |
| `fishx reset` | Reset all tool configurations |
| `fishx balance` | Check account balance *(coming soon)* |

## Environment Variable

```bash
export FISHXCODE_API_KEY=sk-xxx   # alternative to fishx login
```

## Links

- **Docs**: <https://cli.fishxcode.com>
- **npm Package**: <https://www.npmjs.com/package/fishxcode-cli>
- **API Console**: <https://fishxcode.com/console/token>
- **GitHub**: <https://github.com/fishxcode/fishxcode-cli>
