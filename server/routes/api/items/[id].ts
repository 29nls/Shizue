/**
 * GET /api/items/[id] - Fetch single item detail
 */

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')
    
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Item ID is required',
      })
    }
    
    // Fetch item with all details and reviews
    const item = await prisma.item.findUnique({
      where: { id },
      include: {
        reviews: {
          select: {
            id: true,
            rating: true,
            title: true,
            content: true,
            author: true,
            createdAt: true,
            helpful: true,
            unhelpful: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 5, // Latest 5 reviews
        },
      },
    })
    
    if (!item) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Item not found',
      })
    }
    
    // Check if published
    if (!item.isActive || item.isDraft) {
      // Only admin can view draft/inactive items
      const user = await requireAuth(event) // You'll need to implement this auth function
      if (user.role !== 'admin') {
        throw createError({
          statusCode: 403,
          statusMessage: 'This item is not available',
        })
      }
    }
    
    // Increment view count
    await prisma.item.update({
      where: { id },
      data: { views: { increment: 1 } },
    })
    
    return {
      success: true,
      data: item,
    }
  } catch (error) {
    console.error('[API] Error fetching item:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch item',
    })
  }
})
