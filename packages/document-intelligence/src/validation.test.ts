import { describe, expect, it } from "vitest";
import { form16ExtractionProfile } from "./profiles.js";
import { validateExtractionFields } from "./validation.js";

describe("validateExtractionFields", () => {
  it("accepts valid output", () => {
    expect(() =>
      validateExtractionFields(form16ExtractionProfile, {
        pan: "ABCDE1234F",
        tan: null,
        employerName: "Example Pvt Ltd",
        assessmentYear: "2026-27",
        grossSalary: 1800000,
        tds: 150000,
        section80C: 150000,
        section80D: 25000
      })
    ).not.toThrow();
  });

  it("rejects missing required field values", () => {
    expect(() =>
      validateExtractionFields(form16ExtractionProfile, {
        pan: null,
        tan: null,
        employerName: "Example Pvt Ltd",
        assessmentYear: "2026-27",
        grossSalary: 1800000,
        tds: 150000,
        section80C: 150000,
        section80D: 25000
      })
    ).toThrow(/Missing required extracted field: pan/);
  });
});
