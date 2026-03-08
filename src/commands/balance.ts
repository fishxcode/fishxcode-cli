import pc from "picocolors";
import { getApiKey } from "../lib/config.js";
import { API_BASE } from "../lib/constants.js";

type BalanceStats = {
  balance?: number;
  todayCost?: number;
  monthCost?: number;
  totalCalls?: number;
};

export async function fetchBalanceStats(apiKey: string): Promise<BalanceStats> {
  const res = await fetch(`${API_BASE}/api/stats/overview`, {
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (res.status === 401) {
    throw new Error("API Key 无效或已过期，请重新 fishx login");
  }

  if (!res.ok) {
    throw new Error(`请求失败 (HTTP ${res.status})`);
  }

  return (await res.json()) as BalanceStats;
}

export function renderBalance(stats: BalanceStats): string {
  const balance = Number(stats.balance ?? 0).toFixed(4);
  const today = Number(stats.todayCost ?? 0).toFixed(4);
  const month = Number(stats.monthCost ?? 0).toFixed(4);
  const calls = Number(stats.totalCalls ?? 0).toLocaleString();

  return [
    `${pc.bold("账户余额")}`,
    `${pc.cyan("余额")}: $${balance}`,
    `${pc.cyan("今日消费")}: $${today}`,
    `${pc.cyan("本月消费")}: $${month}`,
    `${pc.cyan("累计调用")}: ${calls} 次`,
    `${pc.gray(`充值: ${API_BASE}/app/recharge`)}`,
  ].join("\n");
}

export async function balanceCommand(): Promise<void> {
  const apiKey = await getApiKey();
  if (!apiKey) {
    console.log(pc.red("未找到 API Key，请先运行: fishx login"));
    return;
  }

  try {
    const stats = await fetchBalanceStats(apiKey);
    console.log(renderBalance(stats));
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    console.log(pc.red(`获取余额失败: ${message}`));
    console.log(pc.gray(`请前往 ${API_BASE} 查看账户信息`));
  }
}
