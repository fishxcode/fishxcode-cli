import { describe, expect, test } from "bun:test";
import { parseJsonc } from "../src/tools/utils.js";

describe("parseJsonc", () => {
  test("支持行注释与块注释", () => {
    const obj = parseJsonc(`{
      // line
      "a": 1,
      /* block */
      "b": "ok"
    }`) as { a: number; b: string };

    expect(obj.a).toBe(1);
    expect(obj.b).toBe("ok");
  });
});
