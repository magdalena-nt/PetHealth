---
project: Pet Health PWA
researched_at: 2026-11-20
recommended_platform: Cloudflare Workers
runner_up: Vercel
context_type: mvp
tech_stack:
  language: TypeScript
  framework: Astro 7
  runtime: Cloudflare Workers (workerd)
  database: Supabase (external)
---

## Recommendation

**Deploy on Cloudflare Workers.**

The project already uses `@astrojs/cloudflare` v14 with `output: "server"`, targeting the Workers runtime (`workerd`) — no adapter change is needed. The free tier (100 k requests/day, 10 ms CPU per request) is sufficient for a small-scale PWA with low QPS, and the $5/month paid tier removes all hard limits. Cloudflare familiarity (from the developer interview) reduces onboarding friction, and the GA MCP server (since September 2026) provides first-class agent integration. Supabase remains external, matching the interview preference.

## Platform Comparison

Five agent-friendly criteria were used for scoring (CLI-first, Managed/serverless, Agent-accessible docs, Stable deployment API, MCP/agent integration). Hard filters were applied first: no persistent connections are needed (all platforms pass), and a viable free tier is required (Fly.io eliminated — no free tier for new accounts). Interview answers weighted the results: free-tier priority penalized platforms with expensive base tiers or tight credit systems; Cloudflare familiarity broke ties; mostly-local reach made edge distribution a bonus rather than a requirement.

| Platform | CLI-first | Managed | Agent Docs | Deploy API | MCP/Agent | Free Tier | Verdict |
|---|---|---|---|---|---|---|---|
| **Cloudflare Workers** | Pass | Pass | Pass | Pass | Pass (GA) | 100 k req/day, 10 ms CPU | **Recommended** |
| **Vercel** | Pass | Pass | Pass | Pass | Partial (beta) | 100 GB, non-commercial | Runner-up |
| **Netlify** | Pass | Pass | Partial | Pass | Pass | 300 credits (~15 GB) | Shortlisted |
| **Fly.io** | Pass | Pass | Pass | Pass | Partial | None ($1 trial) | Eliminated |
| **Railway** | Pass | Pass | Partial | Pass | Fail | $1/mo credit | Eliminated |
| **Render** | Pass | Pass | Partial | Partial | Fail | Sleeps after 15 min | Eliminated |

**Scoring notes per platform:**

- **Cloudflare Workers:** `wrangler` CLI covers deploy, secrets, logs, rollback. Fully managed — no OS, no TLS config. Docs published as Markdown on GitHub with `llms.txt`. `wrangler deploy` is deterministic with exit codes. MCP server is GA (Sept 2026) with OAuth, covering 2 500+ API endpoints. Free tier is generous for low-QPS SSR.
- **Vercel:** `vercel` CLI is mature. Fully managed. Docs as MDX on GitHub. `vercel --prod` is deterministic. MCP is Public Beta — read-only, OAuth-backed. Free Hobby tier is generous (100 GB bandwidth, 6 000 build minutes) but restricted to personal/non-commercial use. Would require switching from `@astrojs/cloudflare` to `@astrojs/vercel`.
- **Netlify:** `netlify` CLI covers deploy, secrets, logs. Fully managed. Docs are rendered SPA — partial agent readability. Official MCP server available. Free tier uses credits (300/month ≈ 15 GB bandwidth or ~20 deploys) — tightest of the three shortlisted. Would require `@astrojs/netlify` adapter.
- **Fly.io:** `flyctl` is excellent. Managed VMs. Docs as MDX on GitHub. No free tier for new accounts — $1 trial credit, then pay-as-you-go from ~$2.19/month. Requires Docker container and Node.js adapter, not the Workers adapter.
- **Railway:** `railway` CLI available. Managed containers. Docs are rendered web — partial agent readability. No MCP server. Free plan gives $1/month credit (~36 hours CPU), no custom domains. Not viable for production MVP.
- **Render:** CLI limited — partial scriptability for some operations. Managed containers. Docs are rendered web. Free web services sleep after 15 minutes idle, taking ~1 minute to wake — unacceptable for a PWA. No MCP server.

