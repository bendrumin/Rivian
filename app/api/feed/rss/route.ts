import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ArticleCategory, Brand } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category') as ArticleCategory | null
    const brand = searchParams.get('brand') as Brand | null
    const type = searchParams.get('type') || 'articles' // articles, support, staging

    let where: any = {}
    
    if (category) where.category = category
    if (brand) where.brand = brand
    if (type === 'staging') where.isStaging = true

    const articles = await prisma.article.findMany({
      where,
      orderBy: { publishedAt: 'desc' },
      take: 50,
      select: {
        id: true,
        title: true,
        excerpt: true,
        content: true,
        url: true,
        source: true,
        category: true,
        brand: true,
        publishedAt: true,
        updatedAt: true
      }
    })

    const rss = generateRSS(articles, { category, brand, type })

    return new NextResponse(rss, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=utf-8',
        'Cache-Control': 'public, max-age=3600' // Cache for 1 hour
      }
    })
  } catch (error) {
    console.error('Failed to generate RSS feed:', error)
    return NextResponse.json(
      { error: 'Failed to generate RSS feed' },
      { status: 500 }
    )
  }
}

function generateRSS(articles: any[], options: any): string {
  const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
  const title = getFeedTitle(options)
  const description = getFeedDescription(options)

  const rssItems = articles.map(article => {
    const pubDate = new Date(article.publishedAt).toUTCString()
    const link = article.url.startsWith('http') ? article.url : `${baseUrl}/articles/${article.id}`
    const content = article.content || article.excerpt || ''
    
    return `
      <item>
        <title><![CDATA[${escapeXml(article.title)}]]></title>
        <description><![CDATA[${escapeXml(content)}]]></description>
        <link>${escapeXml(link)}</link>
        <guid isPermaLink="false">${article.id}</guid>
        <pubDate>${pubDate}</pubDate>
        <source>${escapeXml(article.source)}</source>
        <category>${escapeXml(article.category)}</category>
        <brand>${escapeXml(article.brand)}</brand>
        ${article.isStaging ? '<staging>true</staging>' : ''}
      </item>
    `
  }).join('')

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(title)}</title>
    <description>${escapeXml(description)}</description>
    <link>${baseUrl}</link>
    <atom:link href="${baseUrl}/api/feed/rss" rel="self" type="application/rss+xml"/>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Rivian News Tracker</generator>
    ${rssItems}
  </channel>
</rss>`
}

function getFeedTitle(options: any): string {
  if (options.type === 'staging') return 'Rivian Staging Content Alerts'
  if (options.category) return `Rivian ${options.category} News`
  if (options.brand) return `${options.brand} News & Updates`
  return 'Rivian News & Support Updates'
}

function getFeedDescription(options: any): string {
  if (options.type === 'staging') return 'Exclusive previews of unreleased Rivian content'
  if (options.category) return `Latest ${options.category.toLowerCase()} about Rivian and Scout`
  if (options.brand) return `News and updates about ${options.brand} vehicles`
  return 'Latest news, rumors, and support updates for Rivian and Scout vehicles'
}

function escapeXml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
