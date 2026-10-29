# The application under test

Everything specific to the application this suite tests lives on this page; the rest of the documentation describes the framework. Keep it current — it is the first page a new team member needs. A short version for Claude Code lives in `.claude/rules/app.md`.

> **TODO:** fill in every section, then delete this note. Until then the suite tests the local sandbox app in `sandbox/`.

## Targets

| Part | URL (`qa`) | URL (`staging`) | URL (`prod`) | Tested by    |
| ---- | ---------- | --------------- | ------------ | ------------ |
| UI   | TODO       | TODO            | TODO         | `tests/e2e/` |
| API  | TODO       | TODO            | TODO         | `tests/api/` |

Configured in `config/default.ts` and `config/<env>.ts`.

## Personas

Defined in `config/personas.ts`; usernames in `config/default.ts`.

| `role` | Username | Saved session | Notes |
| ------ | -------- | ------------- | ----- |
| `user` | TODO     | TODO          | TODO  |

## App-specific fixtures and data

Defined in `src/fixtures/app.fixtures.ts`:

| Fixture        | Purpose                                         |
| -------------- | ----------------------------------------------- |
| `authenticate` | TODO: how a persona signs in and where it lands |
| `homePage`     | Example page object (sandbox) — replace         |
| `healthApi`    | Example API client (sandbox) — replace          |

Test data: TODO (builders in `src/utils/builders.ts`, fixed expected values, seeded records).

## Known quirks

TODO: behaviours of the application that tests assert as they are (unusual status codes, eventual consistency, rate limits, …).
