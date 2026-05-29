# Contributing to OpenTax India

Thank you for contributing.

## Ground Rules
- Keep changes small and reviewable.
- Prefer maintainability over quick fixes.
- Preserve deterministic behavior for tax computation paths.
- Add or update tests for behavior changes.

## Development Workflow
1. Create a feature branch from `main`.
2. Make focused changes with clear commit messages.
3. Run local quality checks:
   - `pnpm lint`
   - `pnpm typecheck`
   - `pnpm test`
4. Open a pull request with:
   - problem statement
   - design rationale
   - test evidence

## Rule Change Requirements
Any change that modifies tax rules must include:
- legal source citation
- AY/version impact summary
- deterministic before/after fixture outputs

## Code Standards
- Follow SOLID and DRY principles.
- Avoid leaking infrastructure concerns into domain logic.
- Keep APIs explicit and backward-compatible where promised.

## Reporting Bugs
Open an issue with:
- observed behavior
- expected behavior
- reproduction steps
- runtime environment
