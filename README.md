# 10x Astro Starter

![](./public/template.png)

A modern, opinionated starter template for building fast, accessible web applications.

## Tech Stack

- [Astro](https://astro.build/) v7 - Modern web framework with server-first rendering
- [React](https://react.dev/) v19 - UI library for interactive components
- [TypeScript](https://www.typescriptlang.org/) v6 - Type-safe JavaScript
- [Tailwind CSS](https://tailwindcss.com/) v4 - Utility-first CSS framework
- [Supabase](https://supabase.com/) - Authentication and backend-as-a-service
- [Cloudflare Workers](https://workers.cloudflare.com/) - Edge deployment runtime

## Prerequisites

- Node.js v22.14.0 (as specified in `.nvmrc`)
- npm (comes with Node.js)

## Getting Started

1. Clone the repository:

```bash
git clone https://github.com/przeprogramowani/10x-astro-starter.git
cd 10x-astro-starter
```

2. Install dependencies:

```bash
npm install
```

3. Set up Supabase and configure environment variables — see [Supabase Configuration](#supabase-configuration) below.

4. Create a `.dev.vars` file for local Cloudflare dev secrets:

```bash
cp .env.example .dev.vars
```

5. Run the development server:

```bash
npm run dev
```

## Available Scripts

- `npm run dev` - Start development server (Cloudflare workerd runtime)
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint with type-checked rules
- `npm run lint:fix` - Auto-fix ESLint issues
- `npm run format` - Run Prettier
- `npm run smoke` - Smoke test the auth flow against a running server (`BASE_URL`, defaults to `http://localhost:4321`)

## Project Structure

```md
.
├── src/
│ ├── layouts/ # Astro layouts
│ ├── pages/ # Astro pages
│ │ └── api/ # API endpoints
│ ├── components/ # UI components (Astro & React)
│ └── assets/ # Static assets
├── public/ # Public assets
├── wrangler.jsonc # Cloudflare Workers config
```

## Supabase Configuration

This project uses [Supabase](https://supabase.com/) for authentication. Environment variables are declared via Astro's `astro:env` schema and are treated as **server-only secrets** — they are never exposed to the client.

### First-time setup (local, no cloud project needed)

Requires [Docker](https://www.docker.com/) and ~7 GB RAM. The repository already contains `supabase/config.toml`; do not run `supabase init`.

1. Copy the example into local-only environment files:

```bash
cp .env.example .env
cp .env.example .dev.vars
```

2. Start the local stack (downloads Docker images on first run):

```bash
npx supabase start
```

3. Privately copy the local API URL and publishable/anon key printed by the CLI into both `.env` and `.dev.vars`. Use `http://127.0.0.1:54421` for `SUPABASE_URL`, the local publishable/anon key for `SUPABASE_KEY`, and `http://127.0.0.1:4321` for `APP_ORIGIN`. Never paste credential-bearing CLI output into chat or commit these files.

4. To stop the stack when done:

```bash
npx supabase stop
```

The local Studio UI is available at `http://127.0.0.1:54423`; the email inbox is at `http://127.0.0.1:54424`.

No database tables or migrations are required — this project uses Supabase Auth's built-in `auth.users` table only.

### Using a cloud Supabase project instead

If you use hosted Supabase, add these variables to your local `.env` and `.dev.vars` files. Deployment uses one hosted project shared by preview and production; never use a service-role key or database password in the app.

| Variable       | Description                                                |
| -------------- | ---------------------------------------------------------- |
| `SUPABASE_URL` | Project URL from Supabase dashboard → Settings → API       |
| `SUPABASE_KEY` | `anon` public key from Supabase dashboard → Settings → API |

```
SUPABASE_URL=https://<project-ref>.supabase.co
SUPABASE_KEY=<anon-key>
```

### Email confirmation in local development

Local Supabase defaults to email confirmation disabled so the baseline smoke test can sign in immediately. For a separate confirmation-flow test, temporarily enable `auth.email.enable_confirmations` in the local `supabase/config.toml`, set the local Site URL and redirect allowlist to `http://127.0.0.1:4321` and `http://127.0.0.1:4321/auth/confirm`, and use the token-hash confirmation template described below. Restart local Supabase, open the email in the local inbox, and verify that opening the link does not confirm the account until you press **Confirm email**. Restore the baseline local setting afterward. Never change hosted settings to run the smoke test, and never run the smoke test against hosted Supabase.

For the hosted project, set the production Site URL to `https://pethealth.parchawka.workers.dev`, allow only the production and preview `/auth/confirm` URLs, require email confirmation, and configure the signup email link as `{{ .RedirectTo }}?token_hash={{ .TokenHash }}`. Configure a verified SMTP sender and suitable rate limits in Supabase. These are owner-managed settings; review and record existing values before changing them.

### Auth routes

| Route                 | Description                                                             |
| --------------------- | ----------------------------------------------------------------------- |
| `/auth/signin`        | Email/password sign-in form                                             |
| `/auth/signup`        | Email/password sign-up form                                             |
| `/auth/confirm-email` | Post-signup "check your inbox" page                                     |
| `/auth/confirm`      | Confirmation page; a user click submits the one-time token for verification |
| `/dashboard`          | Example protected page (redirects to `/auth/signin` if unauthenticated) |

Route protection is handled in `src/middleware.ts`. Add paths to the `PROTECTED_ROUTES` array there to require authentication.

## Deployment

The intended production release path is Cloudflare Workers Builds after a protected PR updates `master`; the Builds connection is not yet enabled and requires final owner approval. GitHub Actions is disabled and is not used for deployment or checks. The production Worker is `pethealth` (`https://pethealth.parchawka.workers.dev`); preview is the separately named `pethealth-preview` Worker (`https://pethealth-preview.parchawka.workers.dev`). Both use the same hosted Supabase project and therefore share users and data.

### Owner setup and safeguards

- Create or use the intended Cloudflare account, verify its email, enable MFA, confirm you can administer Workers and Git connections, and review plan limits and possible charges. Confirm the account's `workers.dev` subdomain is `parchawka`; no custom application domain or DNS change is required.
- Use the exact Worker targets `pethealth` and `pethealth-preview`. Provision them only when the reviewed application revision is ready; do not replace an existing Worker or publish a placeholder without explicit approval. Treat the preview URL as public unless access protection is configured.
- Confirm GitHub repository admin access and permission to install/request the Cloudflare Workers & Pages app. Disable Actions at repository level before any planned push. Protect `master` so every change requires a PR, including administrators, with no bypass actors, force pushes, or deletion. Preserve stricter existing rules and resolve Actions-dependent required checks only with owner approval; do not weaken protections or add new checks silently.
- Use exactly one hosted Supabase project for both Workers. In its dashboard, privately obtain the Project URL and anon/publishable key (never the service-role key, database password, or personal access token). Set the production Site URL and exact production/preview `/auth/confirm` allowlist entries, require email confirmation, and use `{{ .RedirectTo }}?token_hash={{ .TokenHash }}` in the signup template. Configure a verified SMTP sender domain, custom SMTP credentials, and appropriate rate limits; keep credentials private and record prior non-secret settings for recovery.
- Install Node `22.14.0`, npm, Git, and Docker Desktop; start Docker and run `npm ci`, `npx wrangler --version`, and `npx supabase --version` locally. Authenticate Wrangler privately with `npx wrangler login` and verify the account with `npx wrangler whoami`. Local Wrangler authentication, Cloudflare Builds credentials, and runtime secrets are separate; use narrowly scoped credentials and never place tokens in the repository or chat.
- Add the hosted Project URL and anon/publishable key as encrypted runtime secrets on each Worker. `APP_ORIGIN` is a server-only variable configured separately for each Worker in `wrangler.jsonc`; local `.env` and `.dev.vars` must use local credentials and the local origin. Verify `.env` and `.dev.vars` are ignored by Git.
- Install the Cloudflare Workers & Pages GitHub App with access to this repository only. Configure production Builds for the repository root, `master`, Node `22.14.0`, `npm run build`, and `npx wrangler deploy`; disable Preview Builds. Obtain explicit approval before connecting Builds or merging the first controlled production PR: connecting may deploy the current branch immediately.
- The release path is feature branch → PR → protected `master` merge → Cloudflare production build/deploy. Run lint, `astro check`, and local smoke checks manually before merge. This plan adds no independent review or automatic lint/type-check/smoke gates; Cloudflare's build must succeed. Keep preview manual and deploy only reviewed, trusted code. Preview shares production users and data; use owned disposable accounts and no destructive tests.

### Manual verification and preview

Before merging a trusted PR, run lint, type checking, and smoke tests manually. The plan does not add automated lint, type-check, smoke-test, or independent-review merge gates; Cloudflare's build must succeed for deployment.

```powershell
npm run lint
npx astro check
npm run dev
```

In a second terminal, with local Supabase running and email confirmation disabled:

```powershell
$env:BASE_URL = 'http://127.0.0.1:4321'
npm run smoke
```

The smoke script creates users and must only target local Supabase. For confirmation testing, temporarily enable confirmation in local `supabase/config.toml`, use the local email inbox, verify that GET does not consume the link and the explicit confirmation POST does, test invalid/expired/reused links and cross-origin POST rejection, then restore the smoke baseline. Never run this script against hosted Supabase.

Manual preview build and deploy (PowerShell; verify the target and secret names first):

```powershell
$env:CLOUDFLARE_ENV = 'preview'
npm run build
npx wrangler deploy --dry-run
npx wrangler deploy
```

For a production preflight only, clear preview selection, build the default target, and dry-run; routine production deployment is performed by Workers Builds after the approved PR merge:

```powershell
Remove-Item Env:CLOUDFLARE_ENV -ErrorAction SilentlyContinue
npm run build
npx wrangler deploy --dry-run
```

### Recovery and limitations

If a production build is wrong, stop pushes and disable/disconnect production Builds first; confirm pending builds cannot redeploy. After human approval, inspect versions with `npx wrangler deployments list` and `npx wrangler versions list`, then use `npx wrangler rollback <version-id>`. Fix the source before reconnecting Builds. Worker rollback does not undo Supabase users, data, email, SMTP, or auth settings; restore those separately from the owner's recorded settings. For missing confirmation email, check sender-domain verification, SMTP delivery logs, provider quotas, and Supabase rate limits; only use an inbox you control. Pet profiles, vaccinations, sharing, and offline/PWA behavior are not implemented by this starter.

## Smoke test

`scripts/smoke.mjs` is a dependency-free Node script that walks the auth flow (sign-up, sign-in, protected page, sign-out) over HTTP. Run it only against the local dev server with the local Supabase stack and email confirmation disabled:

```powershell
# Terminal 1
npx supabase start
npm run dev

# Terminal 2
$env:BASE_URL = 'http://127.0.0.1:4321'
npm run smoke
```

The script creates accounts and must never target the shared hosted project or a public Worker. Use the local inbox and separate confirmation scenarios for testing verified-email signup.

> **Note:** this script exists primarily to guard the development of the starter itself — it is a fast sanity check that dependency upgrades did not break the build, the Cloudflare adapter or the Supabase auth flow. It is **not** a substitute for a real test suite. Once you build your own product on top of this starter, add proper tests (unit, integration, end-to-end) suited to your application.

## Continuous deployment

Cloudflare Workers Builds is the planned sole automatic deployment path once the owner approves and configures it: a trusted PR merge updates protected `master`, then Cloudflare builds and deploys the production Worker. Until that setup is complete, automatic production deployment is not enabled. GitHub Actions is disabled, no Actions workflows are included, and lint, type-check, and smoke tests are run manually before merge.

## License

MIT
