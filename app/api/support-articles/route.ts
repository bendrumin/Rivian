import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { Brand } from '@prisma/client'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const brand = searchParams.get('brand') as Brand | null
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const isStaging = searchParams.get('isStaging') === 'true'
    const hasChanges = searchParams.get('hasChanges') === 'true'
    const sortBy = searchParams.get('sortBy') || 'lastUpdated'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    const skip = (page - 1) * limit

    // Build where clause
    const where: any = {}
    
    if (brand) where.brand = brand
    if (category) where.category = category
    if (isStaging !== null) where.isStaging = isStaging
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } }
      ]
    }
    if (hasChanges) {
      where.changes = { some: {} }
    }

    // Build orderBy clause
    const orderBy: any = {}
    orderBy[sortBy] = sortOrder

    const [articles, total] = await Promise.all([
      prisma.supportArticle.findMany({
        where,
        orderBy,
        skip,
        take: limit,
        include: {
          changes: {
            orderBy: { detectedAt: 'desc' },
            take: 5
          }
        }
      }),
      prisma.supportArticle.count({ where })
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
    console.error('Failed to get support articles:', error)
    return NextResponse.json(
      { error: 'Failed to get support articles' },
      { status: 500 }
    )
  }
}
