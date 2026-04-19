<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.

<!-- END:nextjs-agent-rules -->

## GitHub Copilot Implementation Rules

Use these rules when building features in this repository and when copying this file to another project.

### Architecture

- Use DTO + mapper flow for all CRUD features.
- Keep validation in zod schemas under src/schemas/<feature>/.
- Keep transformations in mapper files, not page components.
- Keep HTTP calls in service files under src/services/.

### Service Typing

- Always use concrete DTO types in API response generics.
- Do not use ApiResponse<unknown> or ApiPaginatedResponse<unknown>.
- Use explicit delete return typing, for example fetcher.delete<void>(...).

### Quality Gate Before Completion

- Run npm run lint.
- Run npm run build.
- Fix any errors introduced by your changes.

### Migration Note For Other Projects

To replicate this setup in another repository, copy AGENTS.md, CLAUDE.md, .github/copilot-instructions.md, .github/prompts/, and .github/workflows/, then follow docs/copilot-agent-template.md.
