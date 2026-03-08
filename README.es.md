# FishXCode CLI

[简体中文](./README.zh-CN.md) · [English](./README.en.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Português](./README.pt.md)

[![npm version](https://img.shields.io/npm/v/fishxcode-cli)](https://www.npmjs.com/package/fishxcode-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

CLI oficial de FishXCode — integración en un clic con la API FishXCode para claude-code, aider, codex, opencode y más.

**[📖 Documentación](https://cli.fishxcode.com/es/)** · **[🚀 Registrarse](https://fishxcode.com/register?aff=9CTW)** · **[🔑 Obtener API Key](https://fishxcode.com/console/token)**

## Instalación

```bash
npm i -g fishxcode-cli
# o ejecutar directamente sin instalar
npx fishxcode-cli@latest fishx setup
```

## Inicio rápido

```bash
fishx login     # guardar tu API Key de FishXCode
fishx setup     # configurar automáticamente todas las herramientas IA
fishx doctor    # verificar el estado de la configuración
```

## Herramientas soportadas

| Herramienta | Archivo de config | Auto-configurado |
| --- | --- | --- |
| Claude Code | `~/.claude/settings.json` | ✅ |
| Codex CLI | `~/.codex/config.toml` | ✅ |
| Aider | `~/.aider.conf.yml` | ✅ |
| Continue.dev | `~/.continue/config.yaml` | ✅ |
| OpenCode | `~/.config/opencode/opencode.json` | ✅ |
| OpenClaw | `~/.openclaw/openclaw.json` | ✅ |

## Comandos

| Comando | Descripción |
| --- | --- |
| `fishx login` | Guardar API Key de FishXCode |
| `fishx logout` | Eliminar credenciales locales |
| `fishx whoami` | Mostrar API Key actual (enmascarada) |
| `fishx setup` | Configurar todas las herramientas IA |
| `fishx doctor` | Verificar entorno y estado de herramientas |
| `fishx tools` | Listar todas las herramientas soportadas |
| `fishx reset` | Restablecer todas las configuraciones |
| `fishx balance` | Consultar saldo de la cuenta *(próximamente)* |

## Variable de entorno

```bash
export FISHXCODE_API_KEY=sk-xxx   # alternativa a fishx login
```

## Enlaces

- **Documentación**: <https://cli.fishxcode.com/es/>
- **Consola API**: <https://fishxcode.com/console/token>
- **GitHub**: <https://github.com/fishxcode/fishxcode-cli>
