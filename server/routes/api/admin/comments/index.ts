import { defineEventHandler, createError, getQuery } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/admin/comments - Fetch comments with filters
 * Query params:
 *   - status: 'pending' | 'approved' | 'spam' | 'all'
 *   - limit: number (default 50)
 *   - offset: number (default 0)
 *   - search: search term
 */
export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    const auth = event.node.req.headers.authorization
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Unauthorized',
      })
    }

    const token = auth.replace('Bearer ', '')
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'

    if (token !== adminPassword) {
      throw createError({
        statusCode: 401,
        statusMessage: 'Invalid authentication token',
      })
    }

    // Get query parameters
    const query = getQuery(event)
    const status = (query.status as string) || 'pending'
    const limit = parseInt((query.limit as string) || '50', 10)
    const offset = parseInt((query.offset as string) || '0', 10)
    const search = (query.search as string) || ''

    // Build where clause
    let where: any = {}

    if (status === 'pending') {
      where.approved = false
      where.isSpam = false
    } else if (status === 'approved') {
      where.approved = true
    } else if (status === 'spam') {
      where.isSpam = true
    }
    // else 'all' - no filter

    // Add search filter if provided
    if (search) {
      where.OR = [
        { author: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { content: { contains: search, mode: 'insensitive' } },
      ]
    }

    // Fetch comments with post info
    const comments = await prisma.comment.findMany({
      where,
      include: {
        post: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // Count totals
    const [totalPending, totalApproved, totalSpam, total] = await Promise.all([
      prisma.comment.count({
        where: {
          approved: false,
          isSpam: false,
        },
      }),
      prisma.comment.count({
        where: {
          approved: true,
        },
      }),
      prisma.comment.count({
        where: {
          isSpam: true,
        },
      }),
      prisma.comment.count(),
    ])

    return {
      success: true,
      comments,
      stats: {
        total,
        pending: totalPending,
        approved: totalApproved,
        spam: totalSpam,
      },
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    }
  } catch (error) {
    console.error('Error fetching comments:', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch comments',
    })
  }
})
