# FishXCode CLI

[简体中文](./README.zh-CN.md) · [English](./README.en.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Português](./README.pt.md)

[![npm version](https://img.shields.io/npm/v/fishxcode-cli)](https://www.npmjs.com/package/fishxcode-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

CLI oficial da FishXCode — integração com um clique na API FishXCode para claude-code, aider, codex, opencode e mais.

**[📖 Documentação](https://cli.fishxcode.com/pt/)** · **[📦 Pacote npm](https://www.npmjs.com/package/fishxcode-cli)** · **[🚀 Cadastrar](https://fishxcode.com/register?aff=9CTW)** · **[🔑 Obter API Key](https://fishxcode.com/console/token)**

## Instalação

```bash
npm i -g fishxcode-cli
# ou executar diretamente sem instalar
npx fishxcode-cli@latest setup
```

## Início rápido

```bash
fishx login     # salvar sua API Key da FishXCode
fishx setup     # configurar automaticamente todas as ferramentas IA
fishx doctor    # verificar o estado da configuração
```

## Ferramentas suportadas

| Ferramenta | Arquivo de config | Auto-configurado |
| --- | --- | --- |
| Claude Code | `~/.claude/settings.json` | ✅ |
| Codex CLI | `~/.codex/config.toml` | ✅ |
| Aider | `~/.aider.conf.yml` | ✅ |
| Continue.dev | `~/.continue/config.yaml` | ✅ |
| OpenCode | `~/.config/opencode/opencode.json` | ✅ |
| OpenClaw | `~/.openclaw/openclaw.json` | ✅ |

## Comandos

| Comando | Descrição |
| --- | --- |
| `fishx login` | Salvar API Key da FishXCode |
| `fishx logout` | Remover credenciais locais |
| `fishx whoami` | Exibir API Key atual (mascarada) |
| `fishx setup` | Configurar todas as ferramentas IA |
| `fishx doctor` | Verificar ambiente e status das ferramentas |
| `fishx tools` | Listar todas as ferramentas suportadas |
| `fishx reset` | Redefinir todas as configurações |
| `fishx balance` | Consultar saldo da conta *(em breve)* |

## Variável de ambiente

```bash
export FISHXCODE_API_KEY=sk-xxx   # alternativa ao fishx login
```

## Links

- **Documentação**: <https://cli.fishxcode.com/pt/>
- **Pacote npm**: <https://www.npmjs.com/package/fishxcode-cli>
- **Console API**: <https://fishxcode.com/console/token>
- **GitHub**: <https://github.com/fishxcode/fishxcode-cli>
