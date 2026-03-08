import { describe, expect, test } from "bun:test";
import { fetchBalanceStats, renderBalance } from "../src/commands/balance.js";
import { loginCommand } from "../src/commands/login.js";

describe("login command", () => {
  test("invalid key should throw", async () => {
    await expect(loginCommand("bad-key")).rejects.toThrow("API Key 格式无效");
  });
});

describe("balance command helpers", () => {
  test("renderBalance prints core fields", () => {
    const text = renderBalance({
      balance: 12.34567,
      todayCost: 1.2,
      monthCost: 9.9,
      totalCalls: 1234,
    });

    expect(text).toContain("12.3457");
    expect(text).toContain("1,234");
    expect(text).toContain("充值");
  });

  test("fetchBalanceStats handles 401", async () => {
    const oldFetch = globalThis.fetch;
    globalThis.fetch = (async () => new Response("", { status: 401 })) as unknown as typeof fetch;

    await expect(fetchBalanceStats("sk-test")).rejects.toThrow("API Key 无效或已过期");

    globalThis.fetch = oldFetch;
  });
});
