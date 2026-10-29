# Contributing

Thanks for improving the test suite. This page covers the workflow and the review checklist. If you are new, start with [Getting started](docs/getting-started.md).

## Workflow

1. Make your change in small steps. While iterating, run only what you touched:
   ```bash
   npx playwright test <spec path> --project=e2e-chromium   # or --project=api
   ```
2. Before opening a pull request, run both:
   ```bash
   npm run verify   # types, lint, formatting, docs links
   npm test         # full suite, both browsers + API
   ```
3. Re-run new or changed tests a few times to prove they are stable: `npx playwright test <spec> --repeat-each=3`.
4. Update documentation and the [changelog](CHANGELOG.md) in the same pull request (see below).

## Review checklist

A pull request is ready when every applicable item holds.

**Tests**

- [ ] Specs import `test`, `expect` and `TAG` from `@fixtures/index`.
- [ ] Every test has `@smoke` or `@regression`; tests that create, change or delete data also have `@destructive`.
- [ ] No UI login in specs — personas come from `test.use({ role })`.
- [ ] Preconditions not under test are seeded through fixtures (`seedCart`, `createBooking`), not clicked through.
- [ ] Everything a test creates has cleanup registered immediately after creation.
- [ ] Assertions are web-first (`toHaveText`, `toHaveCount`, `toBeVisible`, `toHaveURL`), not comparisons of values read earlier.
- [ ] Expected values come from `@utils/catalog` or the data factory, not hard-coded strings.
- [ ] Test titles describe behaviour (`rejects locked-out user`), not implementation.

**Page objects and API clients**

- [ ] No `expect` (lint enforces this).
- [ ] Locators prefer role, label/placeholder and text over test IDs; CSS/XPath only for structural hops.
- [ ] New pages define `path` and `readyLocator`; new components build locators from `root`.
- [ ] New endpoints have a schema plus a raw `xxxResponse()` and a typed `xxx()` method.

**Configuration**

- [ ] New settings are typed, defaulted and validated (see [how to add a setting](docs/how-to.md#add-a-configuration-setting)).
- [ ] No secrets in profiles, code or committed files; new variables are listed in `.env.example`.

**Never**

- `waitForTimeout`, `force: true`, `networkidle`, or raising a timeout to make a test pass — find the condition to wait for instead.
- `test.only` or `page.pause()` left in committed code.

## Documentation

Docs live next to the code and change with it:

| You changed…                                                       | Update                                                                                 |
| ------------------------------------------------------------------ | -------------------------------------------------------------------------------------- |
| A framework fixture, script, tag, variable, setting or CI workflow | [docs/reference.md](docs/reference.md)                                                 |
| The application: URLs, personas, app fixtures, quirks              | [docs/app.md](docs/app.md) and `.claude/rules/app.md`                                  |
| A procedure (how to add or do something)                           | [docs/how-to.md](docs/how-to.md)                                                       |
| Architecture or a cross-cutting mechanism                          | [docs/framework-guide.md](docs/framework-guide.md) and a new [ADR](docs/adr/README.md) |
| Anything user-visible                                              | [CHANGELOG.md](CHANGELOG.md) under _Unreleased_                                        |
| A rule Claude Code should follow                                   | [CLAUDE.md](CLAUDE.md) or `.claude/rules/`                                             |

`npm run docs:check` (part of `verify`) fails on broken relative links or anchors. CI runs `verify` and the full suite on every pull request; see [continuous integration](docs/reference.md#continuous-integration).

## Changing the seed itself

In the seed repository, also keep the "start your own project" path working:

- New framework code goes in framework-owned files ([list](docs/framework-guide.md#framework-and-application-code)); demo code gets the `// Demo app` marker and, if it is a new file, an entry in `DEMO_PATHS` in `scripts/init-project.mjs`.
- If a change affects what a fresh project needs, update `templates/skeleton/` too.
- The `Seed init` workflow must stay green: it runs `init:project` and tests the skeleton.

## Commit messages

Use [Conventional Commits](https://www.conventionalcommits.org): `type(scope): summary`, e.g. `test(cart): cover removing the last item`, `fix(pages): menu entries are buttons`. Common types: `test`, `feat` (framework capability), `fix`, `docs`, `refactor`, `chore`.
