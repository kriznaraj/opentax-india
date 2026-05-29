import { describe, expect, it } from "vitest";
import { extractGrossSalary } from "./index.js";

describe("extractGrossSalary", () => {
  it("extracts gross salary when available", () => {
    expect(extractGrossSalary("Gross Salary: 1800000")).toEqual({ grossSalary: 1800000 });
  });
});
