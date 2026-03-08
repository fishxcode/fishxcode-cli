import { aiderAdapter } from "./aider.js";
import { claudeCodeAdapter } from "./claude-code.js";
import { codexAdapter } from "./codex.js";
import { continueAdapter } from "./continue.js";
import { openclawAdapter } from "./openclaw.js";
import { opencodeAdapter } from "./opencode.js";
import type { ToolAdapter } from "./types.js";

export const adapters: ToolAdapter[] = [
  claudeCodeAdapter,
  codexAdapter,
  aiderAdapter,
  continueAdapter,
  opencodeAdapter,
  openclawAdapter,
];

export function getAdapterById(id: string): ToolAdapter | undefined {
  return adapters.find((item) => item.id === id);
}
