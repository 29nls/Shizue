/**
 * GET /api/categories - Fetch all item categories
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    // Fetch all categories with item count
    const categories = await prisma.category.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        description: true,
        image: true,
        sortOrder: true,
        _count: {
          select: { items: true },
        },
      },
      orderBy: { sortOrder: 'asc' },
    })

    // Transform to include item count
    const categoriesWithCount = categories.map((cat: any) => ({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      description: cat.description,
      image: cat.image,
      sortOrder: cat.sortOrder,
      itemCount: cat._count.items,
    }))

    return {
      success: true,
      data: categoriesWithCount,
    }
  } catch (error) {
    console.error('[API] Error fetching categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch categories',
    })
  }
}
})
