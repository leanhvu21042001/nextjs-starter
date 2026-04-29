# GitHub Copilot Repository Instructions

Apply these instructions for all code suggestions and edits in this repository.

## Framework Safety

- This repository uses Next.js 16 with breaking changes.
- Before changing Next.js behavior, check docs in node_modules/next/dist/docs.
- Preserve App Router conventions and existing file structure.

## Architecture Rules

- Use DTO + mapper flow for CRUD features.
- Keep zod schemas in src/domain/<feature>/<feature>.schema.ts.
- Keep transformations in mapper files.
- Keep HTTP calls in src/domain/<feature>/<feature>.service.ts.
- Do not move mapping logic into page components.

## Service Typing Rules

- Always use concrete DTO types in response generics.
- Never use ApiResponse<unknown> or ApiPaginatedResponse<unknown>.
- Use explicit delete typing: fetcher.delete<void>(...).

## Quality Gate

Before finishing a task, run and pass:

1. npm run lint
2. npm run build

Fix any issues introduced by your changes.

## Editing Behavior

- Preserve existing style and public APIs unless task requires change.
- Keep changes minimal and scoped.
- Do not alter unrelated files.
- Prefer updating existing patterns over inventing new ones.
