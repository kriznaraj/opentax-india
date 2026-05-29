# OpenTax Phase-1 Design Audit (Maximum Strictness)

## Scope
- Source reviewed: `opentax-india.md`
- Review lens: correctness, legal-risk exposure, SOLID, DRY, operability, testability, maintainability
- Confirmed boundary: resident individual, salary income only (Phase 1)

## Severity Legend
- **Blocker**: must be resolved before implementation starts
- **Major**: can start only if explicit guardrails are accepted
- **Improvement**: non-blocking but recommended

## Blockers

### B1. Tax computation semantics are underspecified
- Missing explicit rules for rebate handling, surcharge thresholds, marginal relief, rounding, and precedence when multiple adjustments apply.
- Why blocker:
  - Determinism is not enforceable.
  - Golden tests will not remain stable.
  - Contributors can produce legally divergent outputs from same input.
- SOLID/DRY impact:
  - Violates SRP by forcing domain logic and legal interpretation to leak into services/controllers.
  - Creates repeated ad-hoc interpretation across modules.

### B2. Legal source-of-truth process is not operationalized
- The design says versioned rules, but does not define canonical legal references, change workflow, approval roles, or rule artifact signing/verification.
- Why blocker:
  - No auditable chain from legal text to executable rule.
  - High risk of silent, incorrect rule mutation.
- Maintainability impact:
  - Future rule updates become tribal knowledge.

### B3. Parser pipeline is modeled as flow, not as fault-tolerant contract
- PDF/OCR extraction is naturally async and failure-prone, but API section implies simple request/response without job states, retry policy, idempotency keys, or partial-confidence handling.
- Why blocker:
  - Operational reliability cannot be guaranteed.
  - UI and backend contracts will drift.

### B4. PII/security policy is declarative, not enforceable
- “Privacy first” and “minimal retention” are stated without defaults for retention TTL, deletion SLAs, key management, audit logs, or redaction policy boundaries.
- Why blocker:
  - Compliance and privacy posture cannot be validated.
  - Incident response and data governance are undefined.

## Major Issues

### M1. Data model `parsed_fields` is too generic for long-term evolution
- Key-value row modeling hides schema meaning and encourages stringly-typed logic.
- Risk:
  - Weak integrity constraints.
  - Expensive migrations when fields evolve.
- SOLID/DRY impact:
  - Violates OCP by requiring broad rewrites for small schema changes.

### M2. Missing canonical domain model boundaries
- Tax engine, parser, and export responsibilities are listed, but no explicit dependency direction or port/adapter contracts are defined.
- Risk:
  - Framework and storage concerns may leak into core computation.

### M3. API surface lacks versioning and contract governance
- Endpoints are listed, but there is no explicit API version lifecycle, error taxonomy, or backward compatibility policy.
- Risk:
  - Breaking changes will be accidental.

### M4. Rule configuration contract not defined
- Rule files are named by AY, but no schema contract for inputs, validation rules, feature flags, or migration strategy is defined.

### M5. Testing strategy is incomplete for a legal-calculation domain
- Unit/integration/snapshot tests are listed, but property-based tests, mutation tests, and legal-scenario fixtures are not mandated.

## Improvements

### I1. Clarify precision policy
- Define money type, rounding stage (per-step vs final), and numeric precision to avoid floating-point ambiguity.

### I2. Formalize parser confidence semantics
- Confidence score exists, but no action thresholds are defined for auto-accept vs human-review workflows.

### I3. Expand observability contract
- Add trace IDs, domain event logs, and failure reason taxonomy for parser and export flows.

### I4. Add ADR/RFC templates early
- Require architecture decision records for tax-rule governance and breaking API changes.

## Section-by-Section Critique

### Goal and Scope
- Strongly focused for Phase 1.
- Suspicious gap: “deterministic computation” is promised before determinism mechanisms are defined.

### Design Principles
- Good intent.
- Suspicious gap: “AI ready” can introduce premature abstraction unless explicit “not in Phase 1” constraints are codified.

### Architecture and Repository Structure
- Good high-level module split.
- Suspicious gap: `worker` is listed but no worker responsibilities or queue model are specified.

### Core Modules
- Good responsibilities list.
- Suspicious gap: no canonical interfaces between modules; risk of hidden coupling.

### API Design
- Clean initial endpoint shape.
- Suspicious gap: parser upload flow should be job-based, not synchronous-only.

### Database Design
- Useful sketch.
- Suspicious gap: typed and auditable domain tables are missing; key-value storage can become a maintenance trap.

### Security
- Good intent.
- Suspicious gap: absence of concrete defaults makes policy non-testable.

### Testing and OSS Model
- Good direction.
- Suspicious gap: no explicit legal test corpus policy or rule-change evidence requirement.

## Immediate Recommendations (Before First Code Commit)
- Freeze a legal semantics glossary and precedence matrix.
- Define signed rule artifact lifecycle and release gates.
- Adopt async parser job contract with idempotency.
- Replace generic `parsed_fields` with typed domain entities plus raw evidence references.
- Define mandatory test gates for deterministic legal computation.
