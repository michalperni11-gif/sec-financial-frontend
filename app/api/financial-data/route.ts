import { NextRequest } from 'next/server'

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://sec-financial-api-production.up.railway.app'

const VALID_ENDPOINTS = ['income-statement', 'balance-sheet', 'cash-flow', 'metrics', 'info'] as const
const TICKER_RE = /^[A-Z0-9.\-]{1,10}$/

export async function GET(req: NextRequest) {
  const key = process.env.SECBASE_DEMO_KEY
  if (!key) {
    return Response.json({ error: 'SECBASE_DEMO_KEY not configured' }, { status: 503 })
  }

  const { searchParams } = req.nextUrl
  const ticker   = (searchParams.get('ticker')   ?? 'AAPL').toUpperCase()
  const endpoint = searchParams.get('endpoint') ?? 'income-statement'

  // Input validation — prevent SSRF / unexpected paths
  if (!TICKER_RE.test(ticker) || !VALID_ENDPOINTS.includes(endpoint as typeof VALID_ENDPOINTS[number])) {
    return Response.json({ error: 'Invalid parameters' }, { status: 400 })
  }

  try {
    const upstream = await fetch(`${BASE}/v1/company/${ticker}/${endpoint}`, {
      headers: { 'X-API-Key': key },
      next: { revalidate: 86400 }, // cache 24 h on the server
    })

    if (!upstream.ok) {
      const body = await upstream.text()
      return Response.json({ error: `Upstream ${upstream.status}`, detail: body }, { status: upstream.status })
    }

    const data = await upstream.json()
    return Response.json(data, {
      headers: { 'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600' },
    })
  } catch (err) {
    return Response.json({ error: 'Failed to reach upstream API' }, { status: 502 })
  }
}
