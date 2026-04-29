# Project Parity Contract

Use this contract when cloning patterns from this repository into another project. The goal is behavior parity, architecture parity, and quality gate parity.

## Scope

This contract defines the minimum baseline another project must follow to behave like this starter.

## Required Files To Copy

Copy these files and folders from this repository into the target repository:

1. `AGENTS.md`
2. `CLAUDE.md`
3. `.github/copilot-instructions.md`
4. `.github/prompts/`
5. `.github/workflows/ci.yml`
6. `.github/workflows/copilot-guardrails.yml`
7. `.github/pull_request_template.md`
8. `.github/ISSUE_TEMPLATE/copilot-task.yml`
9. `docs/copilot-agent-template.md`

## Runtime And Toolchain Baseline

Keep these versions aligned unless there is an explicit migration plan:

1. Next.js 16.x
2. React 19.x
3. TypeScript 5.x
4. ESLint 9.x
5. Tailwind CSS 4.x
6. Zod 4.x

Use the same script contract:

1. `npm run dev`
2. `npm run build`
3. `npm run start`
4. `npm run lint`
5. `npm run format`

## Architecture Contract

Each CRUD feature must follow this flow:

`UI Input -> UI Schema Parse -> Payload Mapper -> API Call -> Response Schema Parse -> UI Model`

Mandatory rules:

1. Keep schemas in `src/domain/<feature>/<feature>.schema.ts`.
2. Keep transformation logic in mapper files.
3. Keep HTTP calls in `src/domain/<feature>/<feature>.service.ts`.
4. Do not move mapping logic into pages or route components.

## Service Typing Contract

In `src/domain/**/*.service.ts`, these are forbidden:

1. `ApiResponse<unknown>`
2. `ApiPaginatedResponse<unknown>`

These are required:

1. Concrete DTO response types for all fetcher calls.
2. Explicit delete typing, for example `fetcher.delete<void>(...)`.

## Next.js Safety Contract

1. This baseline assumes Next.js 16 behavior.
2. Before changing framework behavior, review docs in `node_modules/next/dist/docs/`.
3. Preserve App Router conventions and current folder shape.
4. Keep locale flow compatible with the current proxy-based approach.

## Infrastructure And Security Contract

1. Keep security headers in `next.config.ts`.
2. Keep standalone build output enabled for container runtime.
3. Keep CI gates for lint and build.
4. Keep guardrail workflow that blocks weak service generics.

## Environment Contract

Target project must document and support these variables:

1. `LOG_LEVEL`
2. `NEXT_PUBLIC_LOG_LEVEL`
3. `NEXT_PUBLIC_LOG_TO_FILE`
4. `NEXT_PUBLIC_API_URL`
5. `NEXT_PUBLIC_API_TIMEOUT`

## Quality Gate Contract

The following commands must pass before merge:

```bash
npm ci
npm run lint
npm run build
```

Optional when available:

```bash
npm run typecheck
```

## PR Acceptance Checklist

A pull request is parity-compliant only when all conditions are true:

1. DTO + mapper flow is implemented for the affected feature.
2. Schemas are in `src/domain/<feature>/<feature>.schema.ts`.
3. HTTP logic is in `src/domain/<feature>/<feature>.service.ts`.
4. No weak unknown service response generics exist.
5. Delete calls are explicitly typed.
6. Lint passes.
7. Build passes.

## Drift Detection

Run parity review when any of these change:

1. Next.js, React, TypeScript, ESLint, Tailwind, or Zod major/minor versions.
2. CI workflow steps.
3. Copilot rule files (`AGENTS.md`, `.github/copilot-instructions.md`).
4. Shared HTTP and response contracts in `src/lib/`.

## Bootstrap Procedure For Another Repository

1. Initialize a Next.js App Router project.
2. Copy all required files from this repository.
3. Align dependency and script baselines.
4. Scaffold one feature end-to-end with schema, mapper, service, and UI usage.
5. Run lint and build until green.
6. Enable CI and guardrail workflows.
7. Open a PR using the project template and verify all checklist items.

## Verification Commands

Use these scans in the target repository:

```bash
rg -n "ApiResponse<unknown>|ApiPaginatedResponse<unknown>" src/domain --glob "**/*.service.ts"
```

Expected result: no matches.

```bash
npm run lint && npm run build
```

Expected result: both commands pass.
