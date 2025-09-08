import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { ArticleCategory, Brand } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category') as ArticleCategory | null
    const brand = searchParams.get('brand') as Brand | null
    const search = searchParams.get('search')
    const isStaging = searchParams.get('isStaging') === 'true'
    const sortBy = searchParams.get('sortBy') || 'publishedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (category) where.category = category
    if (brand) where.brand = brand
    if (isStaging !== null) where.isStaging = isStaging
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } }
      ]
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [articles, total] = await Promise.all([
      prisma.article.findMany({
        where,
        orderBy,
        skip,
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
      }),
      prisma.article.count({ where })
    ])

    return NextResponse.json({
      articles,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Failed to get articles:', error)
    return NextResponse.json(
      { error: 'Failed to get articles' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const articleData = await request.json()

    const article = await prisma.article.create({
      data: {
        title: articleData.title,
        content: articleData.content,
        excerpt: articleData.excerpt,
        url: articleData.url,
        source: articleData.source,
        category: articleData.category,
        brand: articleData.brand,
        tags: articleData.tags || [],
        isStaging: articleData.isStaging || false,
        publishedAt: new Date(articleData.publishedAt),
        metaTitle: articleData.metaTitle,
        metaDescription: articleData.metaDescription,
        featuredImage: articleData.featuredImage
      }
    })

    return NextResponse.json(article, { status: 201 })
  } catch (error) {
    console.error('Failed to create article:', error)
    return NextResponse.json(
      { error: 'Failed to create article' },
      { status: 500 }
    )
  }
}
