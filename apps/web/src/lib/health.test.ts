import { describe, expect, it } from "vitest";
import { getWebHealthMessage } from "./health.js";

describe("getWebHealthMessage", () => {
  it("returns stable health text", () => {
    expect(getWebHealthMessage()).toBe("OpenTax web is healthy");
  });
});
