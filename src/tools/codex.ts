import { existsSync, readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ToolAdapter } from "./types.js";
import { commandExists } from "./utils.js";

const toolHome = process.env.FISHXCODE_HOME ?? homedir();
const codexDir = join(toolHome, ".codex");
const tomlFile = join(codexDir, "config.toml");
const jsonFile = join(codexDir, "config.json");

async function readToml(): Promise<string> {
  if (!existsSync(tomlFile)) return "";
  return readFile(tomlFile, "utf8");
}

function removeFishxcodeBlocks(content: string): string {
  return content
    .replace(/^model\s*=\s*"[^"]*"\n?/gm, "")
    .replace(/^model_provider\s*=\s*"fishxcode"\n?/gm, "")
    .replace(/\[model_providers\.fishxcode\][^[]*(?=\n\[|$)/gs, "")
    .replace(/^\s*\n/gm, "");
}

export const codexAdapter: ToolAdapter = {
  id: "codex",
  name: "Codex CLI",
  install: "npm i -g @openai/codex",
  implemented: true,
  checkInstalled() {
    return commandExists("codex");
  },
  getTargetFiles() {
    return [tomlFile, jsonFile];
  },
  isConfigured() {
    if (!existsSync(tomlFile)) return false;
    const content = readFileSync(tomlFile, "utf8");
    return content.includes('model_provider = "fishxcode"') && content.includes("fishxcode.com");
  },
  async configure(ctx) {
    const model = ctx.model ?? "gpt-5.4";
    await mkdir(codexDir, { recursive: true });
    const current = await readToml();
    const cleaned = removeFishxcodeBlocks(current).trim();
    const next = [
      `model = "${model}"`,
      'model_provider = "fishxcode"',
      "",
      cleaned,
      "",
      "[model_providers.fishxcode]",
      'name = "FishXCode"',
      `base_url = "${ctx.baseOpenAI}"`,
      'env_key = "OPENAI_API_KEY"',
      "",
    ]
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trimStart();
    await writeFile(tomlFile, `${next}\n`);

    if (existsSync(jsonFile)) {
      try {
        const raw = await readFile(jsonFile, "utf8");
        const json = JSON.parse(raw) as Record<string, unknown>;
        json.model = model;
        json.provider = "fishxcode";
        const providers = (json.providers ?? {}) as Record<string, unknown>;
        providers.fishxcode = {
          name: "FishXCode",
          baseURL: ctx.baseOpenAI,
          envKey: "OPENAI_API_KEY",
        };
        json.providers = providers;
        await writeFile(jsonFile, JSON.stringify(json, null, 2));
      } catch {
        // ignore
      }
    }

    return { file: tomlFile, hot: false };
  },
  async reset() {
    if (!existsSync(tomlFile)) return;
    const content = await readToml();
    const cleaned = removeFishxcodeBlocks(content).trim();
    await writeFile(tomlFile, cleaned ? `${cleaned}\n` : "");

    if (existsSync(jsonFile)) {
      try {
        const raw = await readFile(jsonFile, "utf8");
        const json = JSON.parse(raw) as {
          provider?: string;
          providers?: Record<string, unknown>;
        };
        if (json.provider === "fishxcode") delete json.provider;
        if (json.providers) delete json.providers.fishxcode;
        await writeFile(jsonFile, JSON.stringify(json, null, 2));
      } catch {
        // ignore
      }
    }
  },
};
