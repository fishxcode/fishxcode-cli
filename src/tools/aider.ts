import { existsSync, readFileSync } from "node:fs";
import { readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ToolAdapter } from "./types.js";
import { commandExists } from "./utils.js";

const aiderFile = join(homedir(), ".aider.conf.yml");
const marker = "# fishxcode-cli managed";

async function readConfig(): Promise<string> {
  if (!existsSync(aiderFile)) return "";
  return readFile(aiderFile, "utf8");
}

function removeManagedBlock(content: string): string {
  const lines = content.split("\n");
  const kept: string[] = [];
  let skipping = false;
  for (const line of lines) {
    if (line.includes(marker)) {
      skipping = true;
      continue;
    }
    if (skipping && line.startsWith("# ")) {
      skipping = false;
    }
    if (!skipping) kept.push(line);
  }
  return kept.join("\n").trim();
}

function resolveAiderModel(model?: string): string {
  if (!model) return "openai/claude-sonnet-4-5";
  if (model.includes("/")) return model;
  return `openai/${model}`;
}

export const aiderAdapter: ToolAdapter = {
  id: "aider",
  name: "Aider",
  install: "pip install aider-chat",
  implemented: true,
  checkInstalled() {
    return commandExists("aider");
  },
  getTargetFiles() {
    return [aiderFile];
  },
  isConfigured() {
    if (!existsSync(aiderFile)) return false;
    const content = readFileSync(aiderFile, "utf8");
    return content.includes("fishxcode.com");
  },
  async configure(ctx) {
    const old = await readConfig();
    const clean = removeManagedBlock(old);
    const block = [
      `${marker} — https://fishxcode.com`,
      `openai-api-key: ${ctx.apiKey}`,
      `openai-api-base: ${ctx.baseOpenAI}`,
      `model: ${resolveAiderModel(ctx.model)}`,
      "",
    ].join("\n");
    const next = [clean, block].filter(Boolean).join("\n\n").trim();
    await writeFile(aiderFile, `${next}\n`);
    return { file: aiderFile, hot: false };
  },
  async reset() {
    const old = await readConfig();
    const clean = removeManagedBlock(old);
    await writeFile(aiderFile, clean ? `${clean}\n` : "");
  },
};
