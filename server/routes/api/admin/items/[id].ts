// GET/PATCH/DELETE /api/admin/items/[id]
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const itemId = getRouterParam(event, 'id')
  const method = getMethod(event)

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Item ID is required',
    })
  }

  // GET - Fetch single item
  if (method === 'GET') {
    try {
      const item = await prisma.item.findUnique({
        where: { id: itemId },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      })

      if (!item) {
        throw createError({
          statusCode: 404,
          statusMessage: 'Item not found',
        })
      }

      return {
        success: true,
        data: item,
      }
    } catch (error) {
      if (error.statusCode) throw error
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching item',
      })
    }
  }

  // PATCH - Update item
  if (method === 'PATCH') {
    const body = await readBody(event)

    try {
      const item = await prisma.item.update({
        where: { id: itemId },
        data: {
          name: body.name,
          slug: body.slug,
          description: body.description,
          shortDescription: body.shortDescription,
          categoryId: body.categoryId,
          price: body.price,
          originalPrice: body.originalPrice,
          discount: body.discount,
          stock: body.stock,
          rarity: body.rarity,
          levelRequirement: body.levelRequirement,
          classRequirement: body.classRequirement,
          mainImage: body.mainImage,
          galleryImages: body.galleryImages,
          specs: body.specs,
          isActive: body.isActive,
          isDraft: body.isDraft,
          isOnSale: body.isOnSale,
          isFeatured: body.isFeatured,
        },
        include: {
          category: {
            select: { id: true, name: true },
          },
        },
      })

      return {
        success: true,
        data: item,
        message: 'Item updated successfully',
      }
    } catch (error) {
      console.error('Error updating item:', error)
      throw createError({
        statusCode: 400,
        statusMessage: error.message || 'Error updating item',
      })
    }
  }

  // DELETE - Delete item
  if (method === 'DELETE') {
    try {
      await prisma.item.delete({
        where: { id: itemId },
      })

      return {
        success: true,
        message: 'Item deleted successfully',
      }
    } catch (error) {
      console.error('Error deleting item:', error)
      throw createError({
        statusCode: 400,
        statusMessage: error.message || 'Error deleting item',
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
