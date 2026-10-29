# 0002. Layered configuration validated with Zod at startup

- Status: Accepted
- Date: 2026-10-29

## Context

The suite must run against `qa`, `staging` and `prod`, which differ in timeouts, retries, parallelism and whether data may be modified. Secrets must not live in the repository. Reading `process.env` ad hoc across the codebase leads to untyped strings, scattered defaults, and failures that surface mid-test (`undefined` passwords, malformed URLs) far from their cause.

## Decision

- Non-secret settings live in typed **profiles**: `config/default.ts` (complete) plus `config/<env>.ts` (differences only, as `DeepPartial`).
- Secrets and one-off overrides come from **environment variables**, optionally via git-ignored `.env` / `.env.<env>` files.
- `src/config/env.ts` merges these in a fixed precedence order (see the [reference](../reference.md#configuration-precedence)), validates the result against a **Zod schema**, and exports one frozen `env` object.
- All code reads configuration through `env`; nothing reads `process.env` directly.

## Consequences

- Misconfiguration fails the run immediately with a message naming the variable.
- Every setting has exactly one type, one default and one validation rule; profiles are type-checked.
- Adding a setting touches three places (type, default, schema). The how-to guide lists them.
- The loader runs in every Playwright worker process; it is pure and fast, so this is acceptable.
