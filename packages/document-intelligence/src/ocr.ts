export type OcrInput = {
  readonly filePath: string;
};

export type OcrOutput = {
  readonly text: string;
  readonly confidence?: number;
};

export interface OcrAdapter {
  readonly name: string;
  extract(input: OcrInput): Promise<OcrOutput>;
}

type HttpOcrAdapterConfig = {
  readonly name: string;
  readonly endpoint: string;
  readonly apiKey: string | undefined;
};

class HttpOcrAdapter implements OcrAdapter {
  readonly name: string;
  private readonly endpoint: string;
  private readonly apiKey: string | undefined;

  constructor(config: HttpOcrAdapterConfig) {
    this.name = config.name;
    this.endpoint = config.endpoint;
    this.apiKey = config.apiKey;
  }

  async extract(input: OcrInput): Promise<OcrOutput> {
    const response = await fetch(this.endpoint, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        ...(this.apiKey ? { authorization: `Bearer ${this.apiKey}` } : {})
      },
      body: JSON.stringify({ filePath: input.filePath })
    });

    if (!response.ok) {
      throw new Error(`${this.name} OCR request failed with status ${response.status}`);
    }

    const payload = (await response.json()) as { text?: unknown; confidence?: unknown };
    if (typeof payload.text !== "string") {
      throw new Error(`${this.name} OCR response did not contain text`);
    }

    if (typeof payload.confidence === "number") {
      return {
        text: payload.text,
        confidence: payload.confidence
      };
    }

    return {
      text: payload.text
    };
  }
}

export function createTesseractOcrAdapter(config: {
  readonly endpoint: string;
  readonly apiKey?: string;
}): OcrAdapter {
  return new HttpOcrAdapter({
    name: "tesseract",
    endpoint: config.endpoint,
    apiKey: config.apiKey
  });
}

export function createPaddleOcrAdapter(config: {
  readonly endpoint: string;
  readonly apiKey?: string;
}): OcrAdapter {
  return new HttpOcrAdapter({
    name: "paddleocr",
    endpoint: config.endpoint,
    apiKey: config.apiKey
  });
}
