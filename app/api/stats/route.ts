// Public stats proxy — fetches /admin/status server-side and returns only
// safe-to-expose fields (no internal config, no backup paths, etc.).
// Used by the landing-page hero counter.

const BASE = process.env.NEXT_PUBLIC_API_URL ?? 'https://sec-financial-api-production.up.railway.app'

export async function GET() {
  const adminKey = process.env.SECBASE_ADMIN_KEY
  if (!adminKey) {
    // No admin key configured — return a fallback so the counter still renders.
    return Response.json({ companies: 10000, facts: 0 })
  }

  try {
    const upstream = await fetch(`${BASE}/admin/status`, {
      headers: { 'X-Admin-Key': adminKey },
      next: { revalidate: 300 }, // cache 5 minutes
    })
    if (!upstream.ok) {
      return Response.json({ companies: 10000, facts: 0 })
    }
    const data = await upstream.json()
    return Response.json(
      {
        companies: data.db?.total_companies ?? 0,
        facts: data.db?.total_facts ?? 0,
      },
      {
        headers: { 'Cache-Control': 'public, s-maxage=300, stale-while-revalidate=600' },
      },
    )
  } catch {
    return Response.json({ companies: 10000, facts: 0 })
  }
}
