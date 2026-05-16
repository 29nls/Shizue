// GET /api/orders - List user's orders
// GET /api/orders/[orderId] - Get single order details

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const orderId = getRouterParam(event, 'orderId')

  if (method === 'GET') {
    // Get user email from session
    const userEmail = getCookie(event, 'userEmail') || ''

    if (orderId) {
      // Get single order
      try {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
          include: { items: true },
        })

        if (!order) {
          throw createError({
            statusCode: 404,
            statusMessage: 'Order not found',
          })
        }

        // If user email provided, verify ownership
        if (userEmail && order.customerEmail !== userEmail) {
          throw createError({
            statusCode: 403,
            statusMessage: 'Not authorized to view this order',
          })
        }

        return {
          success: true,
          data: order,
        }
      } catch (error) {
        if (error.statusCode) throw error
        throw createError({
          statusCode: 500,
          statusMessage: 'Error fetching order',
        })
      }
    } else {
      // List all orders for user or admin view
      const query = getQuery(event)
      const skip = parseInt(query.skip as string) || 0
      const take = Math.min(parseInt(query.take as string) || 10, 100)

      try {
        const where = userEmail ? { customerEmail: userEmail } : {}

        const [orders, total] = await Promise.all([
          prisma.order.findMany({
            where,
            include: { items: true },
            skip,
            take,
            orderBy: { createdAt: 'desc' },
          }),
          prisma.order.count({ where }),
        ])

        return {
          success: true,
          data: orders,
          total,
          skip,
          take,
        }
      } catch (error) {
        throw createError({
          statusCode: 500,
          statusMessage: 'Error fetching orders',
        })
      }
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
