import pc from "picocolors";
import { getApiKey, maskKey } from "../lib/config.js";
import { API_BASE, API_BASE_OPENAI } from "../lib/constants.js";
import { SUPPORTED_TOOLS, getImplementedAdapter } from "../lib/tools.js";

export async function doctorCommand(): Promise<void> {
  const key = await getApiKey();

  console.log(pc.bold("环境检查"));
  console.log(`- Bun: ${process.versions.bun ?? "未检测到"}`);
  console.log(`- Node: ${process.versions.node}`);
  console.log(`- API Base: ${API_BASE}`);
  console.log(`- API Base OpenAI: ${API_BASE_OPENAI}`);
  console.log(`- API Key: ${key ? maskKey(key) : pc.red("未配置")}`);

  console.log();
  console.log(pc.bold("工具检查"));
  for (const tool of SUPPORTED_TOOLS) {
    const adapter = getImplementedAdapter(tool.id);
    if (!adapter) {
      console.log(`- ${tool.name}: ${pc.yellow("待迁移")}`);
      continue;
    }

    const installed = adapter.checkInstalled();
    const configured = installed ? adapter.isConfigured() : false;
    const status = !installed
      ? pc.gray("未安装")
      : configured
        ? pc.green("已配置")
        : pc.yellow("未配置");
    console.log(`- ${tool.name}: ${status}`);
  }
}
