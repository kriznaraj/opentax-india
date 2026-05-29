import { describe, expectTypeOf, it } from "vitest";
import type { AssessmentYear } from "./index.js";

describe("AssessmentYear type", () => {
  it("brands string values", () => {
    expectTypeOf<AssessmentYear>().toExtend<string>();
  });
});
