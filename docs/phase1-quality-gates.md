# OpenTax Phase-1 SDLC Quality Gates and Approval Workflow

## Objective
Guarantee correctness, maintainability, and auditability for a legal-computation platform before first feature implementation.

## Mandatory Quality Gates (All Required)

### Gate 1: Design and Decision Completeness
- Required:
  - No unresolved blocker in `phase1-design-audit.md`
  - All `proposed` decisions in `phase1-decision-register.md` resolved to `approved` or `rejected` with rationale
- Block condition:
  - Any open blocker or ambiguous legal semantic rule

### Gate 2: Static Quality and Architecture Conformance
- Required checks on every PR:
  - formatting + linting
  - type checking
  - layer-boundary import rules (domain cannot depend on adapters/framework)
  - banned dependency checks (no DB/network in domain package)
- Block condition:
  - Any violation in import boundaries or type checks

### Gate 3: Determinism and Rule Integrity
- Required:
  - Rule artifacts validate against schema
  - Rule artifacts are cryptographically signed for release
  - Reproducible compute tests: same input + same rule version => same output
- Block condition:
  - Unsigned or schema-invalid rule artifacts
  - Nondeterministic output for golden fixtures

### Gate 4: Test Pyramid with Legal Domain Focus
- Required minimums:
  - Unit tests for tax primitives and transformations
  - Property-based tests for invariants (monotonicity boundaries, non-negative output constraints, etc.)
  - Golden snapshot tests for AY-specific canonical examples
  - Contract tests for API and adapter boundaries
  - Integration tests for parser job lifecycle and export flow
- Block condition:
  - Missing tests for changed behavior
  - Golden fixtures updated without legal-source citation

### Gate 5: Security and Privacy Enforcement
- Required:
  - PII redaction policy tests (logs and error payloads)
  - retention TTL enforcement tests
  - encryption-at-rest/in-transit configuration checks
  - dependency vulnerability scan threshold enforcement
- Block condition:
  - Exposure of PAN-like fields in logs
  - retention controls absent or disabled

### Gate 6: Operational Readiness
- Required:
  - health checks for API/worker dependencies
  - structured error taxonomy with trace IDs
  - migration rollback strategy documented for schema changes
- Block condition:
  - No rollback procedure for schema-affecting change

## Pull Request Approval Workflow

### Step 1: Author Self-Check (Mandatory)
- Confirm scope and non-goals.
- Attach design decision references (decision register IDs).
- For rule changes, include legal source links and interpretation notes.

### Step 2: Automated CI Gates
- Run all mandatory checks from Gates 2-6.
- CI must be green before human review.

### Step 3: Human Review (Two-Layer)
- Reviewer A (domain/legal correctness focus):
  - validates semantics and rule evidence
- Reviewer B (architecture/maintainability focus):
  - validates layering, coupling, and long-term code health

### Step 4: Merge Conditions
- At least 2 approvals (domain + architecture).
- No unresolved review threads.
- No skipped gates.

## Rule-Change Specific Policy
- Every rule change PR must include:
  - legal source citation
  - AY/version impact statement
  - before/after output diff for canonical fixtures
  - explicit backward compatibility note
- Rule change without evidence is automatically blocked.

## Minimum Definition of Done for Any Feature
- Behavior documented in domain terms.
- Tests cover happy path, edge cases, and failure modes.
- Observability and error contracts updated.
- Security/PII checks validated.
- Architecture boundaries remain intact.

## Governance Cadence
- Weekly quality review of:
  - flaky tests
  - rule-coverage gaps
  - architecture drift signals
- Monthly audit:
  - decision register freshness
  - retention and deletion policy enforcement
