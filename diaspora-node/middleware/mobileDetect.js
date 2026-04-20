/**
 * Mobile Detection Middleware
 * Automatically redirects mobile users to /m/ routes
 */

const mobileDetect = require('mobile-detect');

module.exports = (req, res, next) => {
  const md = new mobileDetect(req.get('user-agent'));
  const isMobile = md.mobile() !== null || md.phone() !== null;
  
  // Store mobile status in request
  req.isMobile = isMobile;
  
  // Check current path
  const currentPath = req.path;
  const isOnMobilePath = currentPath.startsWith('/m/');
  
  // Special endpoints that don't need redirect
  const skipRedirectPaths = ['/api/', '/static/', '/css/', '/js/', '/img/'];
  const shouldSkip = skipRedirectPaths.some(path => currentPath.startsWith(path));
  
  if (shouldSkip) {
    return next();
  }
  
  // Redirect mobile users to /m/ path if not already there
  if (isMobile && !isOnMobilePath && currentPath !== '/') {
    return res.redirect(302, '/m' + currentPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : ''));
  }
  
  // Redirect desktop users away from /m/ path
  if (!isMobile && isOnMobilePath) {
    const desktopPath = currentPath.replace('/m', '') || '/';
    return res.redirect(302, desktopPath + (req.url.includes('?') ? '?' + req.url.split('?')[1] : ''));
  }
  
  next();
};
