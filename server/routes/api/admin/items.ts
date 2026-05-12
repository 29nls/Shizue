// GET /api/admin/items - List all items with pagination, search, filtering
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method === 'GET') {
    // Get query parameters
    const query = getQuery(event)
    const skip = parseInt(query.skip as string) || 0
    const take = Math.min(parseInt(query.take as string) || 10, 100)
    const search = (query.search as string) || ''
    const categoryId = (query.categoryId as string) || ''
    const status = (query.status as string) || ''

    try {
      // Build where clause
      const where = {}

      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { slug: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ]
      }

      if (categoryId) {
        where.categoryId = categoryId
      }

      if (status === 'active') {
        where.isActive = true
        where.isDraft = false
      } else if (status === 'draft') {
        where.isDraft = true
      } else if (status === 'inactive') {
        where.isActive = false
      }

      // Fetch items with pagination
      const [items, total] = await Promise.all([
        prisma.item.findMany({
          where,
          include: {
            category: {
              select: { id: true, name: true },
            },
          },
          skip,
          take,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.item.count({ where }),
      ])

      return {
        success: true,
        data: items,
        total,
        skip,
        take,
      }
    } catch (error) {
      console.error('Error fetching items:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching items',
      })
    }
  }

  if (method === 'POST') {
    // Create new item
    const body = await readBody(event)

    try {
      const item = await prisma.item.create({
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
          isActive: body.isActive !== false,
          isDraft: body.isDraft === true,
          isOnSale: body.isOnSale === true,
          isFeatured: body.isFeatured === true,
          rating: 0,
          reviewCount: 0,
          views: 0,
          purchases: 0,
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
        message: 'Item created successfully',
      }
    } catch (error) {
      console.error('Error creating item:', error)
      throw createError({
        statusCode: 400,
        statusMessage: error.message || 'Error creating item',
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
