---
mode: ask
tools: ['codebase', 'terminal']
---

Create a new feature using the same architecture as this repository.

Requirements:

1. Add schemas under src/schemas/<feature>/:

- <feature>.schema.ts
- <feature>.types.ts
- <feature>.mapper.ts
- index.ts

2. Add service under src/services/<feature>.service.ts.

3. Use strict typing:

- No ApiResponse<unknown>
- No ApiPaginatedResponse<unknown>
- Use concrete DTO types in fetcher generics
- Use fetcher.delete<void>(...) where appropriate

4. Mapper flow must be:
   UI input -> UI schema parse -> payload transform -> API call -> response schema parse -> UI model

5. Export service from src/services/index.ts if needed.

6. Run:

- npm run lint
- npm run build

7. Fix all errors introduced by your changes.
