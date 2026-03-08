# FishXCode CLI

[简体中文](./README.zh-CN.md) · [English](./README.en.md) · [Français](./README.fr.md) · [Español](./README.es.md) · [Português](./README.pt.md)

[![npm version](https://img.shields.io/npm/v/fishxcode-cli)](https://www.npmjs.com/package/fishxcode-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

CLI officiel FishXCode — intégration en un clic avec l'API FishXCode pour claude-code, aider, codex, opencode et plus.

**[📖 Documentation](https://cli.fishxcode.com/fr/)** · **[🚀 S'inscrire](https://fishxcode.com/register?aff=9CTW)** · **[🔑 Obtenir une clé API](https://fishxcode.com/console/token)**

## Installation

```bash
npm i -g fishxcode-cli
# ou exécuter directement sans installation
npx fishxcode-cli@latest fishx setup
```

## Démarrage rapide

```bash
fishx login     # enregistrer votre clé API FishXCode
fishx setup     # configurer automatiquement tous les outils IA
fishx doctor    # vérifier l'état de la configuration
```

## Outils supportés

| Outil | Fichier de config | Auto-configuré |
| --- | --- | --- |
| Claude Code | `~/.claude/settings.json` | ✅ |
| Codex CLI | `~/.codex/config.toml` | ✅ |
| Aider | `~/.aider.conf.yml` | ✅ |
| Continue.dev | `~/.continue/config.yaml` | ✅ |
| OpenCode | `~/.config/opencode/opencode.json` | ✅ |
| OpenClaw | `~/.openclaw/openclaw.json` | ✅ |

## Commandes

| Commande | Description |
| --- | --- |
| `fishx login` | Enregistrer la clé API FishXCode |
| `fishx logout` | Supprimer les identifiants locaux |
| `fishx whoami` | Afficher la clé API actuelle (masquée) |
| `fishx setup` | Configurer tous les outils IA |
| `fishx doctor` | Vérifier l'environnement et l'état des outils |
| `fishx tools` | Lister tous les outils supportés |
| `fishx reset` | Réinitialiser toutes les configurations |
| `fishx balance` | Consulter le solde du compte *(bientôt disponible)* |

## Variable d'environnement

```bash
export FISHXCODE_API_KEY=sk-xxx   # alternative à fishx login
```

## Liens

- **Documentation** : <https://cli.fishxcode.com/fr/>
- **Console API** : <https://fishxcode.com/console/token>
- **GitHub** : <https://github.com/fishxcode/fishxcode-cli>
