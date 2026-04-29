# GitHub Copilot Agent Template

Use this guide to copy the working conventions from this starter into another project so Copilot can generate code with the same structure and build reliability.

## Goal

Set up a new repository so Copilot:

- Follows the same architecture used here
- Writes typed service and DTO code (no unknown in API responses)
- Preserves project conventions and quality checks
- Produces code that can build and run with minimal rework

## Files To Copy

Copy these files from this repo into your new repository root:

1. AGENTS.md
2. CLAUDE.md
3. .github/copilot-instructions.md
4. .github/prompts/scaffold-feature.prompt.md
5. .github/prompts/fix-service-types.prompt.md
6. .github/prompts/review-pr.prompt.md
7. .github/pull_request_template.md
8. .github/ISSUE_TEMPLATE/copilot-task.yml
9. .github/workflows/ci.yml
10. .github/workflows/copilot-guardrails.yml

Optional but recommended:

1. docs/copilot-agent-template.md (this file)

## Minimal Agent Files

If you cannot copy the existing files directly, create these files.

### AGENTS.md

```md
# Project Agent Rules

## Core Rules

- Keep all service API calls strongly typed.
- Do not use ApiResponse<unknown> or ApiPaginatedResponse<unknown>.
- Use DTO + mapper flow:
  UI Input -> UI Schema Parse -> Payload Mapper -> API Call -> Response Schema Parse -> UI Model
- Reuse shared fetcher in src/lib/fetcher.ts for all HTTP calls.
- Validate payload and response with zod schemas.
- Keep UI model mapping in mapper files, not in page components.

## Next.js Version Safety

This project may use a newer Next.js version with breaking changes.
Before implementing framework-specific logic, read the corresponding docs in node_modules/next/dist/docs when available.
```

### CLAUDE.md

```md
@AGENTS.md
```

## Architecture Contract Copilot Must Follow

Use this structure in all features:

1. Feature layer in src/domain/<feature>/
2. UI pages/components in src/app/ and src/components/
3. Shared utilities in src/lib/

For each feature:

1. Define UI schema
2. Define create/update/delete payload schemas
3. Define API response schema
4. Export DTO and model types
5. Implement mapper with create, update, delete, fromResponse, fromList
6. Implement typed service methods using fetcher

## Service Typing Rules

Always use concrete DTO types in service calls.

Correct examples:

```ts
const data = await fetcher.get<ApiResponse<CategoryResponseDto>>(`/categories/${id}`)
const list = await fetcher.get<ApiPaginatedResponse<CategoryResponseDto>>('/categories')
await fetcher.delete<void>(`/categories/${id}`)
```

Avoid:

```ts
ApiResponse<unknown>
ApiPaginatedResponse<unknown>
```

## Build and Validation Commands

Copilot should run these before finishing implementation tasks:

```bash
npm run lint
npm run build
```

If your repo supports typecheck separately, also run:

```bash
npm run typecheck
```

## New Project Bootstrap Checklist

1. Create Next.js app and install dependencies.
2. Copy AGENTS.md and CLAUDE.md into the root.
3. Add src/lib/fetcher.ts, src/lib/create-mapper.ts, and src/lib/api-response.ts patterns.
4. Add feature folders under src/domain.
5. Implement at least one feature end-to-end using DTO + mapper + typed service.
6. Verify lint and build pass.
7. Add README section linking to agent docs.

## Recommended Prompt For New Repo

Use this when starting in a new repository:

```text
Use AGENTS.md as strict implementation rules.
Build features using DTO + mapper + typed service architecture.
Do not use unknown for API response generics.
Before finishing, run lint and build and fix any errors introduced by your changes.
```

## Copy Procedure For Another Project

1. Copy AGENTS.md and CLAUDE.md into the new project root.
2. Copy .github/copilot-instructions.md into the new project .github directory.
3. Copy .github/prompts/\*.prompt.md files into the new project.
4. Copy .github/pull_request_template.md and .github/ISSUE_TEMPLATE/copilot-task.yml.
5. Copy .github/workflows/ci.yml and .github/workflows/copilot-guardrails.yml into the new project.
6. Copy this template doc into docs/copilot-agent-template.md.
7. Update README with a "GitHub Copilot Agent Template" section and a link to this doc.
8. Ask Copilot to scaffold one feature (schema, mapper, service, page).
9. Confirm generated service code uses concrete response DTO types.
10. Run lint and build.

## Acceptance Criteria

Your new project is aligned if all are true:

- No ApiResponse<unknown> or ApiPaginatedResponse<unknown> in src/domain/**/*.service.ts
- Each feature has schema, mapper, DTO types, and service
- API response parsing happens through mapper/schema flow
- npm run lint passes
- npm run build passes
