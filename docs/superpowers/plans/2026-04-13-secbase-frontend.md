# SECbase Frontend Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the complete SECbase marketing + app frontend — landing page, auth pages, dashboard, and docs — as a Next.js 16 app consuming the existing Railway backend API.

**Architecture:** Single Next.js 16 App Router project. Landing and docs are statically generated (SSG). Auth pages and dashboard are Client Components fetching directly from Railway. JWT stored in localStorage, all API calls via a central `lib/api.ts` wrapper that handles auth headers and 401 redirects.

**Tech Stack:** Next.js 16 (App Router, Turbopack), TypeScript, Tailwind CSS, Motion, Vitest + Testing Library, clsx + tailwind-merge

**Backend base URL:** `https://sec-financial-api-production.up.railway.app`

---

## File Map

```
app/
  layout.tsx                        modify (dark theme, metadata)
  page.tsx                          create (landing, SSG)
  register/page.tsx                 create
  login/page.tsx                    create
  verify-email/page.tsx             create
  forgot-password/page.tsx          create
  reset-password/page.tsx           create
  dashboard/
    layout.tsx                      create (auth guard + sidebar shell)
    page.tsx                        create (overview)
  docs/page.tsx                     create

components/
  ui/
    Button.tsx                      create
    Input.tsx                       create
    Card.tsx                        create
    Spinner.tsx                     create
    Badge.tsx                       create
  landing/
    Navbar.tsx                      create
    Hero.tsx                        create
    FeaturesGrid.tsx                create
    PricingTable.tsx                create
    Footer.tsx                      create
  auth/
    AuthCard.tsx                    create
  dashboard/
    Sidebar.tsx                     create
    StatCard.tsx                    create
    ApiKeyBox.tsx                   create
    UsageBar.tsx                    create
    UpgradeBanner.tsx               create

lib/
  utils.ts                          create (cn helper)
  auth.ts                           create (token helpers)
  api.ts                            create (fetch wrapper)

tests/
  lib/auth.test.ts                  create
  lib/api.test.ts                   create

vitest.config.ts                    create
vitest.setup.ts                     create
.env.local                          create
```

---

## Prerequisite: Backend fix — email links must point to frontend

> **Do this in `C:\Users\micha\sec-financial-api` before starting frontend tasks.**

The verification and reset-password emails currently link to the Railway backend URL. They must link to the frontend instead.

### Task 0: Add SEC_FRONTEND_URL to backend and fix email links

**Files:**
- Modify: `config.py`
- Modify: `api/accounts.py`

- [ ] **Step 1: Add `SEC_FRONTEND_URL` to config**

In `config.py`, find the `Settings` class and add:

```python
frontend_url: str = Field(
    default="http://localhost:3000",
    validation_alias=AliasChoices("SEC_FRONTEND_URL", "frontend_url"),
)
```

- [ ] **Step 2: Fix `send_verification_email` in `api/accounts.py`**

Change the link from backend URL to frontend URL:

```python
def send_verification_email(email: str, token: str) -> None:
    if not settings.resend_api_key.get_secret_value():
        return
    import resend
    resend.api_key = settings.resend_api_key.get_secret_value()
    resend.Emails.send({
        "from": settings.resend_from_email,
        "to": [email],
        "subject": "Verify your SECbase account",
        "html": (
            f"<p>Click the link to verify your email and get your free API key:</p>"
            f"<p><a href='{settings.frontend_url}/verify-email?token={token}'>"
            f"Verify my email</a></p>"
            f"<p>Link expires in 24 hours.</p>"
        ),
    })
```

- [ ] **Step 3: Fix `send_password_reset_email` in `api/accounts.py`**

```python
def send_password_reset_email(email: str, token: str) -> None:
    if not settings.resend_api_key.get_secret_value():
        return
    import resend
    resend.api_key = settings.resend_api_key.get_secret_value()
    resend.Emails.send({
        "from": settings.resend_from_email,
        "to": [email],
        "subject": "Reset your SECbase password",
        "html": (
            f"<p><a href='{settings.frontend_url}/reset-password?token={token}'>"
            f"Reset my password</a></p>"
            f"<p>Link expires in 1 hour.</p>"
        ),
    })
```

- [ ] **Step 4: Commit backend change**

```bash
cd C:\Users\micha\sec-financial-api
git add config.py api/accounts.py
git commit -m "feat: add SEC_FRONTEND_URL for email links pointing to frontend"
```

- [ ] **Step 5: Add Railway variable**

In Railway → Variables, add:
```
SEC_FRONTEND_URL=https://your-vercel-app.vercel.app
```
(Use `http://localhost:3000` for development. Update to real Vercel URL after deploy.)

- [ ] **Step 6: Push and redeploy**

```bash
git push
```

---

## Task 1: Tooling setup — Vitest, clsx, tailwind-merge

**Files:**
- Create: `vitest.config.ts`
- Create: `vitest.setup.ts`
- Create: `lib/utils.ts`
- Create: `.env.local`
- Modify: `package.json`

- [ ] **Step 1: Install dev dependencies**

```bash
cd C:\Users\micha\sec-financial-frontend
npm install --save-dev vitest @vitejs/plugin-react @testing-library/react @testing-library/jest-dom jsdom
npm install clsx tailwind-merge
```

Expected: no errors, `node_modules` updated.

- [ ] **Step 2: Create `vitest.config.ts`**

```typescript
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: './vitest.setup.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
```

- [ ] **Step 3: Create `vitest.setup.ts`**

```typescript
import '@testing-library/jest-dom'
```

- [ ] **Step 4: Add test script to `package.json`**

Find the `"scripts"` section and add:
```json
"test": "vitest run",
"test:watch": "vitest"
```

- [ ] **Step 5: Create `lib/utils.ts`**

```typescript
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs))
}
```

- [ ] **Step 6: Create `.env.local`**

```
NEXT_PUBLIC_API_URL=https://sec-financial-api-production.up.railway.app
```

- [ ] **Step 7: Verify Vitest works**

