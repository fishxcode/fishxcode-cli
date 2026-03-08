import { spawnSync } from "node:child_process";
import { readFile } from "node:fs/promises";

export function commandExists(command: string): boolean {
  const checker = process.platform === "win32" ? "where" : "which";
  const result = spawnSync(checker, [command], { stdio: "ignore" });
  return result.status === 0;
}

export async function readTextIfExists(file: string): Promise<string> {
  try {
    return await readFile(file, "utf8");
  } catch {
    return "";
  }
}

export function parseJsonc(text: string): unknown {
  const noLine = text.replace(/\/\/[^\n]*/g, "");
  const noBlock = noLine.replace(/\/\*[\s\S]*?\*\//g, "");
  return JSON.parse(noBlock);
}
