import type { ExtractionProfile } from "./types.js";

export type ToolInput = {
  readonly ocrText: string;
  readonly profile: ExtractionProfile;
};

export interface ExtractionTool {
  readonly name: string;
  run(input: ToolInput): Promise<string>;
}

export class RegexCurrencyHintTool implements ExtractionTool {
  readonly name = "regexCurrencyHint";

  async run(input: ToolInput): Promise<string> {
    const currencyMatches = input.ocrText.match(/\b\d{1,3}(?:,\d{3})+(?:\.\d+)?\b/g) ?? [];
    return `Detected currency-like numbers: ${currencyMatches.slice(0, 20).join(", ")}`;
  }
}

export class PanHintTool implements ExtractionTool {
  readonly name = "panHint";

  async run(input: ToolInput): Promise<string> {
    const panMatch = input.ocrText.match(/\b[A-Z]{5}[0-9]{4}[A-Z]\b/);
    return panMatch ? `Detected PAN candidate: ${panMatch[0]}` : "No PAN candidate detected";
  }
}
