import { existsSync, readFileSync } from "node:fs";
import { mkdir, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import type { ToolAdapter } from "./types.js";

const toolHome = process.env.FISHXCODE_HOME ?? homedir();
const continueDir = join(toolHome, ".continue");
const yamlFile = join(continueDir, "config.yaml");
const jsonFile = join(continueDir, "config.json");

const FISHXCODE_MODELS = [
  { name: "FishXCode — Claude Sonnet", model: "claude-sonnet-4-5" },
  { name: "FishXCode — Claude Opus", model: "claude-opus-4-5" },
];

function getConfigFormat(): "yaml" | "json" {
  if (existsSync(yamlFile)) return "yaml";
  if (existsSync(jsonFile)) return "json";
  return "yaml";
}

function readYaml(): string {
  if (!existsSync(yamlFile)) return "";
  return readFileSync(yamlFile, "utf8");
}

function removeFishxcodeYamlBlocks(content: string): string {
  return content.replace(/ {2}- name: FishXCode[^\n]*\n( {4}[^\n]*\n)*/g, "");
}

async function writeYamlConfig(apiKey: string, baseUrl: string): Promise<void> {
  await mkdir(continueDir, { recursive: true });

  let content = removeFishxcodeYamlBlocks(readYaml());
  if (!content.includes("models:")) {
    content = `models:\n${content}`;
  }

  const modelBlocks = FISHXCODE_MODELS.map((m) => {
    return [
      `  - name: ${m.name}`,
      "    provider: openai",
      `    model: ${m.model}`,
      `    apiKey: ${apiKey}`,
      `    apiBase: ${baseUrl}`,
    ].join("\n");
  }).join("\n");

  const next = content
    .replace("models:\n", `models:\n${modelBlocks}\n`)
    .replace(/\n{3,}/g, "\n\n")
    .trimStart();

  await writeFile(yamlFile, next);
}

type ContinueJsonConfig = {
  models?: Array<Record<string, unknown>>;
  [k: string]: unknown;
};

function readJsonConfig(): ContinueJsonConfig {
  if (!existsSync(jsonFile)) return { models: [] };
  try {
    return JSON.parse(readFileSync(jsonFile, "utf8")) as ContinueJsonConfig;
  } catch {
    return { models: [] };
  }
}

async function writeJsonConfig(data: ContinueJsonConfig): Promise<void> {
  await mkdir(continueDir, { recursive: true });
  await writeFile(jsonFile, JSON.stringify(data, null, 2));
}

export const continueAdapter: ToolAdapter = {
  id: "continue",
  name: "Continue.dev",
  install: "VS Code 扩展市场安装 Continue",
  implemented: true,
  checkInstalled() {
    return existsSync(continueDir);
  },
  isConfigured() {
    if (existsSync(yamlFile)) {
      return readYaml().includes("fishxcode.com");
    }
    const cfg = readJsonConfig();
    return (cfg.models ?? []).some((m) => String(m.apiBase ?? "").includes("fishxcode.com"));
  },
  async configure(ctx) {
    const format = getConfigFormat();
    if (format === "yaml") {
      await writeYamlConfig(ctx.apiKey, ctx.baseOpenAI);
      return { file: yamlFile, hot: true };
    }

    const cfg = readJsonConfig();
    const oldModels = (cfg.models ?? []).filter(
      (m) => !String(m.apiBase ?? "").includes("fishxcode.com"),
    );
    cfg.models = [
      ...FISHXCODE_MODELS.map((m) => ({
        title: m.name,
        provider: "openai",
        model: m.model,
        apiKey: ctx.apiKey,
        apiBase: ctx.baseOpenAI,
      })),
      ...oldModels,
    ];
    await writeJsonConfig(cfg);
    return { file: jsonFile, hot: true };
  },
  async reset() {
    if (existsSync(yamlFile)) {
      const cleaned = removeFishxcodeYamlBlocks(readYaml());
      await writeFile(yamlFile, cleaned);
    }

    if (existsSync(jsonFile)) {
      const cfg = readJsonConfig();
      cfg.models = (cfg.models ?? []).filter(
        (m) => !String(m.apiBase ?? "").includes("fishxcode.com"),
      );
      await writeJsonConfig(cfg);
    }
  },
};
