---
mode: ask
tools: ['codebase']
---

Find and fix all weakly typed service API calls.

Checklist:

1. Search src/services for:

- ApiResponse<unknown>
- ApiPaginatedResponse<unknown>
- untyped fetcher.delete(...)

2. Replace with concrete DTO response types from schema/type files.

3. Keep service return models unchanged.

4. Do not change business behavior, only typing and safe mapping.

5. Report exactly which files were updated.
