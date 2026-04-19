---
mode: ask
tools: ['codebase']
---

Review the current changes with a bug-first mindset.

Requirements:

1. Prioritize findings over summary.
2. List issues by severity:

- High: correctness, security, data loss, runtime crash
- Medium: behavior regressions, missing validations, type safety gaps
- Low: maintainability and consistency

3. Include exact file paths and clear fix suggestions.
4. Verify service typing rules:

- No ApiResponse<unknown>
- No ApiPaginatedResponse<unknown>
- Delete calls are explicitly typed where needed

5. If no issues are found, explicitly state that and list residual risks.
