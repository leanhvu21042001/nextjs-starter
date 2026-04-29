## Summary

Describe what this PR changes.

## Architecture Checklist

- [ ] Follows DTO + mapper flow for CRUD features
- [ ] Keeps schemas in src/domain/<feature>/<feature>.schema.ts
- [ ] Keeps mapping logic in mapper files (not page components)
- [ ] Keeps HTTP calls in src/domain/<feature>/<feature>.service.ts

## Service Typing Checklist

- [ ] No ApiResponse<unknown>
- [ ] No ApiPaginatedResponse<unknown>
- [ ] Delete calls are explicitly typed (for example fetcher.delete<void>(...))

## Validation

- [ ] npm run lint passes
- [ ] npm run build passes

## Notes For Reviewers

Call out any risky areas, assumptions, or follow-up tasks.
