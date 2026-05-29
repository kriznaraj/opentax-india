import { describe, expect, it } from "vitest";
import { InMemoryExtractionProfileRegistry } from "./registry.js";

describe("InMemoryExtractionProfileRegistry", () => {
  it("resolves known profiles by document type", () => {
    const registry = InMemoryExtractionProfileRegistry.createDefault();
    const profile = registry.getByDocumentType("FORM16");
    expect(profile.id).toBe("form16-v1");
  });

  it("contains ITR acknowledgement profile in default set", () => {
    const registry = InMemoryExtractionProfileRegistry.createDefault();
    const profile = registry.getByDocumentType("ITR_ACKNOWLEDGEMENT");
    expect(profile.id).toBe("itr-acknowledgement-v1");
  });
});