```bash
npx vitest run --reporter=verbose
```

Expected: "No test files found" — that's fine, no tests exist yet.

- [ ] **Step 8: Commit**

```bash
git add vitest.config.ts vitest.setup.ts lib/utils.ts .env.local package.json package-lock.json
git commit -m "chore: add Vitest, clsx, tailwind-merge"
```

---

## Task 2: lib/auth.ts — token helpers (TDD)

**Files:**
- Create: `lib/auth.ts`
- Create: `tests/lib/auth.test.ts`

- [ ] **Step 1: Create `tests/lib/auth.test.ts`**

```typescript
import { describe, it, expect, beforeEach } from 'vitest'
import { getToken, setToken, clearToken } from '@/lib/auth'

describe('auth token helpers', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no token is stored', () => {
    expect(getToken()).toBeNull()
  })

  it('stores and retrieves a token', () => {
    setToken('test_token_abc123')
    expect(getToken()).toBe('test_token_abc123')
  })

  it('overwrites an existing token', () => {
    setToken('old_token')
    setToken('new_token')
    expect(getToken()).toBe('new_token')
  })

  it('clears the token', () => {
    setToken('test_token_abc123')
    clearToken()
    expect(getToken()).toBeNull()
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run tests/lib/auth.test.ts --reporter=verbose
```

Expected: FAIL — `Cannot find module '@/lib/auth'`

- [ ] **Step 3: Create `lib/auth.ts`**

```typescript
const TOKEN_KEY = 'secbase_jwt'

export function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return localStorage.getItem(TOKEN_KEY)
}

export function setToken(token: string): void {
  localStorage.setItem(TOKEN_KEY, token)
}

export function clearToken(): void {
  localStorage.removeItem(TOKEN_KEY)
}
```

- [ ] **Step 4: Run test — verify it passes**

```bash
npx vitest run tests/lib/auth.test.ts --reporter=verbose
```

Expected: 4 tests PASS

- [ ] **Step 5: Commit**

```bash
git add lib/auth.ts tests/lib/auth.test.ts
git commit -m "feat: add JWT token helpers with tests"
```

---

## Task 3: lib/api.ts — fetch wrapper (TDD)

**Files:**
- Create: `lib/api.ts`
- Create: `tests/lib/api.test.ts`

- [ ] **Step 1: Create `tests/lib/api.test.ts`**

```typescript
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { apiFetch, ApiError } from '@/lib/api'

function mockFetch(status: number, body: unknown) {
  return vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  }))
}

describe('apiFetch', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  it('calls the correct URL', async () => {
    mockFetch(200, { data: 'ok' })
    await apiFetch('/health')
    expect(fetch).toHaveBeenCalledWith(
      expect.stringContaining('/health'),
      expect.any(Object)
    )
  })

  it('returns parsed JSON on success', async () => {
    mockFetch(200, { name: 'Michal' })
    const result = await apiFetch<{ name: string }>('/auth/me')
    expect(result).toEqual({ name: 'Michal' })
  })

  it('includes Authorization header when token exists', async () => {
    localStorage.setItem('secbase_jwt', 'mytoken123')
    mockFetch(200, {})
    await apiFetch('/auth/me')
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(options.headers['Authorization']).toBe('Bearer mytoken123')
  })

  it('does not include Authorization header when no token', async () => {
    mockFetch(200, {})
    await apiFetch('/health')
    const [, options] = (fetch as ReturnType<typeof vi.fn>).mock.calls[0]
    expect(options.headers['Authorization']).toBeUndefined()
  })

  it('throws ApiError with backend message on 4xx', async () => {
    mockFetch(409, { detail: 'Email already registered.' })
    await expect(apiFetch('/auth/register')).rejects.toThrow('Email already registered.')
  })

  it('throws ApiError with status code', async () => {
    mockFetch(400, { detail: 'Bad request' })
    try {
      await apiFetch('/bad')
    } catch (e) {
      expect(e).toBeInstanceOf(ApiError)
      expect((e as ApiError).status).toBe(400)
    }
  })

  it('throws ApiError with fallback message on 5xx with no body', async () => {
    mockFetch(500, {})
    await expect(apiFetch('/bad')).rejects.toThrow('Request failed')
  })
})
```

- [ ] **Step 2: Run test — verify it fails**

```bash
npx vitest run tests/lib/api.test.ts --reporter=verbose
```

Expected: FAIL — `Cannot find module '@/lib/api'`

- [ ] **Step 3: Create `lib/api.ts`**

```typescript
const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? ''

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message)
    this.name = 'ApiError'
  }
}

export async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token =
    typeof window !== 'undefined'
      ? localStorage.getItem('secbase_jwt')
      : null

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers as Record<string, string> ?? {}),
  }

  const res = await fetch(`${BASE_URL}${path}`, { ...options, headers })

  if (res.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('secbase_jwt')
      window.location.href = '/login'
    }
    throw new ApiError(401, 'Unauthorized')
  }

  if (!res.ok) {
    const body = await res.json().catch(() => ({}))
    const message = (body as { detail?: string; message?: string }).detail
      ?? (body as { detail?: string; message?: string }).message
      ?? 'Request failed'
    throw new ApiError(res.status, message)
  }

  return res.json() as Promise<T>
}
```

- [ ] **Step 4: Run test — verify all pass**

```bash
npx vitest run tests/lib/api.test.ts --reporter=verbose
```

Expected: 7 tests PASS

- [ ] **Step 5: Run all tests**

```bash
npx vitest run --reporter=verbose
```

Expected: 11 tests PASS (4 auth + 7 api)

- [ ] **Step 6: Commit**

```bash
git add lib/api.ts tests/lib/api.test.ts
git commit -m "feat: add API fetch wrapper with error handling and tests"
```

---

## Task 4: UI primitives — Button, Input, Card, Spinner, Badge

**Files:**
- Create: `components/ui/Button.tsx`
- Create: `components/ui/Input.tsx`
- Create: `components/ui/Card.tsx`
- Create: `components/ui/Spinner.tsx`
- Create: `components/ui/Badge.tsx`

