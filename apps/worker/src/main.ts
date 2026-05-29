import {
  DocumentExtractionAgent,
  InMemoryExtractionProfileRegistry,
  OpenAiCompatibleLlmClient,
  PanHintTool,
  RegexCurrencyHintTool,
  createPaddleOcrAdapter,
  createTesseractOcrAdapter
} from "@opentax/document-intelligence";
import type { DocumentType } from "@opentax/document-intelligence";
import { getWorkerHealth } from "./health.js";

type WorkerExtractionRuntimeConfig = {
  readonly documentType: DocumentType;
  readonly inputFilePath: string;
  readonly llmBaseUrl: string;
  readonly llmModel: string;
  readonly llmApiKey: string | undefined;
  readonly tesseractOcrEndpoint: string;
  readonly paddleOcrEndpoint: string;
  readonly ocrApiKey: string | undefined;
};

function readRuntimeConfigFromEnv():
  | { readonly enabled: false }
  | { readonly enabled: true; readonly config: WorkerExtractionRuntimeConfig } {
  const documentType = (process.env.DOC_TYPE ?? "FORM16") as DocumentType;
  const inputFilePath = process.env.DOC_INPUT_FILE_PATH;
  const llmBaseUrl = process.env.LLM_API_BASE_URL;
  const llmModel = process.env.LLM_MODEL;
  const tesseractOcrEndpoint = process.env.TESSERACT_OCR_ENDPOINT;
  const paddleOcrEndpoint = process.env.PADDLE_OCR_ENDPOINT;

  if (!inputFilePath || !llmBaseUrl || !llmModel || !tesseractOcrEndpoint || !paddleOcrEndpoint) {
    return { enabled: false };
  }

  return {
    enabled: true,
    config: {
      documentType,
      inputFilePath,
      llmBaseUrl,
      llmModel,
      llmApiKey: process.env.LLM_API_KEY,
      tesseractOcrEndpoint,
      paddleOcrEndpoint,
      ocrApiKey: process.env.OCR_API_KEY
    }
  };
}

export async function runDocumentExtraction(config: WorkerExtractionRuntimeConfig): Promise<void> {
  const profileRegistry = InMemoryExtractionProfileRegistry.createDefault();
  const profile = profileRegistry.getByDocumentType(config.documentType);
  const agent = new DocumentExtractionAgent({
    ocrAdapters: [
      createTesseractOcrAdapter({
        endpoint: config.tesseractOcrEndpoint,
        ...(config.ocrApiKey ? { apiKey: config.ocrApiKey } : {})
      }),
      createPaddleOcrAdapter({
        endpoint: config.paddleOcrEndpoint,
        ...(config.ocrApiKey ? { apiKey: config.ocrApiKey } : {})
      })
    ],
    llmClient: new OpenAiCompatibleLlmClient({
      baseUrl: config.llmBaseUrl,
      apiKey: config.llmApiKey,
      defaultModel: config.llmModel
    }),
    llmModel: config.llmModel,
    tools: [new RegexCurrencyHintTool(), new PanHintTool()]
  });

  const result = await agent.extract({
    filePath: config.inputFilePath,
    profile
  });

  console.log(JSON.stringify(result));
}

export { getWorkerHealth };

if (import.meta.url === `file://${process.argv[1]}`) {
  const health = getWorkerHealth();
  console.log(`@opentax/worker booted (${health.status})`);
  const runtime = readRuntimeConfigFromEnv();
  if (!runtime.enabled) {
    console.log("@opentax/worker extraction runtime not configured; set env vars to run extraction");
  } else {
    runDocumentExtraction(runtime.config).catch((error: unknown) => {
      const message = error instanceof Error ? error.message : "unknown extraction error";
      console.error(`@opentax/worker extraction failed: ${message}`);
      process.exitCode = 1;
    });
  }
}
