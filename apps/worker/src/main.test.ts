import { describe, expect, it } from "vitest";
import { getWorkerHealth } from "./main.js";

describe("getWorkerHealth", () => {
  it("returns worker health payload", () => {
    expect(getWorkerHealth()).toEqual({
      status: "ok",
      service: "worker"
    });
  });
});
