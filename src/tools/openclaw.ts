import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ToolAdapter } from "./types.js";
import { commandExists, parseJsonc } from "./utils.js";

const toolHome = process.env.FISHXCODE_HOME ?? homedir();
const openclawDir = join(toolHome, ".openclaw");
const configFile = join(openclawDir, "openclaw.json");

type OpenClawConfig = {
  env?: Record<string, string>;
  agents?: {
    defaults?: {
      model?: {
        primary?: string;
      };
    };
  };
  models?: {
    mode?: string;
    providers?: Record<string, unknown>;
  };
  [k: string]: unknown;
};

function readConfig(): OpenClawConfig {
  if (!existsSync(configFile)) return {};
  try {
    const raw = readFileSync(configFile, "utf8");
    return parseJsonc(raw) as OpenClawConfig;
  } catch {
    return {};
  }
}

function resolveOpenclawPrimaryModel(model?: string): string {
  if (!model) return "anthropic/claude-sonnet-4-5";
  if (model.includes("/")) return model;
  if (model.startsWith("gpt-")) return `openai/${model}`;
  return `anthropic/${model}`;
}

export const openclawAdapter: ToolAdapter = {
  id: "openclaw",
  name: "OpenClaw",
  install: "npm i -g openclaw@latest",
  implemented: true,
  checkInstalled() {
    return commandExists("openclaw");
  },
  getTargetFiles() {
    return [configFile];
  },
  isConfigured() {
    const c = readConfig();
    return !!(
      c.env?.ANTHROPIC_BASE_URL?.includes("fishxcode.com") || c.models?.providers?.fishxcode
    );
  },
  async configure(ctx) {
    const c = readConfig();

    c.env ??= {};
    c.env.ANTHROPIC_API_KEY = ctx.apiKey;
    c.env.ANTHROPIC_BASE_URL = ctx.baseAnthropic;

    c.agents ??= {};
    c.agents.defaults ??= {};
    c.agents.defaults.model = { primary: resolveOpenclawPrimaryModel(ctx.model) };

    c.models ??= {};
    c.models.mode = "merge";
    c.models.providers ??= {};
    c.models.providers.fishxcode = {
      baseUrl: ctx.baseOpenAI,
      apiKey: ctx.apiKey,
      api: "openai-completions",
      models: [
        { id: "claude-sonnet-4-5", name: "Claude Sonnet 4.5 (FishXCode)" },
        { id: "claude-opus-4-5", name: "Claude Opus 4.5 (FishXCode)" },
        { id: "gpt-5.4", name: "GPT-5.4 (FishXCode)" },
        { id: "gpt-5", name: "GPT-5 (FishXCode)" },
      ],
    };

    await mkdir(openclawDir, { recursive: true });
    await writeFile(configFile, JSON.stringify(c, null, 2));
    return { file: configFile, hot: false };
  },
  async reset() {
    if (!existsSync(configFile)) return;
    const c = readConfig();

    if (c.env) {
      delete c.env.ANTHROPIC_API_KEY;
      delete c.env.ANTHROPIC_BASE_URL;
    }
    if (c.models?.providers) {
      delete c.models.providers.fishxcode;
    }
    if (c.agents?.defaults?.model?.primary?.startsWith("anthropic/")) {
      delete c.agents.defaults.model;
    }

    await writeFile(configFile, JSON.stringify(c, null, 2));
  },
};
