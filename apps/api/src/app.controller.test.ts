import { describe, expect, it } from "vitest";
import { AppController } from "./app.controller.js";

describe("AppController", () => {
  it("returns api health payload", () => {
    const controller = new AppController();
    expect(controller.getHealth()).toEqual({
      status: "ok",
      service: "api"
    });
  });
});
