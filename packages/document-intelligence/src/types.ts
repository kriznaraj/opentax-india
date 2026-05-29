export type DocumentType =
  | "FORM16"
  | "ITR_ACKNOWLEDGEMENT"
  | "CAPITAL_GAINS_STATEMENT"
  | "BANK_INTEREST_STATEMENT"
  | "OTHER";

export type JsonSchemaPropertyDefinition = {
  readonly type?: string | readonly string[];
};

export type JsonSchema = {
  readonly type?: string;
  readonly additionalProperties?: boolean;
  readonly required?: readonly string[];
  readonly properties?: Readonly<Record<string, JsonSchemaPropertyDefinition>>;
};

export type ExtractionProfile = {
  readonly id: string;
  readonly documentType: DocumentType;
  readonly description: string;
  readonly extractionPrompt: string;
  readonly outputSchema: JsonSchema;
  readonly requiredFields: readonly string[];
};

export type ExtractionResult = {
  readonly profileId: string;
  readonly documentType: DocumentType;
  readonly ocrAdapter: string;
  readonly fields: Record<string, unknown>;
  readonly rawModelResponse: string;
};
