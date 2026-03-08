import pc from "picocolors";
import { clearConfig } from "../lib/config.js";
import { adapters } from "../tools/index.js";

export async function resetCommand(): Promise<void> {
  await clearConfig();

  let resetCount = 0;
  for (const adapter of adapters) {
    try {
      await adapter.reset();
      resetCount += 1;
    } catch {
      // ignore single tool reset failure
    }
  }

  console.log(pc.green("已重置本地配置"));
  console.log(pc.gray(`已清理适配器配置: ${resetCount}`));
}
