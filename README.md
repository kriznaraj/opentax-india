# OpenTax India

OpenTax India is an open source, self-hostable monorepo for building an Indian tax computation and filing-assist platform.

This repository is currently a starter scaffold focused on:
- clear module boundaries
- OSS contributor readiness
- maintainable monorepo structure
- runnable web/api/worker baselines

## Repository Layout

```text
apps/
  web/
  api/
  worker/
packages/
  tax-engine/
  form16-parser/
  itr-json/
  shared-types/
docs/
```

## Tech Baseline
- Node.js 20+
- pnpm workspaces
- Turborepo task orchestration
- TypeScript strict mode
- ESLint + Prettier + Vitest
- Next.js (web), NestJS (api), Node worker

## Quick Start

```bash
pnpm install
pnpm dev
```

### Service Ports
- Web: `http://localhost:3000`
- API: `http://localhost:3001/health`

## Quality Commands

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

## Open Source Standards
- License: Apache-2.0
- Security policy: `SECURITY.md`
- Contribution guide: `CONTRIBUTING.md`
- Code of conduct: `CODE_OF_CONDUCT.md`
