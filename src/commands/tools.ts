import pc from "picocolors";
import { SUPPORTED_TOOLS, getImplementedAdapter } from "../lib/tools.js";

export function toolsCommand(): void {
  console.log(pc.bold("支持的工具:"));
  for (const tool of SUPPORTED_TOOLS) {
    const adapter = getImplementedAdapter(tool.id);
    const installed = adapter ? adapter.checkInstalled() : false;
    const state = adapter ? pc.green("已实装") : pc.yellow("待迁移");
    const installState = installed ? pc.green("已安装") : pc.gray("未安装");

    console.log(`- ${tool.name} (${state} / ${installState})`);
    console.log(pc.gray(`  安装: ${tool.install}`));
  }
}