### Shortlisted Platforms

#### 1. Cloudflare Workers (Recommended)

Won on compatibility (adapter already installed and configured), free-tier viability, developer familiarity, and GA MCP integration. The 10 ms CPU limit on the free tier is the only concern, but for a small-scale PWA with low QPS this is unlikely to be hit. The $5/month paid tier removes the limit entirely.

#### 2. Vercel

Strong free tier with 100 GB bandwidth and 6 000 build minutes. Beta MCP server provides agent access to deployments and logs. Gap vs. recommendation: requires adapter change (`@astrojs/vercel`), non-commercial Hobby restriction, and MCP is still in beta.

#### 3. Netlify

Official MCP server and mature CLI. Gap vs. recommendation: credit-based free tier (300 credits/month) is the tightest of the three — ~15 GB bandwidth or ~20 deploys. Docs are not agent-readable Markdown. Requires adapter change.

## Anti-Bias Cross-Check: Cloudflare Workers

### Devil's Advocate — Weaknesses

1. **10 ms CPU per request on free tier** — SSR rendering of even a simple Astro page with Supabase auth cookie parsing may approach or exceed 10 ms under load. A traffic spike or slow Supabase response could cause 500 errors on the free tier.
2. **`nodejs_compat` flag dependency** — Supabase SSR relies on Node.js compatibility shims. If Cloudflare changes or deprecates `nodejs_compat` behavior, the auth flow could break without warning.
3. **No local filesystem** — Workers have no persistent filesystem. Any feature requiring file uploads (e.g., pet photos in v2) requires R2 or external storage, adding complexity.
4. **Cold starts on free tier are rare but possible** — While Workers advertise 0 ms cold starts, in practice the first request after a period of inactivity can take 100–200 ms on the free tier due to isolate initialization.
5. **Bundle size limit (64 MiB uncompressed)** — The current starter builds well within this, but adding heavy dependencies (e.g., image processing libraries) could approach the limit.

### Pre-Mortem — How This Could Fail

Six months after deploying the Pet Health PWA to Cloudflare Workers, the decision proves problematic. The app grew beyond expectations — instead of a handful of users, word-of-mouth brought in hundreds. The free tier's 100 k requests/day cap is regularly exceeded during peak hours (morning vaccination reminders), causing hard 500 errors for users trying to check their pets' schedules. The 10 ms CPU limit means each SSR request barely has time to parse the Supabase auth cookie, render the page, and return — any Supabase latency spike (which happens during their maintenance windows) pushes requests over the limit, cascading into failures.

The developer forgot to upgrade to the $5 Workers Paid plan because the free tier seemed "generous enough." When failures start, diagnosing them is hard: the free tier has limited log retention, and the `wrangler logs` command only shows recent invocations. The developer has to upgrade, configure billing alerts, and add caching — work that could have been avoided by planning for scale from day one.

Meanwhile, the `nodejs_compat` flag receives a breaking change in a Cloudflare runtime update. The Supabase SSR cookie parsing silently fails for new sessions, but existing sessions work, so the bug is intermittent and hard to reproduce. It takes days to trace the issue to a runtime change rather than application code.

### Unknown Unknowns

