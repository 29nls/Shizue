// POST /api/orders/create - Create order from cart

import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

function generateOrderNumber() {
  const timestamp = Date.now()
  const random = Math.floor(Math.random() * 10000)
  return `ORDER-${timestamp}-${random}`
}

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  if (method !== 'POST') {
    throw createError({
      statusCode: 405,
      statusMessage: 'Method not allowed',
    })
  }

  const body = await readBody(event)
  const { items, customerName, customerEmail, customerPhone, shippingAddress, shippingCity } = body

  if (!items || items.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No items in order',
    })
  }

  if (!customerName || !customerEmail || !customerPhone) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Customer info is required',
    })
  }

  try {
    // Calculate order totals
    let subtotal = 0
    const orderItems = []

    // Verify items and get current prices
    for (const cartItem of items) {
      const item = await prisma.item.findUnique({
        where: { id: cartItem.itemId },
      })

      if (!item) {
        throw createError({
          statusCode: 404,
          statusMessage: `Item ${cartItem.itemId} not found`,
        })
      }

      if (item.stock < cartItem.quantity) {
        throw createError({
          statusCode: 400,
          statusMessage: `Insufficient stock for ${item.name}`,
        })
      }

      const itemSubtotal = item.price * cartItem.quantity
      subtotal += itemSubtotal

      orderItems.push({
        itemId: item.id, // Store as snapshot (not FK)
        itemName: item.name,
        itemPrice: item.price,
        quantity: cartItem.quantity,
        subtotal: itemSubtotal,
      })
    }

    // Calculate tax (10% for Indonesia)
    const tax = Math.round(subtotal * 0.1)

    // Calculate shipping (50k flat rate for MVP)
    const shipping = 50000

    // Total
    const total = subtotal + tax + shipping

    // Create order with items
    const order = await prisma.order.create({
      data: {
        orderNumber: generateOrderNumber(),
        customerName,
        customerEmail,
        customerPhone,
        shippingAddress,
        shippingCity,
        subtotal,
        tax,
        shipping,
        discount: 0,
        total,
        status: 'pending', // pending, paid, shipped, delivered
        paymentStatus: 'pending', // pending, paid, failed
        paymentMethod: 'transfer', // Default, will be updated on payment
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    })

    // Reduce stock for each item
    for (const cartItem of items) {
      await prisma.item.update({
        where: { id: cartItem.itemId },
        data: {
          stock: { decrement: cartItem.quantity },
          purchases: { increment: 1 },
        },
      })
    }

    return {
      success: true,
      data: order,
      message: 'Order created successfully',
    }
  } catch (error) {
    if (error.statusCode) throw error
    console.error('Error creating order:', error)
    throw createError({
      statusCode: 400,
      statusMessage: error.message || 'Error creating order',
    })
  }
})
