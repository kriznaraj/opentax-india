import type { ExtractionProfile } from "./types.js";

function isObject(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === "object" && !Array.isArray(value);
}

export function validateExtractionFields(
  profile: ExtractionProfile,
  fields: Record<string, unknown>
): void {
  for (const field of profile.requiredFields) {
    const value = fields[field];
    if (value === undefined || value === null || value === "") {
      throw new Error(`Missing required extracted field: ${field}`);
    }
  }

  const schema = profile.outputSchema;
  if (schema.type && schema.type !== "object") {
    throw new Error(`Unsupported schema type for profile ${profile.id}: ${schema.type}`);
  }

  if (schema.required) {
    for (const field of schema.required) {
      if (!(field in fields)) {
        throw new Error(`Schema-required field is absent in output: ${field}`);
      }
    }
  }

  if (schema.additionalProperties === false && schema.properties) {
    const allowed = new Set(Object.keys(schema.properties));
    for (const key of Object.keys(fields)) {
      if (!allowed.has(key)) {
        throw new Error(`Unexpected field in extraction output: ${key}`);
      }
    }
  }

  if (!schema.properties) {
    return;
  }

  for (const [fieldName, fieldSchema] of Object.entries(schema.properties)) {
    if (!(fieldName in fields)) {
      continue;
    }
    const value = fields[fieldName];
    if (value === null) {
      continue;
    }
    if (!fieldSchema.type) {
      continue;
    }
    const acceptedTypes = Array.isArray(fieldSchema.type) ? fieldSchema.type : [fieldSchema.type];
    if (!acceptedTypes.includes(runtimeType(value))) {
      throw new Error(
        `Field ${fieldName} has invalid type. Expected ${acceptedTypes.join("|")} but got ${runtimeType(value)}`
      );
    }
  }
}

function runtimeType(value: unknown): string {
  if (Array.isArray(value)) {
    return "array";
  }
  if (isObject(value)) {
    return "object";
  }
  return typeof value;
}