No unit tests for pure UI components — tested via usage in pages.

- [ ] **Step 1: Create `components/ui/Button.tsx`**

```typescript
'use client'
import { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from './Spinner'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  loading?: boolean
}

export function Button({
  variant = 'primary',
  loading = false,
  disabled,
  children,
  className,
  ...props
}: ButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-semibold transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 disabled:cursor-not-allowed disabled:opacity-50',
        variant === 'primary' &&
          'bg-cyan-400 text-black hover:bg-cyan-300',
        variant === 'ghost' &&
          'border border-zinc-800 text-zinc-400 hover:border-zinc-600 hover:text-zinc-100',
        className
      )}
      {...props}
    >
      {loading && <Spinner className="h-4 w-4" />}
      {children}
    </button>
  )
}
```

- [ ] **Step 2: Create `components/ui/Spinner.tsx`**

```typescript
import { cn } from '@/lib/utils'

export function Spinner({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-block animate-spin rounded-full border-2 border-current border-t-transparent',
        className ?? 'h-5 w-5'
      )}
      aria-label="Loading"
    />
  )
}
```

- [ ] **Step 3: Create `components/ui/Input.tsx`**

```typescript
import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, id, ...props }, ref) => (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm text-zinc-400">
          {label}
        </label>
      )}
      <input
        ref={ref}
        id={id}
        className={cn(
          'rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none transition-colors focus:border-cyan-400',
          error && 'border-red-500 focus:border-red-400',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-400">{error}</p>}
    </div>
  )
)
Input.displayName = 'Input'
```

- [ ] **Step 4: Create `components/ui/Card.tsx`**

```typescript
import { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function Card({ className, children, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-lg border border-zinc-800 bg-zinc-900 p-6', className)}
      {...props}
    >
      {children}
    </div>
  )
}
```

- [ ] **Step 5: Create `components/ui/Badge.tsx`**

```typescript
import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'cyan' | 'green' | 'zinc'
  className?: string
}

export function Badge({ children, variant = 'zinc', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold',
        variant === 'cyan' && 'bg-cyan-400/10 text-cyan-400',
        variant === 'green' && 'bg-green-400/10 text-green-400',
        variant === 'zinc' && 'bg-zinc-800 text-zinc-400',
        className
      )}
    >
      {children}
    </span>
  )
}
```

- [ ] **Step 6: Update `app/layout.tsx`**

```typescript
import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist' })
const geistMono = Geist_Mono({ subsets: ['latin'], variable: '--font-geist-mono' })

export const metadata: Metadata = {
  title: 'SECbase — Affordable SEC Financial Data API',
  description:
    '30 years of SEC EDGAR data. 2,800+ companies. Income statements, balance sheets, cash flows. Starts at $5/mo.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${geist.variable} ${geistMono.variable}`}>
      <body className="bg-[#0a0a0a] font-sans text-zinc-100 antialiased">
        {children}
      </body>
    </html>
  )
}
```

- [ ] **Step 7: Commit**

```bash
git add components/ app/layout.tsx
git commit -m "feat: add UI primitives and update root layout"
```

---

## Task 5: Landing page

**Files:**
- Create: `components/landing/Navbar.tsx`
- Create: `components/landing/Hero.tsx`
- Create: `components/landing/FeaturesGrid.tsx`
- Create: `components/landing/PricingTable.tsx`
- Create: `components/landing/Footer.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create `components/landing/Navbar.tsx`**

```typescript
import Link from 'next/link'

export function Navbar() {
  return (
    <nav className="fixed top-0 z-50 w-full border-b border-zinc-900 bg-[#0a0a0a]/90 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-6">
        <Link href="/" className="text-sm font-black tracking-widest text-cyan-400">
          SECBASE
        </Link>
        <div className="flex items-center gap-6">
          <Link href="#pricing" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
            Pricing
          </Link>
          <Link href="/docs" className="text-sm text-zinc-500 hover:text-zinc-200 transition-colors">
            Docs
          </Link>
          <Link href="/login" className="text-sm text-zinc-400 hover:text-zinc-100 transition-colors">
            Sign in
          </Link>
          <Link
            href="/register"
            className="rounded bg-cyan-400 px-3 py-1.5 text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
          >
            Get API key
          </Link>
        </div>
      </div>
    </nav>
  )
}
```

- [ ] **Step 2: Create `components/landing/Hero.tsx`**

```typescript
import Link from 'next/link'

const STATS = [
  { value: '2,800+', label: 'companies' },
  { value: '30yr', label: 'history' },
  { value: '$5/mo', label: 'starts at' },
  { value: 'REST', label: 'API' },
]

export function Hero() {
  return (
    <section className="flex flex-col items-center px-6 pb-16 pt-32 text-center">
      <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-4 py-1.5 text-xs text-cyan-400">
        <span>✦</span>
        <span>30 years of SEC EDGAR data</span>
      </div>

      <h1 className="mb-4 max-w-2xl text-5xl font-black leading-tight tracking-tight text-zinc-100 md:text-6xl">
        Financial data
        <br />
        <span className="text-cyan-400">without the price tag</span>
      </h1>

      <p className="mb-2 text-base text-zinc-500">
        Income · Balance Sheet · Cash Flow · Metrics
      </p>

      <Link
        href="/register"
        className="mt-8 inline-flex items-center gap-2 rounded bg-cyan-400 px-6 py-3 text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
      >
        Start for free →
      </Link>

      {/* Stats bar */}
      <div className="mt-16 flex flex-wrap justify-center gap-10 border-t border-zinc-900 pt-10">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-2xl font-black text-zinc-100">{s.value}</div>
            <div className="mt-0.5 text-xs text-zinc-500">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create `components/landing/FeaturesGrid.tsx`**

```typescript
const FEATURES = [
  {
    icon: '📊',
    title: 'Full EDGAR History',
    description:
      'Up to 30 years of filings for 2,800+ US-listed companies — directly from SEC EDGAR, refreshed weekly.',
  },
  {
    icon: '⚡',
    title: 'Structured Endpoints',
    description:
      'Income statement, balance sheet, cash flow, and key metrics — all normalized and ready to use. No parsing required.',
  },
  {
    icon: '💸',
    title: 'Honest Pricing',
    description:
      'Free tier with 100 req/day. Paid plans start at $5/mo. No contracts, no overage fees, no hidden costs.',
  },
  {
    icon: '🔄',
    title: 'Weekly Refresh',
    description:
      'Data syncs every Sunday. You get fresh filings without building your own EDGAR pipeline.',
  },
]

