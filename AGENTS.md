# Repository Guidelines

See @README.md for the project overview and technology stack.

## Hard rules

- Never write to `context/archive/` — archived changes are immutable. If a resolved target path starts with `context/archive/`, abort and open a new change.
- Never overwrite `context/` contents — this directory is the source of truth for the bootstrap chain (PRD, tech stack, plans, frames).
- Environment secrets (`SUPABASE_URL`, `SUPABASE_KEY`) are server-only via Astro's `astro:env` schema; never expose them to the client.

## Project structure

- `src/pages/` — Astro pages and API routes (`src/pages/api/`).
- `src/components/` — UI components implemented with Astro (`.astro`) and React (`.tsx`).
- `src/layouts/` — Astro layouts.
- `src/lib/` — Shared utilities (`@/lib/supabase.ts`, `@/lib/utils.ts`).
- `src/middleware.ts` — Route protection; add paths to `PROTECTED_ROUTES` to require auth.
- `public/` — Static assets served as-is.
- `supabase/` — Local Supabase config and migrations.
- `context/` — Bootstrap chain artifacts (PRD, tech stack, verification logs).

## Build, test, and dev commands

See @README.md#prerequisites and @README.md#available-scripts for setup and available commands.

## Coding conventions

- TypeScript settings are in @tsconfig.json; lint rules are in @eslint.config.js; lint-staged commands are in @package.json.
- Use `clsx` + `tailwind-merge` (via `@/lib/utils.ts`) for conditional Tailwind classes.
- React components live in `src/components/auth/` and `src/components/ui/`; Astro components live at the `src/components/` root and in `src/components/ui/`.

## Testing

- No unit test framework is configured; see @README.md#smoke-test for the smoke-test workflow and prerequisites.

## CI

See @.github/workflows/ci.yml for CI jobs and @README.md#ci for their requirements.

## Commits and PRs

- Only one commit exists; commit convention is not yet established. Adopt Conventional Commits (e.g., `feat:`, `fix:`, `chore:`) for consistency.
