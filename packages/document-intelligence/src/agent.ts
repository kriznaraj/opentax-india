import { Annotation, END, START, StateGraph } from "@langchain/langgraph";
import {
  buildStructuredExtractionPrompt,
  type LlmClient,
  type OpenAiCompatibleLlmClient
} from "./llm.js";
import type { OcrAdapter } from "./ocr.js";
import type { ExtractionTool } from "./tools.js";
import type { ExtractionProfile, ExtractionResult } from "./types.js";
import { validateExtractionFields } from "./validation.js";

const ExtractionGraphState = Annotation.Root({
  filePath: Annotation<string>(),
  profile: Annotation<ExtractionProfile>(),
  ocrText: Annotation<string | undefined>(),
  selectedOcrAdapter: Annotation<string | undefined>(),
  toolOutputs: Annotation<Record<string, string>>({
    reducer: (_left, right) => right,
    default: () => ({})
  }),
  modelResponse: Annotation<string | undefined>()
});

export type DocumentExtractionAgentConfig = {
  readonly ocrAdapters: readonly OcrAdapter[];
  readonly llmClient: LlmClient;
  readonly llmModel?: string;
  readonly tools?: readonly ExtractionTool[];
};

export class DocumentExtractionAgent {
  private readonly ocrAdapters: readonly OcrAdapter[];
  private readonly llmClient: LlmClient;
  private readonly llmModel: string | undefined;
  private readonly tools: readonly ExtractionTool[];

  constructor(config: DocumentExtractionAgentConfig) {
    if (config.ocrAdapters.length === 0) {
      throw new Error("At least one OCR adapter is required");
    }
    this.ocrAdapters = config.ocrAdapters;
    this.llmClient = config.llmClient;
    this.llmModel = config.llmModel;
    this.tools = config.tools ?? [];
  }

  async extract(input: {
    readonly filePath: string;
    readonly profile: ExtractionProfile;
  }): Promise<ExtractionResult> {
    const graph = this.createGraph();
    const state = await graph.invoke({
      filePath: input.filePath,
      profile: input.profile
    });

    if (!state.modelResponse || !state.selectedOcrAdapter) {
      throw new Error("Extraction graph finished without required fields");
    }

    const parsedJson = this.parseJson(state.modelResponse);
    validateExtractionFields(input.profile, parsedJson);
    return {
      profileId: input.profile.id,
      documentType: input.profile.documentType,
      ocrAdapter: state.selectedOcrAdapter,
      fields: parsedJson,
      rawModelResponse: state.modelResponse
    };
  }

  private createGraph() {
    return new StateGraph(ExtractionGraphState)
      .addNode("runOcr", async (state) => {
        for (const adapter of this.ocrAdapters) {
          try {
            const output = await adapter.extract({ filePath: state.filePath });
            return {
              ocrText: output.text,
              selectedOcrAdapter: adapter.name
            };
          } catch {
            continue;
          }
        }
        throw new Error("All OCR adapters failed");
      })
      .addNode("runTools", async (state) => {
        const ocrText = state.ocrText ?? "";
        const outputs: Record<string, string> = {};
        for (const tool of this.tools) {
          outputs[tool.name] = await tool.run({
            ocrText,
            profile: state.profile
          });
        }
        return {
          toolOutputs: outputs
        };
      })
      .addNode("runLlmExtraction", async (state) => {
        const userPrompt = buildStructuredExtractionPrompt({
          ocrText: state.ocrText ?? "",
          profilePrompt: state.profile.extractionPrompt,
          outputSchema: state.profile.outputSchema,
          toolOutputs: state.toolOutputs
        });
        const model = this.resolveModel();
        const response = await this.llmClient.complete({
          model,
          systemPrompt: "You are a precise tax-document extraction system.",
          userPrompt
        });
        return { modelResponse: response };
      })
      .addEdge(START, "runOcr")
      .addEdge("runOcr", "runTools")
      .addEdge("runTools", "runLlmExtraction")
      .addEdge("runLlmExtraction", END)
      .compile();
  }

  private resolveModel(): string {
    if (this.llmModel) {
      return this.llmModel;
    }
    const maybeClient = this.llmClient as OpenAiCompatibleLlmClient;
    if (typeof maybeClient.getDefaultModel === "function") {
      return maybeClient.getDefaultModel();
    }
    return "default";
  }

  private parseJson(modelResponse: string): Record<string, unknown> {
    const trimmed = modelResponse.trim();
    const first = trimmed.indexOf("{");
    const last = trimmed.lastIndexOf("}");
    if (first < 0 || last < first) {
      throw new Error("Model response did not contain JSON object");
    }
    const jsonSegment = trimmed.slice(first, last + 1);
    const parsed = JSON.parse(jsonSegment) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      throw new Error("Model response JSON was not an object");
    }
    return parsed as Record<string, unknown>;
  }
}
