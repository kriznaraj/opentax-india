export type Brand<K, T> = K & { readonly __brand: T };

export type AssessmentYear = Brand<string, "AssessmentYear">;
