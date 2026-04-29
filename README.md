# Next.js Starter

Production-ready Next.js 16 starter with a typed DTO/Mapper pattern, reusable UI primitives, i18n routing, logging, and Docker deployment support.

## Stack

- Next.js 16 (App Router)
- React 19 + TypeScript
- Zod v4 for schema validation
- react-hook-form + zodResolver + react-hot-toast (via `src/lib/form-client.ts`)
- Tailwind CSS 4
- react-data-grid

## Table of Contents

- Quick Start
- Available Scripts
- Environment Variables
- Project Structure
- Logging
- Security Defaults
- Docker (Production)
- UI Conventions
- DTO + Mapper Architecture
- GitHub Copilot Agent Template
- Troubleshooting

## Quick Start

### Prerequisites

- Node.js 20+ (Node 22 recommended)
- npm 10+

### Install

```bash
npm ci
```

### Run development server

```bash
npm run dev
```

App runs at `http://localhost:3000`.

### Build for production

```bash
npm run build
npm run start
```

## Available Scripts

From [package.json](package.json):

- `npm run dev`: Start Next.js dev server
- `npm run build`: Production build
- `npm run start`: Run production server
- `npm run lint`: Run ESLint
- `npm run format`: Format project with Prettier

## Environment Variables

Use [.env.example](.env.example) as baseline.

Common variables used in this project:

- `LOG_LEVEL`: server log level (`debug`, `info`, `warn`, `error`)
- `NEXT_PUBLIC_LOG_LEVEL`: client log level (`debug`, `info`, `warn`, `error`)
- `NEXT_PUBLIC_LOG_TO_FILE`: set `false` to disable client-to-file log persistence
- `NEXT_PUBLIC_API_URL`: base URL for fetch client
- `NEXT_PUBLIC_API_TIMEOUT`: fetch timeout in ms

Defaults:

- `development` -> logger defaults to `debug`
- `production` -> logger defaults to `info`

## Project Structure

High-level structure:

```text
src/
  app/                  # App Router pages/layouts, including /api/log endpoint
  components/           # Reusable UI and feature components
  domain/               # Feature domain modules (schema/mapper/service/types)
  hooks/                # Reusable hooks
  lib/                  # Shared utilities (fetcher, logger, mapper factory)
```

Key files:

- [src/lib/logger.ts](src/lib/logger.ts)
- [src/lib/fetcher.ts](src/lib/fetcher.ts)
- [src/lib/create-mapper.ts](src/lib/create-mapper.ts)
- [src/proxy.ts](src/proxy.ts)
- [next.config.ts](next.config.ts)

## Logging

Logging is centralized in [src/lib/logger.ts](src/lib/logger.ts) and initialized by:

- [src/instrumentation.ts](src/instrumentation.ts) for server startup
- [src/instrumentation-client.ts](src/instrumentation-client.ts) for client startup/errors

### File logs

Client logs can be persisted into `log/*.log` through API route [src/app/api/log/route.ts](src/app/api/log/route.ts).

Generated files:

- `log/app-YYYY-MM-DD.log`
- `log/error-YYYY-MM-DD.log`

Disable file persistence with:

```env
NEXT_PUBLIC_LOG_TO_FILE=false
```

## Security Defaults

Security headers are set in [next.config.ts](next.config.ts), including:

- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy`
- `Permissions-Policy`
- `Cross-Origin-Opener-Policy`
- `Cross-Origin-Resource-Policy`
- baseline `Content-Security-Policy`
- `Strict-Transport-Security` in production

Locale/auth cookie writes also use safer attributes (sameSite/secure where applicable).

## Docker (Production)

All Docker assets are under [docker](docker).

### Build image

```bash
docker build -f docker/Dockerfile -t nextjs-starter:prod .
```

### Run container

```bash
docker run --name nextjs-starter -p 3000:3000 --env-file .env.local -v ${PWD}/log:/app/log nextjs-starter:prod
```

### Run with Compose

```bash
docker compose -f docker/docker-compose.yml up -d --build
```

Stop:

```bash
docker compose -f docker/docker-compose.yml down
```

Notes:

- Production image uses standalone output (`output: 'standalone'`)
- Runtime image runs as non-root
- `./log` is mounted to `/app/log` for persistent logs

## UI Conventions

UI exports are centralized in [src/components/ui/index.ts](src/components/ui/index.ts).

Use semantic wrappers from UI package rather than raw tags in app pages:

- `Main`, `Section`, `Article`, `Aside`, `Header`, `Nav`, `Footer`

Content wrappers:

- `Box` for block layout containers
- `Inline` for inline content
- `Heading`, `Paragraph` for typography

Form wrappers:

- `Form`, `FormProvider`, `FormField`, `FormItem`, `FormControl`, `FormLabel`, `FormDescription`, `FormMessage`

## DTO + Mapper Architecture

The app follows a strict flow:

```text
UI Input -> UI Schema Parse -> Payload Mapper -> API Call -> Response Schema Parse -> UI Model
```

### Why this pattern

- Single source of truth for validation
- Clear separation between UI DTO, API payload DTO, and UI model
- Strong typing with minimal duplication

### Typical layers

1. Feature schema (`src/domain/<feature>/<feature>.schema.ts`)
2. Feature types (`src/domain/<feature>/<feature>.types.ts`)
3. Feature mapper (`src/domain/<feature>/<feature>.mapper.ts`)
4. Feature service (`src/domain/<feature>/<feature>.service.ts`)
5. Feature exports (`src/domain/<feature>/index.ts`)

Example usage in services:

```ts
const payload = categoryMapper.create(uiData)
const data = await fetcher.post('/categories', payload)
return categoryMapper.fromResponse(data.data)
```

## GitHub Copilot Agent Template

Use this project as a repeatable template for new repositories.

- Copy agent docs: [AGENTS.md](AGENTS.md), [CLAUDE.md](CLAUDE.md)
- Copy .github setup: [.github/copilot-instructions.md](.github/copilot-instructions.md), [.github/prompts/scaffold-feature.prompt.md](.github/prompts/scaffold-feature.prompt.md), [.github/prompts/fix-service-types.prompt.md](.github/prompts/fix-service-types.prompt.md), [.github/workflows/ci.yml](.github/workflows/ci.yml)
- Additional .github config: [.github/prompts/review-pr.prompt.md](.github/prompts/review-pr.prompt.md), [.github/pull_request_template.md](.github/pull_request_template.md), [.github/ISSUE_TEMPLATE/copilot-task.yml](.github/ISSUE_TEMPLATE/copilot-task.yml), [.github/workflows/copilot-guardrails.yml](.github/workflows/copilot-guardrails.yml)
- Follow setup guide: [docs/copilot-agent-template.md](docs/copilot-agent-template.md)
- Enforce strict replication with: [docs/project-parity-contract.md](docs/project-parity-contract.md)

The template guide includes:

- Copy-paste files for agent instructions
- Required architecture conventions (DTO/mapper/service flow)
- Build and quality gates that Copilot should always run
- A project bootstrap checklist for new repos

## Troubleshooting

### Build passes locally but Docker fails

- Ensure you build from repo root:
  `docker build -f docker/Dockerfile -t nextjs-starter:prod .`
- Confirm `.env.local` contains required runtime variables.

### Logs not written to `log/*.log`

- Ensure app can call `POST /api/log`
- Ensure `NEXT_PUBLIC_LOG_TO_FILE` is not `false`
- Ensure `log` directory is writable in your environment/container

### Locale routing not as expected

- Check locale rewrite/header logic in [src/proxy.ts](src/proxy.ts)
- Verify locale cookie and `?lang=` query behavior
