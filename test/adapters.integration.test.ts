import { afterEach, describe, expect, test } from "bun:test";
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

function withTempHome(): string {
  const dir = mkdtempSync(join(tmpdir(), "fishxcode-cli-test-"));
  process.env.FISHXCODE_HOME = dir;
  return dir;
}

afterEach(() => {
  // noop: each case removes itself
});

describe("adapter integration", () => {
  test("codex configure/reset writes config.toml", async () => {
    const home = withTempHome();
    const { codexAdapter } = await import(`../src/tools/codex.js?t=${Date.now()}`);

    await codexAdapter.configure({
      apiKey: "sk-test",
      baseAnthropic: "https://fishxcode.com",
      baseOpenAI: "https://fishxcode.com/v1",
    });

    const file = join(home, ".codex", "config.toml");
    expect(existsSync(file)).toBeTrue();
    expect(readFileSync(file, "utf8")).toContain('model_provider = "fishxcode"');

    await codexAdapter.reset();
    expect(readFileSync(file, "utf8")).not.toContain('model_provider = "fishxcode"');

    rmSync(home, { recursive: true, force: true });
  });

  test("continue configure/reset writes yaml", async () => {
    const home = withTempHome();
    const { continueAdapter } = await import(`../src/tools/continue.js?t=${Date.now()}`);

    await continueAdapter.configure({
      apiKey: "sk-test",
      baseAnthropic: "https://fishxcode.com",
      baseOpenAI: "https://fishxcode.com/v1",
    });

    const file = join(home, ".continue", "config.yaml");
    expect(existsSync(file)).toBeTrue();
    expect(readFileSync(file, "utf8")).toContain("FishXCode — Claude Sonnet");

    await continueAdapter.reset();
    expect(readFileSync(file, "utf8")).not.toContain("FishXCode — Claude Sonnet");

    rmSync(home, { recursive: true, force: true });
  });

  test("openclaw configure/reset writes provider", async () => {
    const home = withTempHome();
    const file = join(home, ".openclaw", "openclaw.json");
    mkdirSync(join(home, ".openclaw"), { recursive: true });
    writeFileSync(file, "{}", "utf8");

    const { openclawAdapter } = await import(`../src/tools/openclaw.js?t=${Date.now()}`);
    await openclawAdapter.configure({
      apiKey: "sk-test",
      baseAnthropic: "https://fishxcode.com",
      baseOpenAI: "https://fishxcode.com/v1",
    });

    expect(readFileSync(file, "utf8")).toContain("fishxcode");
    await openclawAdapter.reset();
    expect(readFileSync(file, "utf8")).not.toContain('"fishxcode"');

    rmSync(home, { recursive: true, force: true });
  });
});
