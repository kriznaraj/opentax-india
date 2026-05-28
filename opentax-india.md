# OpenTax India — Phase 1 Design Doc

## Goal

Build an OSS, self-hostable Indian tax platform with:

* Tax computation engine
* Regime comparison
* Form 16 parser
* ITR JSON generator

Phase 1 focuses on deterministic computation and modular architecture.

---

# Scope

## Included

### Tax Engine

* Old regime
* New regime
* Slab calculation
* Standard deduction
* 80C
* 80D
* HRA
* Professional tax
* Cess
* Basic surcharge

### Regime Optimizer

* Compare regimes
* Savings breakdown

### Form 16 Parser

Extract:

* Salary
* TDS
* Employer info
* PAN/TAN
* Deductions
* Assessment year

### JSON Export

Generate filing-compatible JSON.

### Minimal UI

* Upload PDF
* View parsed output
* Compare regimes
* Download JSON

---

## Excluded

* AIS/TIS
* Direct filing
* GST
* AI assistant
* Capital gains
* Authentication
* Multi-tenancy
* Payments

---

# Design Principles

## OSS First

* Modular
* Self-hostable
* Contributor-friendly

## Privacy First

* No mandatory cloud dependency
* Minimal data retention

## Deterministic Logic

* Versioned tax rules
* Pure computation
* Fully testable

## AI Ready

Architecture should support future AI augmentation.

---

# Architecture

```text
Frontend (Next.js)
        |
REST APIs
        |
Backend API (NestJS)
        |
+-------------------+
| Tax Engine        |
| Parser Service    |
| Export Service    |
+-------------------+
        |
Postgres + Object Storage
```

---

# Tech Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind
* shadcn/ui

## Backend

* NestJS
* TypeScript

## Storage

* PostgreSQL
* MinIO

## OCR

* pdfplumber
* Tesseract OCR

## Infra

* Docker Compose
* GitHub Actions

---

# Repository Structure

```text
opentax-india/

apps/
  web/
  api/
  worker/

packages/
  tax-engine/
  form16-parser/
  itr-json/
  shared-types/

infra/
docs/
```

---

# Core Modules

# 1. Tax Engine

## Responsibilities

* Tax slab computation
* Deduction application
* Regime comparison
* Surcharge + cess

## Requirements

* Deterministic
* Pure functions
* Config-driven rules

## Example Input

```json
{
  "assessmentYear": "2026-27",
  "salaryIncome": 1800000,
  "section80C": 150000,
  "section80D": 25000
}
```

## Example Output

```json
{
  "oldRegimeTax": 148200,
  "newRegimeTax": 171600,
  "recommendedRegime": "OLD"
}
```

## Rule Versioning

```text
tax-rules/
  AY_2025_26.json
  AY_2026_27.json
```

---

# 2. Form 16 Parser

## Responsibilities

* PDF ingestion
* Text extraction
* OCR fallback
* Field mapping
* Confidence scoring

## Parsing Pipeline

```text
PDF
 ↓
Text Extraction
 ↓
OCR Fallback
 ↓
Field Detection
 ↓
Normalization
 ↓
Validation
```

## Extracted Fields

* Gross salary
* TDS
* PAN
* TAN
* Employer details
* Deductions

## Confidence Example

```json
{
  "grossSalary": {
    "value": 1800000,
    "confidence": 0.96
  }
}
```

---

# 3. JSON Export Service

## Responsibilities

* Generate structured tax JSON
* Validate schemas
* Export downloadable file

## Internal Model

```json
{
  "taxpayer": {},
  "income": {},
  "deductions": {},
  "taxComputation": {}
}
```

## Design Rule

Never tightly couple internal schema with government schema.

Use adapters.

---

# API Design

## Upload Form16

```http
POST /api/v1/upload/form16
```

## Get Parsed Result

```http
GET /api/v1/documents/:id
```

## Compute Tax

```http
POST /api/v1/tax/compute
```

## Export JSON

```http
GET /api/v1/export/:id
```

---

# Database Design

## documents

```text
id
filename
status
created_at
```

## parsed_fields

```text
document_id
field_name
field_value
confidence
```

## tax_computations

```text
document_id
old_regime_tax
new_regime_tax
recommended_regime
```

---

# Security

## Requirements

* File validation
* PAN masking in logs
* HTTPS in production
* Encrypted storage support

## Constraints

Avoid long-term storage of sensitive documents by default.

---

# DevOps

## Local Setup

```bash
docker compose up
```

## CI

GitHub Actions:

* lint
* tests
* Docker build

---

# Testing Strategy

## Unit Tests

* slab calculations
* deductions
* edge cases

## Integration Tests

* parser flow
* export flow

## Snapshot Tests

Ensure deterministic tax outputs.

---

# OSS Contribution Model

## Standards

* Mandatory tests
* Modular PRs
* RFC for tax rule changes

## License

Apache 2.0

---

# Milestones

## M1

* Monorepo setup
* Docker setup
* CI/CD

## M2

* Tax engine
* Regime comparison

## M3

* Form16 parser

## M4

* JSON export

## M5

* Minimal UI

---

# Future Phases

## Phase 2

* AIS/TIS
* Capital gains
* Mutual funds

## Phase 3

* AI copilot
* Conversational assistant
* Tax recommendations

## Phase 4

* Plugin ecosystem
* Fintech integrations

---

# Key Success Criteria

* Correct tax computation
* Modular architecture
* Contributor friendliness
* Deterministic outputs
* Minimal operational complexity

