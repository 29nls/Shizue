/**
 * Mobile Detection Middleware
 * Automatically redirects mobile users to /m/ routes
 */

/**
 * Simple user-agent based mobile detection
 */
function isMobileDevice(userAgent) {
  if (!userAgent) return false;
  
  const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|phone|pad|touch/i;
  return mobileRegex.test(userAgent);
}

module.exports = (req, res, next) => {
  const userAgent = req.get('user-agent') || '';
  const isMobile = isMobileDevice(userAgent);
  
  // Store mobile status in request
  req.isMobile = isMobile;
  
  // Check current path
  const currentPath = req.path;
  const isOnMobilePath = currentPath.startsWith('/m/');
  
  // Special endpoints that don't need redirect
  const skipRedirectPaths = ['/api/', '/static/', '/css/', '/js/', '/img/', '/favicon.ico'];
  const shouldSkip = skipRedirectPaths.some(path => currentPath.startsWith(path));
  
  if (shouldSkip) {
    return next();
  }
  
  // Redirect mobile users to /m/ path if not already there
  if (isMobile && !isOnMobilePath && currentPath !== '/') {
    const queryString = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
    return res.redirect(302, '/m' + currentPath + queryString);
  }
  
  // Redirect desktop users away from /m/ path
  if (!isMobile && isOnMobilePath) {
    const desktopPath = currentPath.replace('/m', '') || '/';
    const queryString = req.url.includes('?') ? '?' + req.url.split('?')[1] : '';
    return res.redirect(302, desktopPath + queryString);
  }
  
  next();
};
