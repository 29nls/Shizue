// DELETE /api/wishlist/remove/[itemId] - Remove from wishlist

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const itemId = getRouterParam(event, 'itemId')
  const userEmail = getCookie(event, 'userEmail') || 'guest@example.com'

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Item ID is required',
    })
  }

  try {
    const wishlist = await prisma.wishlist.deleteMany({
      where: { itemId, userEmail },
    })

    if (wishlist.count === 0) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Item not in wishlist',
      })
    }

    return {
      success: true,
      message: 'Removed from wishlist',
    }
  } catch (error) {
    if (error.statusCode) throw error
    console.error('Error removing from wishlist:', error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Error removing from wishlist',
    })
  }
})
