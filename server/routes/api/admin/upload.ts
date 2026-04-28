import { defineEventHandler, createError, readMultipartFormData, H3Event } from 'h3'
import { PrismaClient } from '@prisma/client'
import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'

const prisma = new PrismaClient()

/**
 * Image Upload API Endpoint
 * POST /api/admin/upload
 * 
 * Handles image uploads with optimization and storage
 * Returns: { success: boolean, url: string, image: object }
 */

const UPLOAD_DIR = process.env.UPLOAD_DIR || './public/uploads'
const MAX_SIZE = parseInt(process.env.MAX_IMAGE_SIZE || '5242880') // 5MB default
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

async function ensureUploadDir() {
  try {
    await fs.access(UPLOAD_DIR)
  } catch {
    await fs.mkdir(UPLOAD_DIR, { recursive: true })
  }
}

async function validateAndOptimizeImage(
  buffer: Buffer,
  filename: string
): Promise<{ buffer: Buffer; width: number; height: number; format: string }> {
  try {
    const image = sharp(buffer)
    const metadata = await image.metadata()

    if (!metadata.width || !metadata.height) {
      throw new Error('Invalid image dimensions')
    }

    // Resize if too large (max 2000px width)
    let optimized = image
    if (metadata.width > 2000) {
      optimized = optimized.resize(2000, 1500, {
        fit: 'inside',
        withoutEnlargement: true,
      })
    }

    // Optimize quality
    const format = metadata.format || 'webp'
    let result: Buffer

    if (format === 'jpeg') {
      result = await optimized.jpeg({ quality: 80, progressive: true }).toBuffer()
    } else if (format === 'png') {
      result = await optimized.png({ compressionLevel: 9 }).toBuffer()
    } else if (format === 'gif') {
      result = await optimized.gif().toBuffer()
    } else {
      result = await optimized.webp({ quality: 80 }).toBuffer()
    }

    return {
      buffer: result,
      width: metadata.width,
      height: metadata.height,
      format: format || 'webp',
    }
  } catch (error) {
    throw new Error(`Image optimization failed: ${error}`)
  }
}

export default defineEventHandler(async (event: H3Event) => {
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

    // Get the multipart form data
    const form = await readMultipartFormData(event)
    if (!form) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file uploaded',
      })
    }

    const fileField = form.find(f => f.name === 'file')
    if (!fileField || !fileField.data) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No file field found',
      })
    }

    const filename = fileField.filename || 'image'
    const mimeType = fileField.type || 'image/jpeg'
    const fileBuffer = fileField.data

    // Validate file
    if (fileBuffer.length > MAX_SIZE) {
      throw createError({
        statusCode: 413,
        statusMessage: `File too large. Max size: ${MAX_SIZE / 1024 / 1024}MB`,
      })
    }

    if (!ALLOWED_TYPES.includes(mimeType)) {
      throw createError({
        statusCode: 415,
        statusMessage: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF',
      })
    }

    // Ensure upload directory exists
    await ensureUploadDir()

    // Optimize image
    const { buffer, width, height, format } = await validateAndOptimizeImage(
      fileBuffer,
      filename
    )

    // Generate unique filename
    const ext = format === 'webp' ? 'webp' : format.substring(0, 3)
    const uniqueName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`
    const filepath = path.join(UPLOAD_DIR, uniqueName)

    // Save file
    await fs.writeFile(filepath, buffer)

    // Save to database
    const image = await prisma.image.create({
      data: {
        filename: uniqueName,
        url: `/uploads/${uniqueName}`,
        size: buffer.length,
        width,
        height,
        alt: '',
      },
    })

    return {
      success: true,
      message: 'Image uploaded successfully',
      url: image.url,
      image: {
        id: image.id,
        filename: image.filename,
        url: image.url,
        size: image.size,
        width: image.width,
        height: image.height,
      },
    }
  } catch (error) {
    console.error('Image upload error:', error)

    if (error instanceof Error && 'statusCode' in error) {
      throw error
    }

    throw createError({
      statusCode: 500,
      statusMessage: error instanceof Error ? error.message : 'Failed to upload image',
    })
  }
})
