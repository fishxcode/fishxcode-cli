import { adapters } from "../tools/index.js";

export type ToolInfo = {
  id: string;
  name: string;
  install: string;
  implemented: boolean;
};

const implemented = new Map(adapters.map((a) => [a.id, a]));

export const SUPPORTED_TOOLS: ToolInfo[] = [
  {
    id: "claude-code",
    name: "Claude Code",
    install: "npm i -g @anthropic-ai/claude-code",
    implemented: true,
  },
  { id: "codex", name: "Codex CLI", install: "npm i -g @openai/codex", implemented: true },
  { id: "aider", name: "Aider", install: "pip install aider-chat", implemented: true },
  {
    id: "continue",
    name: "Continue.dev",
    install: "VS Code 扩展市场安装 Continue",
    implemented: true,
  },
  {
    id: "opencode",
    name: "OpenCode",
    install: "brew install anomalyco/tap/opencode",
    implemented: true,
  },
  { id: "openclaw", name: "OpenClaw", install: "npm i -g openclaw@latest", implemented: true },
  { id: "cursor", name: "Cursor", install: "下载客户端后在 UI 内配置", implemented: false },
];

export function getImplementedAdapter(id: string) {
  return implemented.get(id);
}