- **Cloudflare's acquisition of Astro (January 2026)** — The adapter dropped Pages support in v13, standardizing on Workers. Future adapter changes may further tighten the Workers coupling, reducing deployment portability.
- **D1 free tier hard enforcement (September 2026)** — If the project later uses Cloudflare D1 for any purpose (e.g., caching), the free tier now hard-fails past 5 M reads/day instead of soft-limiting. This wasn't the case before September 2026.
- **Workers bundle size measurement changed (September 2026)** — Cloudflare switched from compressed (gzip) to uncompressed bundle size. The limit increased to 64 MiB, but future tooling changes could affect how bundle size is calculated.
- **Supabase + Workers SSR cookie handling** — The `@supabase/ssr` package with `nodejs_compat` works today, but this is an implicit dependency on Cloudflare's Node.js shim quality. If the shim diverges from Node.js behavior, auth may break without either party announcing the incompatibility.
- **PWA service worker + Workers interaction** — The PWA service worker (for offline support) runs in the browser, but Cloudflare Workers may interfere with cache-first strategies if headers or CORS are not configured correctly. This interaction is under-documented.

## Operational Story

- **Preview deploys**: Push to a branch and open a PR — `wrangler deploy --env preview` creates a preview URL. Fork PRs are supported. Preview deploys draw from the same Workers free tier quota.
- **Secrets**: `SUPABASE_URL` and `SUPABASE_KEY` are stored as Workers secrets via `npx wrangler secret put SUPABASE_URL` and `npx wrangler secret put SUPABASE_KEY`. Secrets are scoped to the project and accessible only through the Cloudflare dashboard or API tokens with Workers Secrets permission. Rotation: put the new value via CLI, old value is immediately replaced.
- **Rollback**: `npx wrangler rollback` reverts to the previous deployment version. Typical time-to-revert: seconds. No data caveats — Supabase data is unaffected.
- **Approval**: Publishing to production (`wrangler deploy`) may be performed by an agent unattended. Rotating the primary secret (SUPABASE_KEY) and dropping a database require a human. Deleting the Workers project requires a human.
- **Logs**: Read runtime logs read-only via `npx wrangler logs` (requires Workers Paid plan for full access; free tier has limited log retention). The Cloudflare dashboard → Workers → Logs provides a UI alternative. MCP server provides structured access to logs via its tools.

## Risk Register

| Risk | Source | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| 10 ms CPU limit causes 500 errors under load | Devil's advocate | M | H | Monitor CPU usage; upgrade to $5/month paid plan before hitting limits |
| `nodejs_compat` breaking change breaks Supabase SSR | Pre-mortem | L | H | Pin `compatibility_date` in `wrangler.jsonc`; test after Cloudflare runtime updates |
| Free tier request cap (100 k/day) exceeded | Pre-mortem | M | H | Set up billing alert; upgrade to paid plan when approaching 80 k/day |
| Limited log retention on free tier obscures debugging | Devil's advocate | M | M | Upgrade to paid plan for full log access; use external logging if needed |
| PWA service worker + Workers interaction issues | Unknown unknowns | L | M | Test offline behavior thoroughly after deployment; verify cache headers |
| Astro-Cloudflare coupling reduces portability | Unknown unknowns | L | L | Accept for MVP; document adapter dependency if migration is ever needed |
| Bundle size approaches 64 MiB limit | Devil's advocate | L | M | Monitor `wrangler deploy` output; offload heavy assets to R2 or CDN |

## Getting Started

The project is already configured for Cloudflare Workers deployment. No adapter or configuration changes are needed.

1. **Log in to Cloudflare via Wrangler:**

```bash
npx wrangler login
```

2. **Put Supabase secrets:**

```bash
npx wrangler secret put SUPABASE_URL
npx wrangler secret put SUPABASE_KEY
```

(Paste the values from your `.env` file when prompted.)

3. **Build and deploy:**

```bash
npm run build
npx wrangler deploy
```

4. **Verify the deployment:** Open the URL printed by `wrangler deploy` and test the auth flow (sign-up, sign-in, dashboard access).

5. **Set up a custom domain** (optional): In the Cloudflare dashboard, go to Workers & Pages → your project → Custom Domains, and follow the instructions to assign a domain.

## Out of Scope

The following were not evaluated in this research:
- Docker image configuration
- CI/CD pipeline setup
- Production-scale architecture (multi-region, HA, DR)
