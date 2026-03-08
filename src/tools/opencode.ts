import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { dirname, join } from "node:path";
import type { ToolAdapter } from "./types.js";
import { commandExists, parseJsonc } from "./utils.js";

function resolveOpencodeConfig(): string {
  const candidates = [
    join(homedir(), ".config", "opencode", "opencode.json"),
    join(homedir(), ".config", "opencode", "config.json"),
    join(homedir(), ".opencode", "opencode.json"),
    join(homedir(), ".opencode", "config.json"),
  ];
  return candidates.find((p) => existsSync(p)) ?? candidates[0];
}

async function readOpencodeConfig(file: string): Promise<Record<string, unknown>> {
  if (!existsSync(file)) return {};
  try {
    const raw = await readFile(file, "utf8");
    return parseJsonc(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export const opencodeAdapter: ToolAdapter = {
  id: "opencode",
  name: "OpenCode",
  install: "brew install anomalyco/tap/opencode",
  implemented: true,
  checkInstalled() {
    return commandExists("opencode");
  },
  isConfigured() {
    const file = resolveOpencodeConfig();
    if (!existsSync(file)) return false;
    const content = readFileSync(file, "utf8");
    return content.includes("fishxcode.com");
  },
  async configure(ctx) {
    const file = resolveOpencodeConfig();
    const cfg = await readOpencodeConfig(file);
    const provider = (cfg.provider ?? {}) as Record<string, unknown>;

    cfg.$schema = cfg.$schema ?? "https://opencode.ai/config.json";
    provider.anthropic = {
      options: {
        baseURL: ctx.baseAnthropic,
        apiKey: ctx.apiKey,
      },
    };
    provider.openai = {
      options: {
        baseURL: ctx.baseOpenAI,
        apiKey: ctx.apiKey,
      },
    };
    cfg.provider = provider;
    cfg.model = cfg.model ?? "anthropic/claude-sonnet-4-5";

    await mkdir(dirname(file), { recursive: true });
    await writeFile(file, JSON.stringify(cfg, null, 2));
    return { file, hot: false };
  },
  async reset() {
    const file = resolveOpencodeConfig();
    if (!existsSync(file)) return;
    const cfg = await readOpencodeConfig(file);
    const provider = (cfg.provider ?? {}) as Record<string, unknown>;
    delete provider.anthropic;
    delete provider.openai;
    cfg.provider = provider;
    await writeFile(file, JSON.stringify(cfg, null, 2));
  },
};
