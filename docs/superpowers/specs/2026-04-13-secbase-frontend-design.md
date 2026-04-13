# SECbase Frontend — Design Spec

**Date:** 2026-04-13  
**Product:** SECbase — affordable SEC EDGAR financial data API  
**Stack:** Next.js 16 (App Router) + TypeScript + Tailwind CSS + Motion  
**Backend:** https://sec-financial-api-production.up.railway.app  
**Deploy target:** Vercel

---

## Design Language

- **Theme:** Dark & Developer — near-black background (`#0a0a0a`), zinc grays, cyan accent (`#22d3ee`)
- **Tone:** Approachable, honest, developer-friendly — not Bloomberg, not trying to be the best, just affordable quality data
- **Typography:** System font stack or Geist (already in Next.js default)
- **Animations:** Subtle Motion transitions — page enters, loading states, button feedback. No flashy animations.

---

## Pages

| Route | Type | Description |
|-------|------|-------------|
| `/` | SSG (static) | Landing page |
| `/register` | Client | Registration form |
| `/login` | Client | Login form |
| `/verify-email` | Client | Email verification (reads `?token=`) |
| `/forgot-password` | Client | Request password reset form |
| `/reset-password` | Client | New password form (reads `?token=`) |
| `/dashboard` | Client (auth-guarded) | User dashboard with sidebar |
| `/docs` | SSG (static) | Getting started / API reference |

---

## Landing Page (`/`)

**Layout:** Centered hero with bold headline + stats bar (Option C from brainstorm)

**Sections (top to bottom):**
1. **Navbar** — `SECBASE` logo (cyan), Pricing link, Docs link, "Get API key" CTA button
2. **Hero** — Badge pill ("✦ 30 years of SEC EDGAR data"), large bold headline ("Financial data without the price tag"), subline listing endpoints, single CTA "Start for free →"
3. **Stats bar** — 4 stats: `2,800+ companies` · `30yr history` · `from $5/mo` · `REST API`
4. **Features grid** — 3–4 cards: Full EDGAR history / Structured endpoints / Affordable tiers / Weekly refresh
5. **Pricing table** — 6 tiers in a horizontal card row: Free / Basic / Starter / Growth / Pro / Enterprise with coverage, history, rate limit, price, and CTA per tier
6. **Footer** — SECbase name, links (Docs, Pricing, Register), disclaimer that data is from SEC EDGAR

**Pricing tiers:**
| Tier | Price | Coverage | History | Rate Limit |
|------|-------|----------|---------|------------|
| Free | $0 | S&P 500 | 5 years | 100 req/day |
| Basic | $5/mo | S&P 500 | 10 years | 500 req/min |
| Starter | $8/mo | Full 2,800+ | 10 years | 500 req/min |
| Growth | $15/mo | Full 2,800+ | Full | 1,000 req/min |
| Pro | $30/mo | Full 2,800+ | Full | 3,000 req/min |
| Enterprise | $150/mo | Full 2,800+ | Full | Unlimited |

---

## Auth Pages (`/register`, `/login`, `/forgot-password`, `/reset-password`, `/verify-email`)

**Layout:** Centered card on dark background, `SECBASE` logo at top

**Register form fields:** Name, Email, Password  
**Login form fields:** Email, Password + "Forgot password?" link  
**Forgot password:** Email only  
**Reset password:** New password + confirm (reads `?token=` from URL)  
**Verify email:** No form — calls backend with `?token=` on mount, shows success or error message

**Behavior:**
- Submit button disabled during loading
- Inline error messages below fields (from backend response body)
- On successful login → redirect to `/dashboard`
- On successful register → show "Check your email" message
- All async, no page reloads

---

## Dashboard (`/dashboard`)

**Layout:** Sidebar (Option B from brainstorm)

**Sidebar items:** Home (overview), API Key, Upgrade, Docs (external link)

**Overview page content:**
- 3 stat cards: Current Plan / Today's Requests (`47/100`) / Account Status
- API Key box: masked key with copy button and show/hide toggle
- Usage bar: visual progress bar (requests used / daily limit)
- Upgrade banner (only shown for Free/Basic tiers): highlights next tier benefits

**Auth guard:**
- `dashboard/layout.tsx` is `"use client"`
- Reads JWT from `localStorage` in `useEffect`
- While checking: show loading spinner (not a blank page)
- If no token or token invalid (401): redirect to `/login`
- Token sent as `Authorization: Bearer <token>` on all API calls

---

## Docs Page (`/docs`)

**Layout:** Static page, no auth required

**Content:**
1. Quick start — get API key, make first request (curl example)
2. Authentication — how to pass the API key
3. Endpoints reference — table of all endpoints with params
4. Tier limits — what each tier can access
5. Rate limiting — how it works, what happens when exceeded

---

## File Structure

```
app/
  layout.tsx                  # Root layout (fonts, globals, metadata)
  page.tsx                    # Landing (SSG)
  register/page.tsx
  login/page.tsx
  verify-email/page.tsx
  forgot-password/page.tsx
  reset-password/page.tsx
  dashboard/
    layout.tsx                # Sidebar shell + auth guard ("use client")
    page.tsx                  # Overview
  docs/page.tsx

components/
  ui/                         # Button, Input, Card, Badge, Spinner
  landing/                    # Navbar, Hero, StatsBar, FeaturesGrid, PricingTable, Footer
  dashboard/                  # Sidebar, StatCard, ApiKeyBox, UsageBar, UpgradeBanner
  auth/                       # AuthCard (shared wrapper for auth pages)

lib/
  api.ts                      # fetch wrapper — adds auth header, handles 401 → redirect
  auth.ts                     # getToken(), setToken(), clearToken() (localStorage helpers)
```

---

## Data Flow

```
Browser → lib/api.ts → Railway backend
              ↓
         Adds: Authorization: Bearer <token>
         On 401: clearToken() + redirect /login
         On 5xx: throw error → UI shows "Something went wrong"
         On 4xx: throw error with backend message → UI shows inline error
```

---

## Environment Variables

```env
NEXT_PUBLIC_API_URL=https://sec-financial-api-production.up.railway.app
```

(Stripe checkout URL added later when payments go live)

---

## Error Handling

| Scenario | Behavior |
|----------|----------|
| Token expired / missing | Clear localStorage, redirect to `/login` |
| Backend 4xx | Show backend error message inline |
| Backend 5xx / network | Show "Something went wrong, try again" |
| Invalid `?token=` in URL | Show clear error message (not blank page) |
| SSR accessing localStorage | `useEffect`-only access, loading spinner shown first |
| Form submit during loading | Submit button disabled, no double-submit |

---

## Out of Scope (v1)

- Stripe payment integration (added after full SEC dataset expansion)
- Usage graphs / historical charts in dashboard
- Admin panel
- Custom domain for Resend emails
- Dark/light mode toggle (dark only for now)
