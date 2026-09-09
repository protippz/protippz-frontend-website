import { NextResponse } from 'next/server'

// ─── Types ────────────────────────────────────────────────────────────────────

export interface TickerHeadline {
  id: number
  text: string
  description: string
  emoji: string
  badge: string
  badgeType: 'womens' | 'hbcu' | 'default'
  imageUrl?: string
  link?: string
  publishedAt: string
}

interface ESPNArticle {
  id: number
  headline: string
  description?: string
  published: string
  links?: { web?: { href?: string } }
  images?: Array<{ url: string; type: string }>
  categories?: Array<{ description?: string }>
}

interface ESPNResponse {
  articles: ESPNArticle[]
  header?: string
}

// ─── Fetch helpers ────────────────────────────────────────────────────────────

async function fetchESPN(url: string): Promise<ESPNResponse | null> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 300 }, // cache 5 min
      headers: { 'Accept': 'application/json' },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// ─── Sport configs ────────────────────────────────────────────────────────────

const SPORT_CONFIGS = [
  {
    url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/womens-college-basketball/news',
    emoji: '🏀',
    badge: 'WBB',
    badgeType: 'womens' as const,
    limit: 4,
  },
  {
    url: 'https://site.api.espn.com/apis/site/v2/sports/basketball/wnba/news',
    emoji: '🏀',
    badge: 'WNBA',
    badgeType: 'womens' as const,
    limit: 3,
  },
  {
    url: 'https://site.api.espn.com/apis/site/v2/sports/soccer/usa.nwsl/news',
    emoji: '⚽',
    badge: 'NWSL',
    badgeType: 'womens' as const,
    limit: 3,
  },
  {
    url: 'https://site.api.espn.com/apis/site/v2/sports/football/college-football/news',
    emoji: '🏈',
    badge: 'HBCU',
    badgeType: 'hbcu' as const,
    limit: 2,
  },
  {
    url: 'https://site.api.espn.com/apis/site/v2/sports/tennis/news',
    emoji: '🎾',
    badge: 'TENNIS',
    badgeType: 'womens' as const,
    limit: 2,
  },
]

// ─── Fallback headlines ───────────────────────────────────────────────────────

function getFallbackHeadlines(): TickerHeadline[] {
  return [
    { id: 1, text: "Women's March Madness 2026: Sweet 16 underway with top seeds in action", description: '', emoji: '🏀', badge: 'WBB', badgeType: 'womens', publishedAt: new Date().toISOString() },
    { id: 2, text: 'WNBA Draft 2026: Top prospects set to go in first round', description: '', emoji: '🏀', badge: 'WNBA', badgeType: 'womens', publishedAt: new Date().toISOString() },
    { id: 3, text: 'NWSL preseason: Teams finalise rosters ahead of new season', description: '', emoji: '⚽', badge: 'NWSL', badgeType: 'womens', publishedAt: new Date().toISOString() },
    { id: 4, text: 'HBCU football spring camps open across the nation', description: '', emoji: '🏈', badge: 'HBCU', badgeType: 'hbcu', publishedAt: new Date().toISOString() },
    { id: 5, text: 'WTA rankings update: Top players gear up for clay season', description: '', emoji: '🎾', badge: 'TENNIS', badgeType: 'womens', publishedAt: new Date().toISOString() },
  ]
}

// ─── Route handler ────────────────────────────────────────────────────────────

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const limitParam = parseInt(searchParams.get('limit') || '12', 10)
    const categoryParam = searchParams.get('category')?.toUpperCase() || 'ALL'
    const searchQueryParam = searchParams.get('search')?.trim().toLowerCase() || ''

    // Calculate per-sport limit based on total limit requested (min 2, max 15 per sport)
    const maxPerSport = Math.max(2, Math.min(15, Math.ceil(limitParam / SPORT_CONFIGS.length)))

    const filteredConfigs = categoryParam === 'ALL'
      ? SPORT_CONFIGS
      : SPORT_CONFIGS.filter((c) => c.badge === categoryParam)

    const configsToFetch = filteredConfigs.length > 0 ? filteredConfigs : SPORT_CONFIGS

    const results = await Promise.allSettled(
      configsToFetch.map(async (config) => {
        const fetchLimit = categoryParam !== 'ALL' ? Math.min(limitParam, 20) : maxPerSport
        const data = await fetchESPN(`${config.url}?limit=${fetchLimit}`)
        if (!data?.articles?.length) return []

        return data.articles.slice(0, fetchLimit).map((article): TickerHeadline => ({
          id: article.id,
          text: article.headline,
          description: article.description ?? '',
          emoji: config.emoji,
          badge: config.badge,
          badgeType: config.badgeType,
          imageUrl: article.images?.find(img => img.type === 'header')?.url || article.images?.[0]?.url,
          link: article.links?.web?.href,
          publishedAt: article.published,
        }))
      })
    )

    let headlines: TickerHeadline[] = results
      .filter((r): r is PromiseFulfilledResult<TickerHeadline[]> => r.status === 'fulfilled')
      .flatMap(r => r.value)

    if (searchQueryParam) {
      headlines = headlines.filter(
        (h) =>
          h.text.toLowerCase().includes(searchQueryParam) ||
          h.description.toLowerCase().includes(searchQueryParam) ||
          h.badge.toLowerCase().includes(searchQueryParam)
      )
    }

    headlines = headlines.slice(0, limitParam)

    return NextResponse.json({
      success: true,
      headlines: headlines.length > 0 ? headlines : (searchQueryParam ? [] : getFallbackHeadlines()),
      lastUpdated: new Date().toISOString(),
      count: headlines.length,
      limit: limitParam,
    })
  } catch {
    return NextResponse.json({
      success: true,
      headlines: getFallbackHeadlines(),
      lastUpdated: new Date().toISOString(),
      count: 5,
      fallback: true,
    })
  }
}