export function FeaturesGrid() {
  return (
    <section className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-10 text-center text-2xl font-bold text-zinc-100">
        Everything you need, nothing you don't
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map((f) => (
          <div
            key={f.title}
            className="rounded-lg border border-zinc-800 bg-zinc-900 p-6"
          >
            <div className="mb-3 text-2xl">{f.icon}</div>
            <h3 className="mb-2 font-semibold text-zinc-100">{f.title}</h3>
            <p className="text-sm leading-relaxed text-zinc-500">{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create `components/landing/PricingTable.tsx`**

```typescript
import Link from 'next/link'

const TIERS = [
  {
    name: 'Free',
    price: '$0',
    period: '',
    coverage: 'S&P 500',
    history: '5 years',
    rateLimit: '100 req/day',
    highlight: false,
  },
  {
    name: 'Basic',
    price: '$5',
    period: '/mo',
    coverage: 'S&P 500',
    history: '10 years',
    rateLimit: '500 req/min',
    highlight: false,
  },
  {
    name: 'Starter',
    price: '$8',
    period: '/mo',
    coverage: '2,800+ companies',
    history: '10 years',
    rateLimit: '500 req/min',
    highlight: false,
  },
  {
    name: 'Growth',
    price: '$15',
    period: '/mo',
    coverage: '2,800+ companies',
    history: 'Full history',
    rateLimit: '1,000 req/min',
    highlight: true,
  },
  {
    name: 'Pro',
    price: '$30',
    period: '/mo',
    coverage: '2,800+ companies',
    history: 'Full history',
    rateLimit: '3,000 req/min',
    highlight: false,
  },
  {
    name: 'Enterprise',
    price: '$150',
    period: '/mo',
    coverage: '2,800+ companies',
    history: 'Full history',
    rateLimit: 'Unlimited',
    highlight: false,
  },
]

export function PricingTable() {
  return (
    <section id="pricing" className="mx-auto max-w-6xl px-6 py-16">
      <h2 className="mb-2 text-center text-2xl font-bold text-zinc-100">
        Simple, transparent pricing
      </h2>
      <p className="mb-10 text-center text-sm text-zinc-500">
        Start free. Upgrade when you need more.
      </p>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {TIERS.map((tier) => (
          <div
            key={tier.name}
            className={`relative flex flex-col rounded-lg border p-5 ${
              tier.highlight
                ? 'border-cyan-400 bg-cyan-400/5'
                : 'border-zinc-800 bg-zinc-900'
            }`}
          >
            {tier.highlight && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-cyan-400 px-3 py-0.5 text-xs font-bold text-black">
                Popular
              </div>
            )}
            <div className="mb-4">
              <div className="text-sm font-semibold text-zinc-300">{tier.name}</div>
              <div className="mt-1 text-2xl font-black text-zinc-100">
                {tier.price}
                <span className="text-sm font-normal text-zinc-500">{tier.period}</span>
              </div>
            </div>
            <ul className="mb-6 flex flex-col gap-2 text-xs text-zinc-400">
              <li>📍 {tier.coverage}</li>
              <li>📅 {tier.history}</li>
              <li>⚡ {tier.rateLimit}</li>
            </ul>
            <Link
              href="/register"
              className={`mt-auto rounded py-2 text-center text-xs font-semibold transition-colors ${
                tier.highlight
                  ? 'bg-cyan-400 text-black hover:bg-cyan-300'
                  : 'border border-zinc-700 text-zinc-400 hover:border-zinc-500 hover:text-zinc-200'
              }`}
            >
              {tier.name === 'Free' ? 'Start free' : 'Get started'}
            </Link>
          </div>
        ))}
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create `components/landing/Footer.tsx`**

```typescript
import Link from 'next/link'

export function Footer() {
  return (
    <footer className="border-t border-zinc-900 px-6 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center">
        <span className="text-sm font-black tracking-widest text-cyan-400">SECBASE</span>
        <div className="flex gap-6 text-sm text-zinc-500">
          <Link href="#pricing" className="hover:text-zinc-300 transition-colors">Pricing</Link>
          <Link href="/docs" className="hover:text-zinc-300 transition-colors">Docs</Link>
          <Link href="/register" className="hover:text-zinc-300 transition-colors">Register</Link>
          <Link href="/login" className="hover:text-zinc-300 transition-colors">Sign in</Link>
        </div>
        <p className="max-w-md text-xs text-zinc-600">
          Financial data sourced from SEC EDGAR. SECbase is not affiliated with the U.S. Securities and Exchange Commission.
        </p>
      </div>
    </footer>
  )
}
```

- [ ] **Step 6: Rewrite `app/page.tsx`**

```typescript
import { Navbar } from '@/components/landing/Navbar'
import { Hero } from '@/components/landing/Hero'
import { FeaturesGrid } from '@/components/landing/FeaturesGrid'
import { PricingTable } from '@/components/landing/PricingTable'
import { Footer } from '@/components/landing/Footer'

export default function LandingPage() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <FeaturesGrid />
        <PricingTable />
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 7: Start dev server and verify landing page**

```bash
cd C:\Users\micha\sec-financial-frontend
npm run dev
```

Open http://localhost:3000. Verify:
- Dark background, SECBASE cyan logo
- Hero with "Financial data without the price tag" headline
- Stats bar (2,800+ · 30yr · $5/mo · REST)
- Features grid (4 cards)
- Pricing table (6 tiers, Growth highlighted)
- Footer

- [ ] **Step 8: Commit**

```bash
git add app/page.tsx components/landing/
git commit -m "feat: landing page — hero, features, pricing, footer"
```

---

## Task 6: Auth pages

**Files:**
- Create: `components/auth/AuthCard.tsx`
- Create: `app/register/page.tsx`
- Create: `app/login/page.tsx`
- Create: `app/verify-email/page.tsx`
- Create: `app/forgot-password/page.tsx`
- Create: `app/reset-password/page.tsx`

- [ ] **Step 1: Create `components/auth/AuthCard.tsx`**

```typescript
import Link from 'next/link'

interface AuthCardProps {
  title: string
  subtitle?: string
  children: React.ReactNode
}

export function AuthCard({ title, subtitle, children }: AuthCardProps) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <Link href="/" className="mb-8 text-sm font-black tracking-widest text-cyan-400">
        SECBASE
      </Link>
      <div className="w-full max-w-sm rounded-lg border border-zinc-800 bg-zinc-900 p-8">
        <h1 className="mb-1 text-xl font-bold text-zinc-100">{title}</h1>
        {subtitle && <p className="mb-6 text-sm text-zinc-500">{subtitle}</p>}
        {!subtitle && <div className="mb-6" />}
        {children}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Create `app/register/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiFetch, ApiError } from '@/lib/api'

export default function RegisterPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiFetch('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      setSuccess(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <AuthCard title="Check your email">
        <p className="text-sm text-zinc-400">
          We sent a verification link to <span className="text-zinc-200">{email}</span>.
          Click the link to activate your account and get your free API key.
        </p>
        <p className="mt-4 text-sm text-zinc-500">
          Already verified?{' '}
          <Link href="/login" className="text-cyan-400 hover:underline">
            Sign in
          </Link>
        </p>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Create your account" subtitle="Free tier — no credit card required">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="name"
          label="Name"
          type="text"
          placeholder="Michal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Min. 8 characters"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          minLength={8}
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Create account
        </Button>
      </form>
      <p className="mt-4 text-center text-sm text-zinc-500">
        Already have an account?{' '}
        <Link href="/login" className="text-cyan-400 hover:underline">
          Sign in
        </Link>
      </p>
    </AuthCard>
  )
}
```

- [ ] **Step 3: Create `app/login/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/AuthCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiFetch, ApiError } from '@/lib/api'
import { setToken } from '@/lib/auth'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const { access_token } = await apiFetch<{ access_token: string; token_type: string }>(
        '/auth/login',
        { method: 'POST', body: JSON.stringify({ email, password }) }
      )
      setToken(access_token)
      router.push('/dashboard')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Sign in to SECbase">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <Input
          id="password"
          label="Password"
          type="password"
          placeholder="Your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Sign in
        </Button>
      </form>
      <div className="mt-4 flex justify-between text-sm">
        <Link href="/forgot-password" className="text-zinc-500 hover:text-zinc-300 transition-colors">
          Forgot password?
        </Link>
        <Link href="/register" className="text-cyan-400 hover:underline">
          Create account
        </Link>
      </div>
    </AuthCard>
  )
}
```

- [ ] **Step 4: Create `app/verify-email/page.tsx`**

> Note: `useSearchParams()` requires a `<Suspense>` boundary in Next.js 16 App Router — the component that calls it must be a child of Suspense, not the page default export itself.

```typescript
'use client'
import { Suspense, useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { Spinner } from '@/components/ui/Spinner'
import { apiFetch, ApiError } from '@/lib/api'

type State = 'loading' | 'success' | 'error' | 'missing'

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token')
  const [state, setState] = useState<State>(token ? 'loading' : 'missing')
  const [apiKey, setApiKey] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (!token) return
    apiFetch<{ message: string; api_key: string; tier: string }>(
      `/auth/verify-email?token=${encodeURIComponent(token)}`
    )
      .then((data) => {
        setApiKey(data.api_key)
        setState('success')
      })
      .catch((err) => {
        setErrorMsg(err instanceof ApiError ? err.message : 'Verification failed.')
        setState('error')
      })
  }, [token])

  if (state === 'loading') {
    return (
      <AuthCard title="Verifying your email...">
        <div className="flex justify-center py-6"><Spinner /></div>
      </AuthCard>
    )
  }

  if (state === 'success') {
    return (
      <AuthCard title="Email verified ✓">
        <p className="mb-4 text-sm text-zinc-400">Your account is active. Here is your free API key:</p>
        <code className="block rounded border border-zinc-700 bg-zinc-800 px-3 py-2 text-xs text-cyan-400 break-all">
          {apiKey}
        </code>
        <Link
          href="/login"
          className="mt-6 block w-full rounded bg-cyan-400 py-2 text-center text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
        >
          Sign in to dashboard →
        </Link>
      </AuthCard>
    )
  }

  if (state === 'error') {
    return (
      <AuthCard title="Verification failed">
        <p className="mb-4 text-sm text-red-400">{errorMsg}</p>
        <Link href="/register" className="text-sm text-cyan-400 hover:underline">Register again</Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Invalid link">
      <p className="text-sm text-zinc-400">This verification link is missing a token. Please use the link from your email.</p>
    </AuthCard>
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner /></div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
```

- [ ] **Step 5: Create `app/forgot-password/page.tsx`**

```typescript
'use client'
import { useState } from 'react'
import Link from 'next/link'
import { AuthCard } from '@/components/auth/AuthCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { apiFetch, ApiError } from '@/lib/api'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await apiFetch('/auth/forgot-password', {
        method: 'POST',
        body: JSON.stringify({ email }),
      })
      setSent(true)
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  if (sent) {
    return (
      <AuthCard title="Check your email">
        <p className="text-sm text-zinc-400">
          If <span className="text-zinc-200">{email}</span> is registered, we sent a password reset link. Check your inbox.
        </p>
        <Link href="/login" className="mt-4 block text-sm text-cyan-400 hover:underline">
          ← Back to sign in
        </Link>
      </AuthCard>
    )
  }

  return (
    <AuthCard title="Reset your password" subtitle="Enter your email and we'll send a reset link.">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          id="email"
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" loading={loading} className="mt-2 w-full">
          Send reset link
        </Button>
      </form>
      <Link href="/login" className="mt-4 block text-center text-sm text-zinc-500 hover:text-zinc-300 transition-colors">
        ← Back to sign in
      </Link>
    </AuthCard>
  )
}
```

- [ ] **Step 6: Create `app/reset-password/page.tsx`**

> Note: Same `useSearchParams()` + Suspense pattern as verify-email.

```typescript
'use client'
import { Suspense, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { AuthCard } from '@/components/auth/AuthCard'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { apiFetch, ApiError } from '@/lib/api'

function ResetPasswordContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const token = searchParams.get('token')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  if (!token) {
    return (
      <AuthCard title="Invalid link">
        <p className="text-sm text-zinc-400">This reset link is missing a token. Please use the link from your email.</p>
      </AuthCard>
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    if (password !== confirm) { setError('Passwords do not match.'); return }
    if (password.length < 8) { setError('Password must be at least 8 characters.'); return }
    setLoading(true)
    try {
      await apiFetch('/auth/reset-password', {
        method: 'POST',
        body: JSON.stringify({ token, new_password: password }),
      })
      router.push('/login?reset=1')
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Something went wrong.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AuthCard title="Set new password">
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input id="password" label="New password" type="password" placeholder="Min. 8 characters"
          value={password} onChange={(e) => setPassword(e.target.value)} required />
        <Input id="confirm" label="Confirm password" type="password" placeholder="Repeat password"
          value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
        {error && <p className="text-sm text-red-400">{error}</p>}
        <Button type="submit" loading={loading} className="mt-2 w-full">Update password</Button>
      </form>
    </AuthCard>
  )
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="flex min-h-screen items-center justify-center"><Spinner /></div>}>
      <ResetPasswordContent />
    </Suspense>
  )
}
```

- [ ] **Step 7: Verify auth pages in dev server**

With `npm run dev` running, check:
- http://localhost:3000/register — form with name/email/password
- http://localhost:3000/login — email/password + forgot link
- http://localhost:3000/forgot-password — email only
- http://localhost:3000/reset-password — shows "Invalid link" (no token in URL, expected)
- http://localhost:3000/verify-email — shows "Invalid link" (no token, expected)

- [ ] **Step 8: Commit**

```bash
git add components/auth/ app/register/ app/login/ app/verify-email/ app/forgot-password/ app/reset-password/
git commit -m "feat: auth pages — register, login, verify-email, forgot/reset password"
```

---

## Task 7: Dashboard

**Files:**
- Create: `components/dashboard/Sidebar.tsx`
- Create: `components/dashboard/StatCard.tsx`
- Create: `components/dashboard/ApiKeyBox.tsx`
- Create: `components/dashboard/UsageBar.tsx`
- Create: `components/dashboard/UpgradeBanner.tsx`
- Create: `app/dashboard/layout.tsx`
- Create: `app/dashboard/page.tsx`

- [ ] **Step 1: Create `components/dashboard/Sidebar.tsx`**

```typescript
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { cn } from '@/lib/utils'
import { clearToken } from '@/lib/auth'

