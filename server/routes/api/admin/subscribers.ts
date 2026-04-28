import { defineEventHandler, createError, getQuery } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * GET /api/admin/subscribers
 * Fetch newsletter subscribers with counts
 * 
 * Query params:
 *   - verified: true | false | all (default all)
 *   - limit: number (default 50)
 *   - offset: number (default 0)
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
    const verified = query.verified as string
    const limit = parseInt((query.limit as string) || '50', 10)
    const offset = parseInt((query.offset as string) || '0', 10)

    // Build where clause
    let where: any = {}
    if (verified === 'true') {
      where.verified = true
    } else if (verified === 'false') {
      where.verified = false
    }

    // Fetch subscribers
    const subscribers = await prisma.subscriber.findMany({
      where,
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
      skip: offset,
    })

    // Count totals
    const [total, totalVerified, totalUnverified] = await Promise.all([
      prisma.subscriber.count(),
      prisma.subscriber.count({ where: { verified: true } }),
      prisma.subscriber.count({ where: { verified: false } }),
    ])

    return {
      success: true,
      count: total,
      subscribers,
      stats: {
        total,
        verified: totalVerified,
        unverified: totalUnverified,
      },
      pagination: {
        limit,
        offset,
        hasMore: offset + limit < total,
      },
    }
  } catch (error) {
    console.error('Error fetching subscribers:', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch subscribers',
    })
  }
})
