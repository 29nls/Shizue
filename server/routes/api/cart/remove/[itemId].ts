// DELETE /api/cart/remove/[itemId] - Remove item from cart

export default defineEventHandler(async (event) => {
  const itemId = getRouterParam(event, 'itemId')

  if (!itemId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Item ID is required',
    })
  }

  try {
    const cart = getCookie(event, 'cart') || '[]'
    let cartItems = JSON.parse(cart)

    // Remove item from cart
    cartItems = cartItems.filter((item) => item.itemId !== itemId)

    // Update cookie
    setCookie(event, 'cart', JSON.stringify(cartItems), {
      maxAge: 30 * 24 * 60 * 60,
      secure: true,
      httpOnly: false,
      sameSite: 'strict',
    })

    return {
      success: true,
      message: 'Item removed from cart',
      itemCount: cartItems.length,
    }
  } catch (error) {
    console.error('Error removing from cart:', error)
    throw createError({
      statusCode: 400,
      statusMessage: 'Error removing item from cart',
    })
  }
})