const NAV = [
  { href: '/dashboard', label: 'Overview', icon: '⊞' },
  { href: '/docs', label: 'Docs', icon: '📄', external: true },
]

export function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

  function handleLogout() {
    clearToken()
    router.push('/login')
  }

  return (
    <aside className="flex w-56 flex-shrink-0 flex-col border-r border-zinc-800 bg-zinc-950 px-3 py-6">
      <Link href="/" className="mb-8 px-3 text-sm font-black tracking-widest text-cyan-400">
        SECBASE
      </Link>

      <nav className="flex flex-1 flex-col gap-1">
        {NAV.map((item) =>
          item.external ? (
            <a
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors"
            >
              <span>{item.icon}</span>
              {item.label}
            </a>
          ) : (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                pathname === item.href
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200'
              )}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          )
        )}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-md px-3 py-2 text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
      >
        <span>→</span>
        Sign out
      </button>
    </aside>
  )
}
```

- [ ] **Step 2: Create `components/dashboard/StatCard.tsx`**

```typescript
interface StatCardProps {
  label: string
  value: string
  sub?: string
  accent?: boolean
}

export function StatCard({ label, value, sub, accent = false }: StatCardProps) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-1 text-xs uppercase tracking-wider text-zinc-500">{label}</div>
      <div className={`text-2xl font-bold ${accent ? 'text-cyan-400' : 'text-zinc-100'}`}>
        {value}
      </div>
      {sub && <div className="mt-1 text-xs text-zinc-600">{sub}</div>}
    </div>
  )
}
```

- [ ] **Step 3: Create `components/dashboard/ApiKeyBox.tsx`**

```typescript
'use client'
import { useState } from 'react'

