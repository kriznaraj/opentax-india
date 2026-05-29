import { describe, expect, it } from "vitest";
import { computeFlatTax } from "./index.js";

describe("computeFlatTax", () => {
  it("computes deterministic flat tax amount", () => {
    expect(computeFlatTax({ taxableIncome: 100000, taxRatePercent: 10 })).toBe(10000);
  });
});
