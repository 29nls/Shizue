import { defineEventHandler, readBody, createError } from 'h3'
import { PrismaClient } from '@prisma/client'
import slugify from 'slugify'

const prisma = new PrismaClient()

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

    // Read request body
    const body = await readBody(event)

    // Validate required fields
    if (!body.title || !body.content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required',
      })
    }

    // Generate slug
    const slug = slugify(body.title, {
      lower: true,
      strict: true,
    }) + '-' + Date.now().toString().slice(-6)

    // Check if slug already exists
    const existingPost = await prisma.post.findUnique({
      where: { slug },
    })

    if (existingPost) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A post with this slug already exists',
      })
    }

    // Create post
    const post = await prisma.post.create({
      data: {
        title: body.title,
        excerpt: body.excerpt || body.content.substring(0, 150).replace(/<[^>]*>/g, ''),
        slug,
        content: body.content,
        categories: body.categories ? JSON.stringify(body.categories) : '[]',
        tags: body.tags ? JSON.stringify(body.tags) : '[]',
        author: body.author || 'Admin',
        coverImage: body.coverImage || null,
        published: body.published || false,
        publishedAt: body.published ? new Date() : null,
      },
    })

    // Return success response
    return {
      success: true,
      message: 'Post created successfully',
      slug: post.slug,
      post,
    }
  } catch (error) {
    console.error('Error creating post:', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create post',
    })
  }
})
