import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const type = searchParams.get('type') || 'all' // all, articles, support
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query) {
      return NextResponse.json(
        { error: 'Search query is required' },
        { status: 400 }
      )
    }

    const results: any = {
      query,
      articles: [],
      supportArticles: [],
      total: 0
    }

    // Search articles
    if (type === 'all' || type === 'articles') {
      const articles = await prisma.article.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } },
            { excerpt: { contains: query, mode: 'insensitive' } },
            { tags: { has: query } }
          ]
        },
        orderBy: { publishedAt: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          excerpt: true,
          url: true,
          source: true,
          category: true,
          brand: true,
          tags: true,
          isStaging: true,
          publishedAt: true,
          viewCount: true
        }
      })
      results.articles = articles
    }

    // Search support articles
    if (type === 'all' || type === 'support') {
      const supportArticles = await prisma.supportArticle.findMany({
        where: {
          OR: [
            { title: { contains: query, mode: 'insensitive' } },
            { content: { contains: query, mode: 'insensitive' } }
          ]
        },
        orderBy: { lastUpdated: 'desc' },
        take: limit,
        select: {
          id: true,
          title: true,
          url: true,
          brand: true,
          category: true,
          isStaging: true,
          lastUpdated: true
        }
      })
      results.supportArticles = supportArticles
    }

    results.total = results.articles.length + results.supportArticles.length

    return NextResponse.json(results)
  } catch (error) {
    console.error('Search failed:', error)
    return NextResponse.json(
      { error: 'Search failed' },
      { status: 500 }
    )
  }
}
