import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { ToolAdapter } from "./types.js";
import { commandExists } from "./utils.js";

const settingsFile = join(homedir(), ".claude", "settings.json");

type ClaudeSettings = {
  env?: Record<string, string>;
  [k: string]: unknown;
};

function readSettings(): ClaudeSettings {
  try {
    const raw = readFileSync(settingsFile, "utf8");
    return JSON.parse(raw.replace(/[\x00-\x1F\x7F]/g, " ")) as ClaudeSettings;
  } catch {
    return {};
  }
}

export const claudeCodeAdapter: ToolAdapter = {
  id: "claude-code",
  name: "Claude Code",
  install: "npm i -g @anthropic-ai/claude-code",
  implemented: true,
  checkInstalled() {
    return commandExists("claude");
  },
  getTargetFiles() {
    return [settingsFile];
  },
  isConfigured() {
    const s = readSettings();
    return !!s.env?.ANTHROPIC_AUTH_TOKEN;
  },
  async configure(ctx) {
    const settings = readSettings();
    settings.env ??= {};
    settings.env.ANTHROPIC_AUTH_TOKEN = ctx.apiKey;
    settings.env.ANTHROPIC_BASE_URL = ctx.baseAnthropic;
    settings.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC = "1";
    delete settings.env.ANTHROPIC_API_KEY;

    await mkdir(dirname(settingsFile), { recursive: true });
    await writeFile(settingsFile, JSON.stringify(settings, null, 2));
    return { file: settingsFile, hot: true };
  },
  async reset() {
    if (!existsSync(settingsFile)) return;
    const settings = readSettings();
    if (settings.env) {
      delete settings.env.ANTHROPIC_AUTH_TOKEN;
      delete settings.env.ANTHROPIC_API_KEY;
      delete settings.env.ANTHROPIC_BASE_URL;
      delete settings.env.CLAUDE_CODE_DISABLE_NONESSENTIAL_TRAFFIC;
    }
    await writeFile(settingsFile, JSON.stringify(settings, null, 2));
  },
};
