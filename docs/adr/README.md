# Architecture decision records

An ADR captures one significant design decision: the situation, what was decided, and what it costs. Records are never edited after acceptance except to change their status; a decision that is reversed gets a new ADR that supersedes the old one.

| ADR                                                   | Decision                                                       | Status   |
| ----------------------------------------------------- | -------------------------------------------------------------- | -------- |
| [0001](0001-authenticate-via-saved-sessions.md)       | Authenticate via saved sessions, one login per persona per run | Accepted |
| [0002](0002-validated-layered-configuration.md)       | Layered configuration validated with Zod at startup            | Accepted |
| [0003](0003-page-objects-and-clients-never-assert.md) | Page objects and API clients never assert (lint-enforced)      | Accepted |
| [0004](0004-two-layer-api-clients.md)                 | Two methods per API endpoint: raw and contract-validated       | Accepted |
| [0005](0005-seed-state-and-clean-up.md)               | Seed test state without the UI; LIFO cleanup registry          | Accepted |
| [0006](0006-public-demo-applications-as-targets.md)   | Public demo applications as test targets                       | Accepted |
| [0007](0007-separate-framework-from-application.md)   | Separate framework from application code; one-command init     | Accepted |

## Writing a new ADR

Add one when a change alters how tests are structured, how state or configuration flows, or which conventions are enforced. Copy the template below to `NNNN-short-title.md` (next free number) and add it to the table.

```markdown
# NNNN. Title in the imperative

- Status: Proposed | Accepted | Superseded by [NNNN](NNNN-title.md)
- Date: YYYY-MM-DD

## Context

What forces are at play? What problem needs a decision?

## Decision

What we will do, stated plainly.

## Consequences

What becomes easier, what becomes harder, and what we must now keep doing.
```
