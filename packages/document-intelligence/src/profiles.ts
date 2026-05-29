import type { ExtractionProfile } from "./types.js";

export const form16ExtractionProfile: ExtractionProfile = {
  id: "form16-v1",
  documentType: "FORM16",
  description: "Extract core fields from Form 16 for salary-only Phase-1 processing.",
  extractionPrompt: [
    "Extract fields from Form 16.",
    "Prefer values from Part B when duplicates appear.",
    "Use null for unknown values.",
    "Do not infer values that are not present."
  ].join(" "),
  outputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      pan: { type: ["string", "null"] },
      tan: { type: ["string", "null"] },
      employerName: { type: ["string", "null"] },
      assessmentYear: { type: ["string", "null"] },
      grossSalary: { type: ["number", "null"] },
      tds: { type: ["number", "null"] },
      section80C: { type: ["number", "null"] },
      section80D: { type: ["number", "null"] }
    },
    required: [
      "pan",
      "tan",
      "employerName",
      "assessmentYear",
      "grossSalary",
      "tds",
      "section80C",
      "section80D"
    ]
  },
  requiredFields: ["pan", "assessmentYear", "grossSalary", "tds"]
};

export const itrAcknowledgementExtractionProfile: ExtractionProfile = {
  id: "itr-acknowledgement-v1",
  documentType: "ITR_ACKNOWLEDGEMENT",
  description: "Extract key acknowledgement metadata from ITR acknowledgement documents.",
  extractionPrompt: [
    "Extract fields from ITR acknowledgement.",
    "Capture acknowledgement number, filing date, assessment year, and status fields.",
    "Use null for unknown values.",
    "Do not infer values that are not present."
  ].join(" "),
  outputSchema: {
    type: "object",
    additionalProperties: false,
    properties: {
      acknowledgementNumber: { type: ["string", "null"] },
      pan: { type: ["string", "null"] },
      assessmentYear: { type: ["string", "null"] },
      filingDate: { type: ["string", "null"] },
      returnForm: { type: ["string", "null"] },
      processingStatus: { type: ["string", "null"] }
    },
    required: [
      "acknowledgementNumber",
      "pan",
      "assessmentYear",
      "filingDate",
      "returnForm",
      "processingStatus"
    ]
  },
  requiredFields: ["acknowledgementNumber", "pan", "assessmentYear"]
};

export const defaultExtractionProfiles: readonly ExtractionProfile[] = [
  form16ExtractionProfile,
  itrAcknowledgementExtractionProfile
];
