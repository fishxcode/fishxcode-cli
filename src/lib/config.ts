import { existsSync } from "node:fs";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { homedir } from "node:os";
import { join } from "node:path";
import { CONFIG_DIRNAME } from "./constants.js";

export type AppConfig = {
  apiKey?: string;
  savedAt?: string;
  preferences?: AppPreferences;
};

export type AppPreferences = {
  defaultTools?: string[];
  defaultModel?: string;
  interactive?: boolean;
  backup?: boolean;
};

export const configDir = join(homedir(), CONFIG_DIRNAME);
export const configFile = join(configDir, "config.json");

export async function loadConfig(): Promise<AppConfig> {
  try {
    if (!existsSync(configFile)) return {};
    const text = await readFile(configFile, "utf8");
    return JSON.parse(text) as AppConfig;
  } catch {
    return {};
  }
}

export async function saveConfig(patch: AppConfig): Promise<AppConfig> {
  await mkdir(configDir, { recursive: true });
  const current = await loadConfig();
  const next = { ...current, ...patch };
  await writeFile(configFile, JSON.stringify(next, null, 2));
  return next;
}

export async function clearConfig(): Promise<void> {
  if (existsSync(configFile)) {
    await rm(configFile, { force: true });
  }
}

export async function getApiKey(): Promise<string> {
  const cfg = await loadConfig();
  return cfg.apiKey ?? process.env.FISHXCODE_API_KEY ?? "";
}

export async function getPreferences(): Promise<AppPreferences> {
  const cfg = await loadConfig();
  return cfg.preferences ?? {};
}

export async function savePreferences(patch: AppPreferences): Promise<AppConfig> {
  const current = await loadConfig();
  const nextPreferences = { ...(current.preferences ?? {}), ...patch };
  return saveConfig({ preferences: nextPreferences });
}

export function maskKey(key: string): string {
  if (!key || key.length < 10) return "****";
  return `${key.slice(0, 8)}...${key.slice(-4)}`;
}
