// GET /api/admin/reviews - List all reviews with filters

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const skip = parseInt(query.skip as string) || 0
  const take = Math.min(parseInt(query.take as string) || 10, 100)
  const status = (query.status as string) || ''
  const search = (query.search as string) || ''

  try {
    // Build where clause
    const where = {}

    if (status === 'pending') {
      where.isApproved = false
      where.isSpam = false
    } else if (status === 'approved') {
      where.isApproved = true
    } else if (status === 'spam') {
      where.isSpam = true
    }

    if (search) {
      where.OR = [
        { author: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
      ]
    }

    const [reviews, total] = await Promise.all([
      prisma.review.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.review.count({ where }),
    ])

    return {
      success: true,
      data: reviews,
      total,
      skip,
      take,
    }
  } catch (error) {
    console.error('Error fetching reviews:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching reviews',
    })
  }
})
