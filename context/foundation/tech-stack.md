---
starter_id: 10x-astro-starter
package_manager: npm
project_name: pet-health-pwa
hints:
  language_family: js
  team_size: solo
  deployment_target: cloudflare-pages
  ci_provider: github-actions
  ci_default_flow: auto-deploy-on-merge
  bootstrapper_confidence: first-class
  path_taken: standard
  quality_override: false
  self_check_answers: null
  has_auth: true
  has_payments: false
  has_realtime: false
  has_ai: false
  has_background_jobs: false
---

## Why this stack

The 10x Astro Starter (Astro + React + TypeScript + Supabase + Cloudflare Pages) is the recommended choice for this web-app in JavaScript/TypeScript. It provides everything needed for the Pet Health PWA MVP out of the box: Supabase handles user authentication (FR-001) and PostgreSQL storage for pet profiles and vaccination records (FR-002, FR-003), while Cloudflare Pages offers a free-tier deployment path with edge runtime suitable for a small-scale PWA. The 3-week after-hours timeline benefits from this opinionated, battle-tested stack that minimizes setup friction. TypeScript ensures type safety across the codebase, and the Astro + React combination supports both static content and interactive islands needed for the vaccination reminder UI. Supabase Row-Level Security can enforce the per-pet access control model (FR-005) where owners grant access to specific pets.
