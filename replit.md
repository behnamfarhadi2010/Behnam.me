# Workspace

## Overview

pnpm workspace monorepo using TypeScript. Each package manages its own dependencies.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.

## Personal Site (artifact: `personal-site`)

A taniarascia.com–inspired personal website with public Blog, Notes, Projects, and About sections plus a Clerk-gated admin dashboard for CRUD on all content.

- **Frontend**: React + Vite at `artifacts/personal-site` (preview path `/`)
- **Auth**: Clerk (`@clerk/react`) themed with `@clerk/themes` shadcn baseTheme + warm cream/pink overrides
- **Routing**: wouter with nested `/dashboard` routes gated by `RequireAuth`
- **Backend**: Express routes in `artifacts/api-server/src/routes/{posts,notes,projects,about,dashboard}.ts`; admin POST/PUT/DELETE protected by `requireAuth` middleware (Clerk session)
- **DB schemas**: `lib/db/src/schema/{posts,notes,projects,about}.ts`
- **API contract**: `lib/api-spec/openapi.yaml` → generates hooks in `@workspace/api-client-react`
- **Seed data**: `pnpm --filter @workspace/scripts run seed` populates About row and sample posts/notes/projects

### Theme

Warm cream/beige background (`hsl(40 33% 97%)`), pink/red primary (`hsl(348 70% 60%)`), indigo accent for links (`hsl(230 60% 55%)`), serif headings (Georgia), Inter sans body. Dark mode variables defined.
