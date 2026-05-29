# OpenTax Phase-1 Decision Register

## Purpose
This register prevents implicit assumptions by documenting every high-impact design choice, available alternatives, rationale, and explicit approval status.

## Status Legend
- `proposed`: recommendation documented, pending product approval
- `approved`: explicitly accepted
- `rejected`: explicitly declined

## Decisions

### D1. Taxpayer Scope Boundary
- Status: `approved`
- Decision:
  - Resident individual taxpayers with salary income only in Phase 1.
- Rationale:
  - Keeps legal domain constrained and testable.
  - Reduces accidental scope creep in parser and engine modules.

### D2. Canonical Rule Authority and Release Governance
- Status: `approved`
- Decision:
  - Hybrid model:
    - Canonical legal sources (Income Tax Department/CBDT publications) are mandatory references.
    - Executable tax-rule artifacts are version-locked and cryptographically signed at release.
- Rationale:
  - Enables auditability, deterministic builds, and controlled updates.

### D3. Legal Semantics Matrix (computation precedence and rounding)
- Status: `proposed`
- Decision needed:
  - Freeze an AY-specific semantics matrix covering:
    - rebate precedence
    - surcharge and marginal relief ordering
    - deduction applicability boundaries
    - rounding policy (step-level vs final-level)
    - negative/edge input handling
- Recommended default:
  - Implement explicit step-level deterministic rounding policy with documented order of operations per AY rule artifact.
- Why critical:
  - Without this, same input can yield divergent outputs.

### D4. Parser Contract Model
- Status: `proposed`
- Decision needed:
  - Use asynchronous job workflow for parsing:
    - `QUEUED`, `RUNNING`, `NEEDS_REVIEW`, `COMPLETED`, `FAILED`
    - idempotency key for upload and parse trigger
    - retry policy with capped exponential backoff
- Recommended default:
  - Async-only parser orchestration with explicit status polling endpoint.
- Why critical:
  - OCR/PDF pipelines are non-deterministic in runtime and reliability.

### D5. Persistence Model for Parsed Data
- Status: `proposed`
- Decision needed:
  - Replace generic key-value `parsed_fields` as primary model with typed domain entities plus raw evidence references.
- Recommended default:
  - Persist:
    - immutable source artifact metadata
    - typed normalized extracted fields
    - confidence and extraction provenance per field
- Why critical:
  - Reduces stringly-typed logic and migration pain.

### D6. PII Retention and Deletion Policy
- Status: `proposed`
- Decision needed:
  - Default retention TTL for uploaded docs and parsed content.
  - Deletion SLA and legal hold exceptions.
  - Backup retention and encryption key rotation policy.
- Recommended default:
  - Short default TTL for raw documents, longer retention for minimized derived outputs, explicit hard-delete workflow.
- Why critical:
  - “Privacy first” must be enforceable and testable.

### D7. API Versioning and Compatibility
- Status: `proposed`
- Decision needed:
  - Define API versioning strategy (`v1` lifecycle, deprecation window, compatibility guarantees).
- Recommended default:
  - Semantic API versioning with backward-compatible additive changes inside major line.

### D8. Rule Artifact Schema and Migration Policy
- Status: `proposed`
- Decision needed:
  - Define JSON schema for rule artifacts, validation pipeline, and forward/backward compatibility policy.
- Recommended default:
  - Strict schema version header + migration scripts + signature verification in CI.

### D9. Error Taxonomy and Observability
- Status: `proposed`
- Decision needed:
  - Standard domain error categories (validation, rule mismatch, parser uncertainty, export mapping failure).
- Recommended default:
  - Stable machine-readable error codes and trace IDs on all API responses.

### D10. Human Review Workflow for Low-Confidence Fields
- Status: `proposed`
- Decision needed:
  - Confidence thresholds and UX handling for manual confirmation.
- Recommended default:
  - Hard threshold for auto-accept and explicit `NEEDS_REVIEW` state for anything below threshold.

## Decision Gate for Implementation Start
Implementation should begin only when all `proposed` items are converted to `approved` or explicitly `rejected` with rationale recorded.
