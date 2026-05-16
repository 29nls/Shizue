// POST /api/items/:itemId/reviews/create - Create review
// GET /api/items/:itemId/reviews - Get reviews
// PATCH /api/reviews/:reviewId - Approve/reject review (admin)
// DELETE /api/reviews/:reviewId - Delete review

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const path = getRouterParams(event)

  if (method === 'POST') {
    // Create review
    const body = await readBody(event)
    const { itemId, author, authorEmail, rating, title, content, imageUrl } = body

    if (!itemId || !author || !rating || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Required fields missing',
      })
    }

    try {
      const review = await prisma.review.create({
        data: {
          itemId,
          author,
          authorEmail: authorEmail || '',
          rating: Math.min(Math.max(rating, 1), 5),
          title: title || '',
          content,
          imageUrl: imageUrl || null,
          isApproved: false, // Requires admin approval
          isSpam: false,
        },
      })

      return {
        success: true,
        data: review,
        message: 'Review submitted, awaiting approval',
      }
    } catch (error) {
      console.error('Error creating review:', error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Error creating review',
      })
    }
  }

  if (method === 'GET') {
    // Get reviews for item
    try {
      const query = getQuery(event)
      const skip = parseInt(query.skip as string) || 0
      const take = Math.min(parseInt(query.take as string) || 10, 100)

      const [reviews, total] = await Promise.all([
        prisma.review.findMany({
          where: {
            isApproved: true, // Only show approved reviews
            isSpam: false,
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.review.count({
          where: {
            isApproved: true,
            isSpam: false,
          },
        }),
      ])

      return {
        success: true,
        data: reviews,
        total,
        skip,
        take,
      }
    } catch (error) {
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching reviews',
      })
    }
  }

  if (method === 'PATCH') {
    // Approve/reject review (admin)
    const reviewId = path.reviewId
    if (!reviewId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Review ID is required',
      })
    }

    const body = await readBody(event)
    const { isApproved, isSpam } = body

    try {
      const review = await prisma.review.update({
        where: { id: reviewId },
        data: {
          isApproved: isApproved !== undefined ? isApproved : undefined,
          isSpam: isSpam !== undefined ? isSpam : undefined,
        },
      })

      return {
        success: true,
        data: review,
        message: 'Review updated',
      }
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Error updating review',
      })
    }
  }

  if (method === 'DELETE') {
    // Delete review
    const reviewId = path.reviewId
    if (!reviewId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Review ID is required',
      })
    }

    try {
      await prisma.review.delete({
        where: { id: reviewId },
      })

      return {
        success: true,
        message: 'Review deleted',
      }
    } catch (error) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Error deleting review',
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
