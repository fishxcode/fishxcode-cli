import pc from "picocolors";
import { getApiKey, maskKey } from "../lib/config.js";
import { API_BASE, API_BASE_OPENAI } from "../lib/constants.js";
import { SUPPORTED_TOOLS, getImplementedAdapter } from "../lib/tools.js";

export async function setupCommand(): Promise<void> {
  const key = await getApiKey();
  if (!key) {
    throw new Error("未检测到 API Key，请先执行 fishx login");
  }

  console.log(pc.bold("开始配置 FishXCode 工具"));
  console.log(`- API Key: ${maskKey(key)}`);
  console.log(`- Anthropic Base URL: ${API_BASE}`);
  console.log(`- OpenAI Base URL: ${API_BASE_OPENAI}`);

  const applied: string[] = [];
  const skipped: string[] = [];

  for (const tool of SUPPORTED_TOOLS) {
    const adapter = getImplementedAdapter(tool.id);
    if (!adapter) {
      skipped.push(tool.name);
      continue;
    }

    try {
      const result = await adapter.configure({
        apiKey: key,
        baseAnthropic: API_BASE,
        baseOpenAI: API_BASE_OPENAI,
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
}
