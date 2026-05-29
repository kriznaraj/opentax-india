import { describe, expect, it } from "vitest";
import { buildItrPayload } from "./index.js";

describe("buildItrPayload", () => {
  it("builds a minimal payload", () => {
    expect(buildItrPayload("ABCDE1234F")).toEqual({
      taxpayer: {
        pan: "ABCDE1234F"
      }
    });
  });
});
