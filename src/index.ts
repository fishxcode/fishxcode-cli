#!/usr/bin/env node
import { Command } from "commander";
import pc from "picocolors";
import pkg from "../package.json" with { type: "json" };
import { balanceCommand } from "./commands/balance.js";
import { doctorCommand } from "./commands/doctor.js";
import { loginCommand, logoutCommand, whoamiCommand } from "./commands/login.js";
import { resetCommand } from "./commands/reset.js";
import { setupCommand } from "./commands/setup.js";
import { toolsCommand } from "./commands/tools.js";
import { API_BASE, APP_NAME } from "./lib/constants.js";

const program = new Command();

program
  .name("fishx")
  .description("一键配置 AI 工具接入 FishXCode API（Bun + TS）")
  .version(pkg.version, "-v, --version")
  .addHelpText("before", `\n${APP_NAME} v${pkg.version}\n${API_BASE}\n`);

program
  .command("login")
  .option("-k, --key <apiKey>", "直接传入 API Key")
  .description("登录并保存 API Key")
  .action(async (opts) => {
    await loginCommand(opts.key);
  });

program.command("whoami").description("查看当前登录状态").action(whoamiCommand);
program.command("logout").description("清除本地 API Key").action(logoutCommand);
program
  .command("setup")
  .description("执行工具配置流程（迁移版）")
  .option("-i, --interactive", "交互式选择配置项")
  .option("--tools <ids>", "仅配置指定工具（逗号分隔），如 codex,aider")
  .option("--model <model>", "覆盖默认模型，如 claude-opus-4-5")
  .option("--dry-run", "仅预览将要修改的配置，不写文件")
  .option("--backup", "写入前备份目标配置文件")
  .action(async (opts) => {
    await setupCommand(opts);
  });
program.command("doctor").description("检查环境与配置状态").action(doctorCommand);
program.command("tools").description("列出支持工具").action(toolsCommand);
program.command("reset").description("重置本地配置").action(resetCommand);
program.command("balance").description("查看余额（占位）").action(balanceCommand);

program.action(() => {
  console.log(pc.cyan("快速开始: fishx login && fishx setup"));
  program.help();
});

const argv = [...process.argv];
const redundantCommand = argv[2];
if (redundantCommand === "fishx" || redundantCommand === "fishxcode") {
  console.log(pc.yellow(`检测到重复命令前缀 "${redundantCommand}"，已自动忽略。`));
  argv.splice(2, 1);
}

program.parseAsync(argv).catch((error: unknown) => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(pc.red(`错误: ${message}`));
  process.exit(1);
});