export function ApiKeyBox({ apiKey }: { apiKey: string }) {
  const [visible, setVisible] = useState(false)
  const [copied, setCopied] = useState(false)

  const display = visible
    ? apiKey
    : apiKey.slice(0, 8) + '••••••••••••••••' + apiKey.slice(-4)

  async function handleCopy() {
    await navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 text-xs uppercase tracking-wider text-zinc-500">API Key</div>
      <div className="flex items-center gap-2">
        <code className="flex-1 overflow-hidden text-ellipsis rounded border border-zinc-800 bg-zinc-950 px-3 py-2 text-xs text-cyan-400 font-mono">
          {display}
        </code>
        <button
          onClick={() => setVisible((v) => !v)}
          className="rounded border border-zinc-800 px-2 py-2 text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
          title={visible ? 'Hide' : 'Show'}
        >
          {visible ? '👁' : '👁‍🗨'}
        </button>
        <button
          onClick={handleCopy}
          className="rounded border border-zinc-800 px-3 py-2 text-xs text-zinc-500 hover:border-zinc-600 hover:text-zinc-300 transition-colors"
        >
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: Create `components/dashboard/UsageBar.tsx`**

```typescript
interface UsageBarProps {
  used: number
  limit: number
}

export function UsageBar({ used, limit }: UsageBarProps) {
  const pct = Math.min(100, Math.round((used / limit) * 100))
  const color = pct >= 90 ? 'bg-red-400' : pct >= 70 ? 'bg-yellow-400' : 'bg-cyan-400'

  return (
    <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs uppercase tracking-wider text-zinc-500">Today's usage</span>
        <span className="text-xs text-zinc-400">
          {used} / {limit} requests
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-zinc-800">
        <div
          className={`h-full rounded-full transition-all ${color}`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-zinc-600">Resets at midnight UTC</p>
    </div>
  )
}
```

- [ ] **Step 5: Create `components/dashboard/UpgradeBanner.tsx`**

```typescript
import Link from 'next/link'

const NEXT_TIER: Record<string, { name: string; price: string; benefit: string }> = {
  free: { name: 'Basic', price: '$5/mo', benefit: '10 years of history + 500 req/min' },
  basic: { name: 'Starter', price: '$8/mo', benefit: 'full 2,800+ companies' },
  starter: { name: 'Growth', price: '$15/mo', benefit: 'full history for all companies' },
  growth: { name: 'Pro', price: '$30/mo', benefit: '3,000 req/min' },
  pro: { name: 'Enterprise', price: '$150/mo', benefit: 'unlimited requests' },
}

export function UpgradeBanner({ tier }: { tier: string }) {
  const next = NEXT_TIER[tier.toLowerCase()]
  if (!next) return null

  return (
    <div className="flex items-center justify-between rounded-lg border border-cyan-400/20 bg-cyan-400/5 px-5 py-4">
      <p className="text-sm text-zinc-400">
        Upgrade to <span className="font-semibold text-cyan-400">{next.name}</span> ({next.price}) — get {next.benefit}
      </p>
      <Link
        href="#pricing"
        className="ml-4 flex-shrink-0 rounded bg-cyan-400 px-4 py-1.5 text-xs font-bold text-black hover:bg-cyan-300 transition-colors"
      >
        Upgrade
      </Link>
    </div>
  )
}
```

- [ ] **Step 6: Create `app/dashboard/layout.tsx`**

```typescript
'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getToken } from '@/lib/auth'
import { Sidebar } from '@/components/dashboard/Sidebar'
import { Spinner } from '@/components/ui/Spinner'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const token = getToken()
    if (!token) {
      router.replace('/login')
    } else {
      setChecked(true)
    }
  }, [router])

  if (!checked) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Spinner />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 overflow-auto p-8">{children}</main>
    </div>
  )
}
```

- [ ] **Step 7: Create `app/dashboard/page.tsx`**

```typescript
'use client'
import { useEffect, useState } from 'react'
import { apiFetch, ApiError } from '@/lib/api'
import { StatCard } from '@/components/dashboard/StatCard'
import { ApiKeyBox } from '@/components/dashboard/ApiKeyBox'
import { UsageBar } from '@/components/dashboard/UsageBar'
import { UpgradeBanner } from '@/components/dashboard/UpgradeBanner'
import { Spinner } from '@/components/ui/Spinner'

interface MeResponse {
  name: string
  email: string
  api_key: string | null
  tier: string
  status: string
  requests_today: number
  created_at: string
  last_used_at: string | null
}

const DAILY_LIMIT: Record<string, number | null> = {
  free: 100,
  basic: null,
  starter: null,
  growth: null,
  pro: null,
  enterprise: null,
}

const TIER_LABEL: Record<string, string> = {
  free: 'Free',
  basic: 'Basic — $5/mo',
  starter: 'Starter — $8/mo',
  growth: 'Growth — $15/mo',
  pro: 'Pro — $30/mo',
  enterprise: 'Enterprise — $150/mo',
}

export default function DashboardPage() {
  const [user, setUser] = useState<MeResponse | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    apiFetch<MeResponse>('/auth/me')
      .then(setUser)
      .catch((err) => {
        setError(err instanceof ApiError ? err.message : 'Failed to load account.')
      })
  }, [])

  if (error) {
    return <p className="text-sm text-red-400">{error}</p>
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center py-24">
        <Spinner />
      </div>
    )
  }

  const tier = user.tier.toLowerCase()
  const dailyLimit = DAILY_LIMIT[tier]

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-zinc-100">
          Welcome back, {user.name.split(' ')[0]}
        </h1>
        <p className="mt-1 text-sm text-zinc-500">{user.email}</p>
      </div>

      <div className="mb-6 grid gap-4 sm:grid-cols-3">
        <StatCard
          label="Plan"
          value={TIER_LABEL[tier] ?? tier}
          accent
        />
        <StatCard
          label="Requests today"
          value={String(user.requests_today)}
          sub={dailyLimit ? `of ${dailyLimit} limit` : 'no daily limit'}
        />
        <StatCard
          label="Key status"
          value={user.status === 'active' ? 'Active' : user.status}
          sub={user.last_used_at ? `Last used ${new Date(user.last_used_at).toLocaleDateString()}` : 'Never used'}
        />
      </div>

      <div className="mb-4">
        {user.api_key ? (
          <ApiKeyBox apiKey={user.api_key} />
        ) : (
          <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 text-sm text-zinc-500">
            No API key yet — please verify your email first.
          </div>
        )}
      </div>

      {dailyLimit !== null && (
        <div className="mb-4">
          <UsageBar used={user.requests_today} limit={dailyLimit} />
        </div>
      )}

      <UpgradeBanner tier={tier} />
    </div>
  )
}
```

- [ ] **Step 8: Verify dashboard in dev server**

With `npm run dev` running:
- Visit http://localhost:3000/dashboard — should redirect to `/login` (no token)
- Login with a real account, should land on dashboard with sidebar
- API key box, stat cards, usage bar, upgrade banner all visible

- [ ] **Step 9: Commit**

```bash
git add components/dashboard/ app/dashboard/
git commit -m "feat: dashboard — sidebar layout, stat cards, API key box, usage bar"
```

---

## Task 8: Docs page

**Files:**
- Create: `app/docs/page.tsx`

- [ ] **Step 1: Create `app/docs/page.tsx`**

```typescript
import Link from 'next/link'
import { Navbar } from '@/components/landing/Navbar'
import { Footer } from '@/components/landing/Footer'

const ENDPOINTS = [
  { method: 'GET', path: '/company/{ticker}/income-statement', desc: 'Annual/quarterly income statement' },
  { method: 'GET', path: '/company/{ticker}/balance-sheet', desc: 'Balance sheet' },
  { method: 'GET', path: '/company/{ticker}/cash-flow', desc: 'Cash flow statement' },
  { method: 'GET', path: '/company/{ticker}/metrics', desc: 'Key financial ratios' },
  { method: 'GET', path: '/company/{ticker}/info', desc: 'Company metadata' },
  { method: 'GET', path: '/companies', desc: 'List all indexed companies' },
]

export default function DocsPage() {
  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 pb-24 pt-28">
        <h1 className="mb-2 text-3xl font-black text-zinc-100">Documentation</h1>
        <p className="mb-12 text-zinc-500">Get started with SECbase in minutes.</p>

        {/* Quick start */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Quick start</h2>
          <ol className="flex flex-col gap-4 text-sm text-zinc-400">
            <li>
              <span className="font-semibold text-zinc-200">1. Create a free account</span>
              <br />
              <Link href="/register" className="text-cyan-400 hover:underline">Register here</Link>
              {' '}— no credit card required.
            </li>
            <li>
              <span className="font-semibold text-zinc-200">2. Verify your email</span>
              <br />
              Click the link we send you. Your API key will appear immediately.
            </li>
            <li>
              <span className="font-semibold text-zinc-200">3. Make your first request</span>
              <pre className="mt-2 overflow-x-auto rounded border border-zinc-800 bg-zinc-900 p-4 text-xs text-cyan-400">
{`curl "https://sec-financial-api-production.up.railway.app/company/AAPL/income-statement" \\
  -H "Authorization: Bearer YOUR_API_KEY"`}
              </pre>
            </li>
          </ol>
        </section>

        {/* Authentication */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Authentication</h2>
          <p className="mb-3 text-sm text-zinc-400">
            Pass your API key in the <code className="rounded bg-zinc-800 px-1 text-cyan-400">Authorization</code> header:
          </p>
          <pre className="overflow-x-auto rounded border border-zinc-800 bg-zinc-900 p-4 text-xs text-cyan-400">
{`Authorization: Bearer sk_live_your_key_here`}
          </pre>
        </section>

        {/* Endpoints */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Endpoints</h2>
          <p className="mb-4 text-sm text-zinc-500">
            Base URL: <code className="text-zinc-300">https://sec-financial-api-production.up.railway.app</code>
          </p>
          <div className="flex flex-col gap-2">
            {ENDPOINTS.map((ep) => (
              <div
                key={ep.path}
                className="flex items-start gap-3 rounded border border-zinc-800 bg-zinc-900 px-4 py-3"
              >
                <span className="mt-0.5 flex-shrink-0 rounded bg-cyan-400/10 px-2 py-0.5 text-xs font-bold text-cyan-400">
                  {ep.method}
                </span>
                <div>
                  <code className="text-xs text-zinc-200">{ep.path}</code>
                  <p className="mt-0.5 text-xs text-zinc-500">{ep.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Tier limits */}
        <section className="mb-12">
          <h2 className="mb-4 text-lg font-bold text-zinc-100">Tier limits</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 text-left text-xs text-zinc-500">
                  <th className="pb-2 pr-4">Tier</th>
                  <th className="pb-2 pr-4">Coverage</th>
                  <th className="pb-2 pr-4">History</th>
                  <th className="pb-2">Rate limit</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-900 text-zinc-400">
                {[
                  ['Free', 'S&P 500', '5 years', '100 req/day'],
                  ['Basic', 'S&P 500', '10 years', '500 req/min'],
                  ['Starter', '2,800+ companies', '10 years', '500 req/min'],
                  ['Growth', '2,800+ companies', 'Full', '1,000 req/min'],
                  ['Pro', '2,800+ companies', 'Full', '3,000 req/min'],
                  ['Enterprise', '2,800+ companies', 'Full', 'Unlimited'],
                ].map(([tier, cov, hist, rate]) => (
                  <tr key={tier}>
                    <td className="py-2 pr-4 font-medium text-zinc-200">{tier}</td>
                    <td className="py-2 pr-4">{cov}</td>
                    <td className="py-2 pr-4">{hist}</td>
                    <td className="py-2">{rate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-5 text-center">
          <p className="mb-3 text-sm text-zinc-400">Ready to get started?</p>
          <Link
            href="/register"
            className="inline-flex rounded bg-cyan-400 px-5 py-2 text-sm font-bold text-black hover:bg-cyan-300 transition-colors"
          >
            Create free account →
          </Link>
        </div>
      </main>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Verify docs page**

Visit http://localhost:3000/docs — check:
- Quick start steps with curl example
- Endpoints table
- Tier limits table
- CTA at bottom

- [ ] **Step 3: Run all tests one final time**

```bash
npx vitest run --reporter=verbose
```

Expected: 11 tests PASS

- [ ] **Step 4: Final commit**

```bash
git add app/docs/
git commit -m "feat: docs page — quick start, endpoints, tier limits"
```

---

## Post-implementation checklist

- [ ] Set `SEC_FRONTEND_URL` in Railway Variables to actual Vercel URL after deploy
- [ ] Test the full registration → verify email → login → dashboard flow end-to-end
- [ ] Test forgot-password → reset email → new password flow
- [ ] Deploy to Vercel: `npx vercel` (or connect GitHub repo in Vercel dashboard)
- [ ] Add `NEXT_PUBLIC_API_URL` as Vercel environment variable
