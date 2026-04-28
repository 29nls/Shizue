import { defineEventHandler, createError, readBody } from 'h3'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * PUT /api/admin/comments/[id]
 * Update comment status
 * 
 * Body:
 *   - action: 'approve' | 'reject' | 'spam'
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

    const commentId = event.context.params?.id
    if (!commentId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Comment ID required',
      })
    }

    const body = await readBody(event)
    const action = body.action

    if (!['approve', 'reject', 'spam'].includes(action)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid action. Use: approve, reject, or spam',
      })
    }

    // Check if comment exists
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    if (!comment) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Comment not found',
      })
    }

    // Update based on action
    let updateData: any = {}

    if (action === 'approve') {
      updateData = {
        approved: true,
        isSpam: false,
      }
    } else if (action === 'reject') {
      updateData = {
        approved: false,
        isSpam: false,
      }
    } else if (action === 'spam') {
      updateData = {
        approved: false,
        isSpam: true,
      }
    }

    const updated = await prisma.comment.update({
      where: { id: commentId },
      data: updateData,
      include: {
        post: {
          select: {
            title: true,
            slug: true,
          },
        },
      },
    })

    return {
      success: true,
      message: `Comment ${action}ed successfully`,
      comment: updated,
    }
  } catch (error) {
    console.error('Error updating comment:', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update comment',
    })
  }
})
