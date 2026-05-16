// GET /api/wishlist - Get user's wishlist items
// POST /api/wishlist/add - Add item to wishlist
// DELETE /api/wishlist/remove/[itemId] - Remove from wishlist

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // Get user email from session/auth header
  // For MVP, use email from query or session
  const userEmail = getCookie(event, 'userEmail') || 'guest@example.com'

  if (method === 'GET') {
    try {
      const wishlist = await prisma.wishlist.findMany({
        where: { userEmail },
        include: {
          item: {
            select: {
              id: true,
              name: true,
              slug: true,
              price: true,
              originalPrice: true,
              discount: true,
              mainImage: true,
              rarity: true,
              stock: true,
              rating: true,
              reviewCount: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      })

      return {
        success: true,
        data: wishlist,
        count: wishlist.length,
      }
    } catch (error) {
      console.error('Error fetching wishlist:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching wishlist',
      })
    }
  }

  if (method === 'POST') {
    const body = await readBody(event)
    const { itemId } = body

    if (!itemId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Item ID is required',
      })
    }

    try {
      // Check if already in wishlist
      const existing = await prisma.wishlist.findFirst({
        where: { itemId, userEmail },
      })

      if (existing) {
        return {
          success: true,
          message: 'Item already in wishlist',
          alreadyExists: true,
        }
      }

      const wishlist = await prisma.wishlist.create({
        data: { itemId, userEmail },
        include: {
          item: {
            select: {
              id: true,
              name: true,
              price: true,
              mainImage: true,
            },
          },
        },
      })

      return {
        success: true,
        data: wishlist,
        message: 'Added to wishlist',
      }
    } catch (error) {
      console.error('Error adding to wishlist:', error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Error adding to wishlist',
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
