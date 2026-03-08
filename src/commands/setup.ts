import pc from "picocolors";
import { existsSync } from "node:fs";
import { copyFile, mkdir } from "node:fs/promises";
import { basename, dirname, join } from "node:path";
import { ask } from "../lib/prompt.js";
import { getApiKey, getPreferences, maskKey, savePreferences } from "../lib/config.js";
import { API_BASE, API_BASE_OPENAI } from "../lib/constants.js";
import { SUPPORTED_TOOLS, getImplementedAdapter } from "../lib/tools.js";
import type { ToolAdapter } from "../tools/types.js";

type SetupOptions = {
  interactive?: boolean;
  tools?: string;
  model?: string;
  dryRun?: boolean;
  backup?: boolean;
};

const DEFAULT_MODEL = "claude-sonnet-4-5";
const MODEL_CHOICES = ["claude-sonnet-4-5", "claude-opus-4-5", "gpt-5.4", "gpt-5"];

function parseToolIds(input: string, validIds: string[]): string[] {
  const raw = input
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  if (raw.length === 0) return [];
  if (raw.includes("all")) return validIds;
  const unknown = raw.filter((id) => !validIds.includes(id));
  if (unknown.length > 0) {
    throw new Error(`无效工具 ID: ${unknown.join(", ")}`);
  }
  return [...new Set(raw)];
}

function getImplementedTools(): Array<{ id: string; name: string; adapter: ToolAdapter }> {
  return SUPPORTED_TOOLS.map((tool) => {
    const adapter = getImplementedAdapter(tool.id);
    return adapter ? { id: tool.id, name: tool.name, adapter } : null;
  }).filter((item): item is { id: string; name: string; adapter: ToolAdapter } => item !== null);
}

async function maybeBackupFiles(files: string[]): Promise<string[]> {
  const backedUp: string[] = [];
  const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
  for (const file of files) {
    if (!existsSync(file)) continue;
    const backupDir = join(dirname(file), ".fishxcode-backups");
    await mkdir(backupDir, { recursive: true });
    const backupFile = join(backupDir, `${basename(file)}.${timestamp}.bak`);
    await copyFile(file, backupFile);
    backedUp.push(backupFile);
  }
  return backedUp;
}

async function resolveInteractiveOptions(
  initial: SetupOptions,
  validToolIds: string[],
  preferenceModel: string,
): Promise<Required<Pick<SetupOptions, "interactive" | "tools" | "model" | "dryRun" | "backup">>> {
  const toolsHint = validToolIds.join(",");
  const defaultTools = initial.tools ?? "all";
  const defaultModel = initial.model ?? preferenceModel;
  const toolAnswer = (
    await ask(`选择工具 ID（逗号分隔，默认 all，可选 ${toolsHint}）: `)
  ).trim();
  const modelAnswer = (await ask(`模型（默认 ${defaultModel}）: `)).trim();
  const dryRunAnswer = (await ask("仅预览不写入？(y/N): ")).trim().toLowerCase();
  const backupAnswer = (await ask("写入前备份配置？(y/N): ")).trim().toLowerCase();

  return {
    interactive: true,
    tools: toolAnswer || defaultTools,
    model: modelAnswer || defaultModel,
    dryRun: dryRunAnswer === "y" || dryRunAnswer === "yes",
    backup: backupAnswer === "y" || backupAnswer === "yes",
  };
}

export async function setupCommand(options: SetupOptions = {}): Promise<void> {
  const key = await getApiKey();
  if (!key) {
    throw new Error("未检测到 API Key，请先执行 fishx login");
  }

  const preferences = await getPreferences();
  const implementedTools = getImplementedTools();
  const validToolIds = implementedTools.map((t) => t.id);
  const preferenceModel = preferences.defaultModel ?? DEFAULT_MODEL;

  let effectiveOptions: SetupOptions = {
    interactive: options.interactive ?? preferences.interactive ?? false,
    tools: options.tools ?? preferences.defaultTools?.join(",") ?? "all",
    model: options.model ?? preferenceModel,
    dryRun: options.dryRun ?? false,
    backup: options.backup ?? preferences.backup ?? false,
  };

  if (effectiveOptions.interactive) {
    effectiveOptions = await resolveInteractiveOptions(effectiveOptions, validToolIds, preferenceModel);
  }

  const selectedToolIds = parseToolIds(effectiveOptions.tools ?? "all", validToolIds);
  const selectedModel = effectiveOptions.model?.trim() || DEFAULT_MODEL;
  const dryRun = !!effectiveOptions.dryRun;
  const backup = !!effectiveOptions.backup;

  await savePreferences({
    defaultTools: selectedToolIds,
    defaultModel: selectedModel,
    interactive: !!effectiveOptions.interactive,
    backup,
  });

  console.log(pc.bold("开始配置 FishXCode 工具"));
  console.log(`- API Key: ${maskKey(key)}`);
  console.log(`- Anthropic Base URL: ${API_BASE}`);
  console.log(`- OpenAI Base URL: ${API_BASE_OPENAI}`);
  console.log(`- 模型: ${selectedModel}`);
  console.log(`- 模式: ${dryRun ? "预览 (dry-run)" : "写入"}`);
  if (backup) {
    console.log("- 备份: 已启用");
  }

  const applied: string[] = [];
  const skipped: string[] = [];
  const backups: string[] = [];

  for (const tool of SUPPORTED_TOOLS.filter((t) => selectedToolIds.includes(t.id))) {
    const adapter = getImplementedAdapter(tool.id);
    if (!adapter) {
      skipped.push(tool.name);
      continue;
    }

    try {
      const targetFiles = adapter.getTargetFiles?.() ?? [];
      if (dryRun) {
        const previewFile = targetFiles[0] ?? "(未知路径)";
        applied.push(`${tool.name} -> ${previewFile}`);
        console.log(pc.cyan(`~ ${tool.name}`), pc.gray(previewFile), pc.gray("[dry-run]"));
        continue;
      }

      if (backup && targetFiles.length > 0) {
        const backupFiles = await maybeBackupFiles(targetFiles);
        backups.push(...backupFiles);
      }

      const result = await adapter.configure({
        apiKey: key,
        baseAnthropic: API_BASE,
        baseOpenAI: API_BASE_OPENAI,
        model: selectedModel,
      });
      applied.push(`${tool.name} -> ${result.file}`);
      console.log(pc.green(`✓ ${tool.name}`), pc.gray(result.file));
    } catch (error) {
      const msg = error instanceof Error ? error.message : String(error);
      console.log(pc.red(`✗ ${tool.name}: ${msg}`));
    }
  }

  console.log();
  console.log(pc.bold("配置摘要"));
  console.log(`- 已实装并执行: ${applied.length}`);
  for (const item of applied) console.log(`  ${pc.green("•")} ${item}`);

  console.log(`- 未实装: ${skipped.length}`);
  for (const item of skipped) console.log(`  ${pc.yellow("•")} ${item}`);
  if (backups.length > 0) {
    console.log(`- 备份文件: ${backups.length}`);
    for (const file of backups) console.log(`  ${pc.blue("•")} ${file}`);
  }
}
