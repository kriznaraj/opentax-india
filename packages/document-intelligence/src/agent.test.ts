import { describe, expect, it } from "vitest";
import { DocumentExtractionAgent } from "./agent.js";
import type { LlmClient } from "./llm.js";
import type { OcrAdapter } from "./ocr.js";
import { form16ExtractionProfile, itrAcknowledgementExtractionProfile } from "./profiles.js";
import type { ExtractionTool } from "./tools.js";

class FakeOcrAdapter implements OcrAdapter {
  readonly name = "fake-ocr";

  async extract(): Promise<{ text: string }> {
    return {
      text: "Gross Salary: 1800000 PAN: ABCDE1234F"
    };
  }
}

class FakeLlmClient implements LlmClient {
  readonly name = "fake-llm";
  private readonly responseBody: Record<string, unknown>;

  constructor(responseBody: Record<string, unknown>) {
    this.responseBody = responseBody;
  }

  async complete(): Promise<string> {
    return JSON.stringify(this.responseBody);
  }
}

class FakeTool implements ExtractionTool {
  readonly name = "fake-tool";

  async run(): Promise<string> {
    return "tool-output";
  }
}

describe("DocumentExtractionAgent", () => {
  it("extracts JSON fields through graph orchestration", async () => {
    const agent = new DocumentExtractionAgent({
      ocrAdapters: [new FakeOcrAdapter()],
      llmClient: new FakeLlmClient({
        pan: "ABCDE1234F",
        tan: null,
        employerName: "Example Pvt Ltd",
        assessmentYear: "2026-27",
        grossSalary: 1800000,
        tds: 150000,
        section80C: 150000,
        section80D: 25000
      }),
      tools: [new FakeTool()]
    });

    const result = await agent.extract({
      filePath: "/tmp/form16.pdf",
      profile: form16ExtractionProfile
    });

    expect(result.profileId).toBe("form16-v1");
    expect(result.ocrAdapter).toBe("fake-ocr");
    expect(result.fields.pan).toBe("ABCDE1234F");
  });

  it("supports additional document profiles without orchestration changes", async () => {
    const agent = new DocumentExtractionAgent({
      ocrAdapters: [new FakeOcrAdapter()],
      llmClient: new FakeLlmClient({
        acknowledgementNumber: "123456789012345",
        pan: "ABCDE1234F",
        assessmentYear: "2026-27",
        filingDate: "2026-07-31",
        returnForm: "ITR-1",
        processingStatus: "Filed"
      }),
      tools: [new FakeTool()]
    });

    const result = await agent.extract({
      filePath: "/tmp/itr-ack.pdf",
      profile: itrAcknowledgementExtractionProfile
    });

    expect(result.profileId).toBe("itr-acknowledgement-v1");
    expect(result.documentType).toBe("ITR_ACKNOWLEDGEMENT");
    expect(result.fields.acknowledgementNumber).toBe("123456789012345");
  });
});
