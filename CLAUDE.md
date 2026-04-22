# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development
npm run dev              # Start dev server on http://localhost:3000
npm run lint             # ESLint check

# Build — IMPORTANT: npm run build fails on OneDrive paths (spaces in path break shebang)
node node_modules/next/dist/bin/next build   # Use this instead of npm run build

# Tests
npm run test             # Vitest watch mode
npm run test:run         # Vitest single run (CI)

# Database
docker compose up -d db  # Start PostgreSQL on port 5433 (DB only)
npm run db:migrate       # Apply Prisma migrations
npm run db:seed          # Seed categories + admin user
npm run db:reset         # Drop and re-apply migrations + seed
```

Required `.env` variables: `DATABASE_URL`, `NEXTAUTH_SECRET`, `NEXTAUTH_URL`.

## Architecture

### Page rendering model

All pages under `src/app/(main)/` and `src/app/(auth)/` are Server Components by default. Prisma queries run directly in page files — no API layer between pages and DB. Every page with DB queries requires `export const dynamic = 'force-dynamic'` (Next.js would otherwise try to statically prerender and fail without `DATABASE_URL` at build time).

Client components (`'use client'`) are used only when interactivity is needed (forms, transitions, search params). They live in `src/components/` and receive serialized data from parent Server Components via props.

### Mutation patterns (two co-existing patterns)

- **Server Actions** (`src/actions/`) — used for request state transitions and admin moderation. Called from client components via `useTransition`. Each action calls `revalidatePath` internally.
- **API route handlers** (`src/app/api/`) — used for services, reviews, reports, auth, and avatar upload. Standard `fetch` from client components.

### Authentication

NextAuth v5 (beta) with JWT strategy. Session is extended in `src/types/next-auth.d.ts` to include `user.id: string` and `user.role: Role`.

`src/auth.ts` dynamically imports Prisma (`const { default: prisma } = await import('@/lib/prisma')`) — required because `src/middleware.ts` runs on the Edge runtime which cannot use Prisma directly.

Role checks in Server Actions use `session.user.role` directly (no type casts needed — types are declared).

### Validation

Zod schemas in `src/lib/validations/` are the single source of truth shared between API routes, Server Actions, and client-side forms. Do not define inline schemas in route handlers — import from `validations/`.

### Category icons

`Category.icon` stores the lucide-react component name as a string (e.g. `"Laptop"`, `"Palette"`). Components that render category icons maintain a static `Record<string, LucideIcon>` map with `Package` as fallback for unknown names.

### Testing

Unit tests live in `tests/unit/`. Vitest is configured with jsdom environment, globals, and the `@` path alias. Tests import schemas and utilities directly — no DB or Next.js runtime involved.

`tests/auth.test.ts` at the root is a stub (`describe.todo`) — actual tests are in `tests/unit/auth.test.ts`.


## Obsidian Vault
- Architecture: /Users/diogo.pereira/Documents/Projetos/obsidian-vault/Learning/Piaget/2 semestre/EDSI/skoolbay/Architecture.md
- Changelog: /Users/diogo.pereira/Documents/Projetos/obsidian-vault/Learning/Piaget/2 semestre/EDSI/skoolbay//Changelog.md
- Sessions: /Users/diogo.pereira/Documents/Projetos/obsidian-vault/Learning/Piaget/2 semestre/EDSI/skoolbay//Sessions.md

## Session Template
No final de cada sessão, escreve um resumo em Sessions.md com este formato:

### YYYY-MM-DD — [título curto]
**O que foi feito:** ...
**Decisões tomadas:** ...
**Próximos passos:** ...
**ADRs a registar:** (se aplicável, adiciona também em Architecture.md)