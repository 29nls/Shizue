/**
 * GET /api/items - Fetch items with filtering and pagination
 * Query params:
 *   - page: number (default 1)
 *   - limit: number (default 12)
 *   - categoryId: string (filter by category ID)
 *   - rarity: string (filter by rarity)
 *   - search: string (search by name/description)
 *   - sort: string (newest, price-asc, price-desc, popular, rating)
 *   - minPrice: number
 *   - maxPrice: number
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const query = getQuery(event)
    
    // Pagination
    const page = parseInt(query.page as string) || 1
    const limit = Math.min(parseInt(query.limit as string) || 12, 100) // Max 100 per page
    const skip = (page - 1) * limit
    
    // Build where clause for filtering
    const where: any = {
      isActive: true,
      isDraft: false,
    }
    
    // Category filter
    if (query.categoryId) {
      where.categoryId = query.categoryId
    }
    
    // Rarity filter
    if (query.rarity) {
      where.rarity = query.rarity
    }
    
    // Price range filter
    const minPrice = query.minPrice ? parseFloat(query.minPrice as string) : undefined
    const maxPrice = query.maxPrice ? parseFloat(query.maxPrice as string) : undefined
    if (minPrice !== undefined || maxPrice !== undefined) {
      where.price = {}
      if (minPrice !== undefined) where.price.gte = minPrice
      if (maxPrice !== undefined) where.price.lte = maxPrice
    }
    
    // Search filter (name or description)
    if (query.search) {
      where.OR = [
        { name: { contains: query.search as string, mode: 'insensitive' } },
        { description: { contains: query.search as string, mode: 'insensitive' } },
      ]
    }
    
    // Sorting
    let orderBy: any = { createdAt: 'desc' } // Default: newest first
    const sort = query.sort as string
    if (sort === 'price-asc') orderBy = { price: 'asc' }
    else if (sort === 'price-desc') orderBy = { price: 'desc' }
    else if (sort === 'popular') orderBy = { views: 'desc' }
    else if (sort === 'rating') orderBy = { rating: 'desc' }
    
    // Fetch total count for pagination
    const total = await prisma.item.count({ where })
    
    // Fetch items
    const items = await prisma.item.findMany({
      where,
      orderBy,
      skip,
      take: limit,
      select: {
        id: true,
        name: true,
        slug: true,
        shortDescription: true,
        price: true,
        originalPrice: true,
        discount: true,
        mainImage: true,
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        rarity: true,
        stock: true,
        rating: true,
        reviewCount: true,
        isOnSale: true,
        isFeatured: true,
      },
    })
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit)
    
    return {
      success: true,
      data: items,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      },
    }
  } catch (error) {
    console.error('[API] Error fetching items:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch items',
    })
  }
})
