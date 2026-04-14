@AGENTS.md

# SEC Financial Frontend — CLAUDE.md

This file gives Claude Code the context needed to work effectively on this project.

## Project Summary

Next.js 16 frontend for SECfinAPI. Dark-themed, monospace font (JetBrains Mono), green/cyan accents. Currently shows a "coming soon" page at root — full landing page is built but not wired.

**Live site:** https://secfinapi.com (Vercel)  
**Backend:** https://sec-financial-api-production.up.railway.app  
**Branding:** SECfinAPI (capital API, green highlight on "API")

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 (App Router) |
| React | 19 |
| Styling | Tailwind CSS v4 |
| Language | TypeScript (strict) |
| Tests | Vitest + Testing Library |
| Font | JetBrains Mono (both sans and mono) |
| Deploy | Vercel |

---

## File Map

```
app/
  layout.tsx                  # Root layout, metadata, JetBrains Mono font
  page.tsx                    # ROOT — currently coming soon placeholder
  globals.css                 # Tailwind + custom theme (colors, animations)
  api/financial-data/route.ts # Server-side proxy for demo data (uses SECBASE_DEMO_KEY)
  dashboard/
    layout.tsx                # Auth guard (redirect to /login if no token)
    page.tsx                  # User dashboard (plan, key, usage)
  docs/page.tsx               # API documentation
  login/page.tsx
  register/page.tsx
  forgot-password/page.tsx
  reset-password/page.tsx     # Reads ?token= from URL
  verify-email/page.tsx       # Reads ?token= from URL, auto-logs in

components/
  landing/                    # NOT yet wired to a route
    Navbar.tsx
    Footer.tsx
    Hero.tsx                  # Server component, fetches live AAPL data
    PricingTable.tsx           # 6 tiers, Growth marked "popular"
    ApiExplorer.tsx            # Client component, ticker + endpoint selector
    FeaturesGrid.tsx           # STUB — returns null
  dashboard/
    ApiKeyBox.tsx              # Show/regenerate API key
    Sidebar.tsx
    StatCard.tsx
    UpgradeBanner.tsx
    UsageBar.tsx               # Color: cyan <70%, yellow 70-89%, red >=90%
  auth/
    AuthCard.tsx
  ui/
    Button.tsx                 # Variants: primary (cyan), ghost (outline)
    Input.tsx
    Card.tsx
    Spinner.tsx
    Badge.tsx                  # Variants: cyan, green, zinc
    index.ts

lib/
  api.ts        # apiFetch<T>() — adds Bearer token, throws ApiError on non-2xx
  auth.ts       # getToken/setToken/clearToken — localStorage key: "secbase_jwt"
  format.ts     # fmtUSD(), fmtEPS(), fmtPct(), yoyGrowth()
  utils.ts      # cn() — clsx + tailwind-merge

tests/lib/
  api.test.ts
  auth.test.ts
```

---

## Theme

```css
/* globals.css */
--font-sans: JetBrains Mono
--font-mono: JetBrains Mono
--color-accent: #00d47e  /* green */

/* Key colors */
bg: #111111          /* app background */
card: #1a1a1a        /* card backgrounds */
accent: #00d47e      /* green — logos, highlights */
cyan: #06b6d4        /* buttons, links */
```

Custom utilities: `.glow-green`, `.glow-border-green`, `.live-dot`, `.cursor-blink`  
Animations: `fadeUp`, `fadeIn`, `slideInRight` with delay classes

---

## Environment Variables

```bash
# .env.local (required)
NEXT_PUBLIC_API_URL=https://sec-financial-api-production.up.railway.app

# .env.local (optional — enables live data in Hero + ApiExplorer)
# Set as SECRET in Vercel (NOT NEXT_PUBLIC_)
SECBASE_DEMO_KEY=sk_5e6ae82194c47c0b98dc93af828b4c16c9b6c197b99813359c6ffa608030
```

---

## Key Patterns

**API client** (`lib/api.ts`):  
All calls go through `apiFetch<T>(path, options)`. Automatically adds `Authorization: Bearer {token}`. On 401: clears token, redirects to /login. Throws `ApiError` with `status` and `message`.

**Auth** (`lib/auth.ts`):  
JWT stored in localStorage under `secbase_jwt`. SSR-safe (checks `window` exists).

**Demo data proxy** (`app/api/financial-data/route.ts`):  
Server-side route that adds `SECBASE_DEMO_KEY` to backend calls. Validates ticker (`^[A-Z0-9.\-]{1,10}$`) and endpoint. 24h server cache, 1h stale-while-revalidate to clients.

**Dashboard auth guard** (`app/dashboard/layout.tsx`):  
Client component. Checks localStorage for token on mount. Redirects to /login if missing. Shows Spinner during check.

---

## Current State (2026-04-14)

**What's live at secfinapi.com:**
- Coming soon page at `/` (intentional until launch)
- `/login`, `/register`, `/verify-email`, `/forgot-password`, `/reset-password` — all working
- `/dashboard` — working (plan, key, usage)
- `/docs` — working

**What's built but not wired:**
- Full landing page components in `components/landing/` (Navbar, Hero, PricingTable, ApiExplorer)
- To launch: replace `app/page.tsx` with a page that imports and renders these components

**Known stubs:**
- `FeaturesGrid.tsx` — returns null (reserved for future feature tiles)

---

## Launch Checklist

To go from "coming soon" to full launch:
1. Replace `app/page.tsx` content with: `<Navbar />`, `<Hero />`, `<PricingTable />`, `<ApiExplorer />`, `<Footer />`
2. Configure Stripe (price IDs in backend env vars)
3. Update pricing links to point to actual Stripe checkout

---

## Testing

```bash
npm test              # vitest run (unit tests)
npm run test:watch    # vitest watch
npm run build         # type-check + build
npm run lint          # eslint
```

Tests cover: `lib/api.ts` (8 cases) and `lib/auth.ts` (8 cases).  
No component tests yet.

---

## Ticker Validation

The API proxy and frontend use: `^[A-Z0-9.\-]{1,10}$`  
This covers: standard tickers, BRK-B, BRK.B style, up to 10 chars.

---

## Common Gotchas

- `FeaturesGrid` returns null — don't add content without checking intent first
- `SECBASE_DEMO_KEY` must be server-only (not `NEXT_PUBLIC_`) to avoid exposing it in the bundle
- Dashboard uses client-side auth guard only — no server-side session/cookie auth
- `UsageBar` only renders if `api_key.requests_day_limit` exists (paid tiers have no daily limit)
- `UpgradeBanner` maps tier to next tier — update if pricing tiers change
- **JWT in localStorage** (`lib/auth.ts`) — known XSS risk, accepted pre-launch. Future improvement: move to `httpOnly` cookie via a `/auth/refresh` server action. Do not move this without a full auth refactor (dashboard guard, apiFetch, and all token reads).
