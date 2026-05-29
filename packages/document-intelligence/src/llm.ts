import type { JsonSchema } from "./types.js";

export type LlmCompletionInput = {
  readonly systemPrompt: string;
  readonly userPrompt: string;
  readonly model: string;
};

export interface LlmClient {
  readonly name: string;
  complete(input: LlmCompletionInput): Promise<string>;
}

type OpenAiCompatibleLlmConfig = {
  readonly baseUrl: string;
  readonly apiKey: string | undefined;
  readonly defaultModel: string;
};

export class OpenAiCompatibleLlmClient implements LlmClient {
  readonly name = "openai-compatible-api";
  private readonly baseUrl: string;
  private readonly apiKey: string | undefined;
  private readonly defaultModel: string;

  constructor(config: OpenAiCompatibleLlmConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, "");
    this.apiKey = config.apiKey;
    this.defaultModel = config.defaultModel;
  }

  getDefaultModel(): string {
    return this.defaultModel;
  }

  async complete(input: LlmCompletionInput): Promise<string> {
    const response = await fetch(`${this.baseUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify({
        model: input.model,
        messages: [
          { role: "system", content: input.systemPrompt },
          { role: "user", content: input.userPrompt }
        ],
        temperature: 0
      })
    });

    if (!response.ok) {
      throw new Error(`LLM request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as {
      choices?: Array<{
        message?: {
          content?: unknown;
        };
      }>;
    };
    const content = payload.choices?.[0]?.message?.content;
    if (typeof content !== "string" || content.trim().length === 0) {
      throw new Error("LLM response did not contain text content");
    }
    return content;
  }
}

export function buildStructuredExtractionPrompt(input: {
  readonly ocrText: string;
  readonly profilePrompt: string;
  readonly outputSchema: JsonSchema;
  readonly toolOutputs: Record<string, string>;
}): string {
  return [
    "Extract structured fields from OCR text.",
    "Use tool outputs when present.",
    "Return only a valid JSON object and nothing else.",
    "",
    "Extraction instructions:",
    input.profilePrompt,
    "",
    "Expected JSON schema:",
    JSON.stringify(input.outputSchema),
    "",
    "Tool outputs:",
    JSON.stringify(input.toolOutputs),
    "",
    "OCR text:",
    input.ocrText
  ].join("\n");
}
