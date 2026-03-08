import pc from "picocolors";
import { clearConfig, configFile, getApiKey, maskKey, saveConfig } from "../lib/config.js";
import { ask } from "../lib/prompt.js";

export async function loginCommand(apiKeyArg?: string): Promise<void> {
  let key = apiKeyArg?.trim();
  if (!key) {
    key = await ask("请输入 API Key (sk-xxx): ");
  }

  if (!key.startsWith("sk-")) {
    throw new Error("API Key 格式无效，必须以 sk- 开头");
  }

  await saveConfig({ apiKey: key, savedAt: new Date().toISOString() });
  console.log(pc.green("已保存 API Key"), pc.gray(maskKey(key)));
  console.log(pc.gray(`配置文件: ${configFile}`));
}

export async function whoamiCommand(): Promise<void> {
  const key = await getApiKey();
  if (!key) {
    console.log(pc.yellow("当前未登录"));
    return;
  }
  console.log(pc.green("已登录"), maskKey(key));
}

export async function logoutCommand(): Promise<void> {
  await clearConfig();
  console.log(pc.green("已清除本地凭据"));
}
