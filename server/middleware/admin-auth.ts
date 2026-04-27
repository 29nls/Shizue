export default defineEventHandler((event) => {
  const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
  const authHeader = getHeader(event, 'authorization')

  if (!authHeader || authHeader !== `Bearer ${adminPassword}`) {
    return sendError(event, createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    }))
  }
})
