import type { MetadataRoute } from 'next'

const BASE = 'https://secfinapi.com'

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date()
  return [
    { url: `${BASE}/`,            lastModified: now, changeFrequency: 'weekly',  priority: 1.0 },
    { url: `${BASE}/docs`,        lastModified: now, changeFrequency: 'weekly',  priority: 0.9 },
    { url: `${BASE}/playground`,  lastModified: now, changeFrequency: 'monthly', priority: 0.8 },
    { url: `${BASE}/register`,    lastModified: now, changeFrequency: 'monthly', priority: 0.7 },
    { url: `${BASE}/login`,       lastModified: now, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${BASE}/terms`,       lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
    { url: `${BASE}/privacy`,     lastModified: now, changeFrequency: 'yearly',  priority: 0.3 },
  ]
}
