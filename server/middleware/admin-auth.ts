export default defineEventHandler((event) => {
  const url = event.node.req.url || ''
  
  // Only apply auth to /admin routes
  if (!url.startsWith('/admin')) {
    return
  }

  // Allow login page to bypass authentication
  if (url.includes('/admin/login')) {
    return
  }

  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    }))
  }
})
