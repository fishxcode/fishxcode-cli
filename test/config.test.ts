import { describe, expect, test } from "bun:test";
import { maskKey } from "../src/lib/config.js";

describe("maskKey", () => {
  test("short key", () => {
    expect(maskKey("abc")).toBe("****");
  });

  test("normal key", () => {
    expect(maskKey("sk-1234567890abcdef")).toBe("sk-12345...cdef");
  });
});
