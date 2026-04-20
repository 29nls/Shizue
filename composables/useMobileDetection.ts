export const useMobileDetection = () => {
  const router = useRouter()
  const route = useRoute()

  // Detect if user is on mobile device
  const detectMobileDevice = (): boolean => {
    if (!process.client) return false

    const userAgent = navigator.userAgent || ''
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|phone|pad|touch/i

    // Check user agent
    if (mobileRegex.test(userAgent.toLowerCase())) {
      return true
    }

    // Check touch points
    if (navigator.maxTouchPoints > 1) {
      return true
    }

    // Check screen width
    if (window.innerWidth <= 768) {
      return true
    }

    return false
  }

  // Handle mobile redirect
  const handleMobileRedirect = async () => {
    if (!process.client) return

    const isMobile = detectMobileDevice()
    const isOnMobilePath = route.path.startsWith('/m/')
    const currentPath = route.path

    // Skip special paths
    const skipPaths = ['/api/', '/static/', '/css/', '/js/', '/img/']
    const shouldSkip = skipPaths.some(path => currentPath.startsWith(path))

    if (shouldSkip) return

    // Redirect mobile users to /m/ path
    if (isMobile && !isOnMobilePath && currentPath !== '/') {
      await router.push('/m' + currentPath)
    }

    // Redirect desktop users away from /m/ path
    if (!isMobile && isOnMobilePath) {
      const desktopPath = currentPath.replace('/m', '') || '/'
      await router.push(desktopPath)
    }
  }

  // Initialize
  if (process.client) {
    watch(
      () => route.path,
      async () => {
        await handleMobileRedirect()
      }
    )
  }

  return {
    detectMobileDevice,
    handleMobileRedirect,
  }
}
