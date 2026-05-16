// POST /api/cart/add - Add item to cart
// DELETE /api/cart/remove - Remove item from cart
// GET /api/cart - Get cart contents

export default defineEventHandler(async (event) => {
  const method = getMethod(event)

  // Get or create cart session
  // Cart stored in session/localStorage on client side
  // This endpoint returns cart calculations/validation

  if (method === 'GET') {
    // Get cart from session/cookies
    const cart = getCookie(event, 'cart') || '[]'
    let cartItems = []

    try {
      cartItems = JSON.parse(cart)
    } catch {
      cartItems = []
    }

    // Validate and get item details from database
    const prisma = (await import('@prisma/client')).PrismaClient
    const db = new prisma()

    try {
      const itemIds = cartItems.map((item) => item.itemId)
      const items = await db.item.findMany({
        where: { id: { in: itemIds } },
      })

      // Merge item data with cart quantities
      const enrichedCart = cartItems
        .map((cartItem) => {
          const item = items.find((i) => i.id === cartItem.itemId)
          if (!item) return null

          return {
            itemId: item.id,
            name: item.name,
            slug: item.slug,
            price: item.price,
            mainImage: item.mainImage,
            quantity: cartItem.quantity,
            subtotal: item.price * cartItem.quantity,
            stock: item.stock,
            inStock: item.stock > 0,
          }
        })
        .filter((item) => item !== null)

      const total = enrichedCart.reduce((sum, item) => sum + item.subtotal, 0)

      return {
        success: true,
        cart: enrichedCart,
        itemCount: enrichedCart.length,
        total,
      }
    } catch (error) {
      console.error('Error fetching cart:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Error fetching cart',
      })
    } finally {
      await db.$disconnect()
    }
  }

  if (method === 'POST') {
    // Add item to cart
    const body = await readBody(event)
    const { itemId, quantity = 1 } = body

    if (!itemId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Item ID is required',
      })
    }

    try {
      const cart = getCookie(event, 'cart') || '[]'
      let cartItems = JSON.parse(cart)

      // Check if item already in cart
      const existingItem = cartItems.find((item) => item.itemId === itemId)

      if (existingItem) {
        existingItem.quantity += quantity
      } else {
        cartItems.push({ itemId, quantity })
      }

      // Set cookie (max-age: 30 days)
      setCookie(event, 'cart', JSON.stringify(cartItems), {
        maxAge: 30 * 24 * 60 * 60,
        secure: true,
        httpOnly: false,
        sameSite: 'strict',
      })

      return {
        success: true,
        message: 'Item added to cart',
        itemCount: cartItems.length,
      }
    } catch (error) {
      console.error('Error adding to cart:', error)
      throw createError({
        statusCode: 400,
        statusMessage: 'Error adding item to cart',
      })
    }
  }

  throw createError({
    statusCode: 405,
    statusMessage: 'Method not allowed',
  })
})
