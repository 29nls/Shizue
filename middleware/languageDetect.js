/**
 * Language Routing Middleware
 * Handles language detection and routing like Genshin Impact
 */

// Supported languages
const SUPPORTED_LANGUAGES = ['en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'pt', 'ru', 'id'];
const DEFAULT_LANGUAGE = 'en';

/**
 * Language detection middleware
 */
module.exports = (req, res, next) => {
  // Check if path already has language code
  const pathParts = req.path.split('/').filter(p => p);
  const isMobile = req.path.startsWith('/m/');
  
  // Skip language detection for API and static routes
  const skipPaths = ['/api/', '/static/', '/css/', '/js/', '/img/', '/favicon.ico'];
  const shouldSkip = skipPaths.some(path => req.path.startsWith(path));
  
  if (shouldSkip) {
    req.language = DEFAULT_LANGUAGE;
    return next();
  }
  
  // Extract language from path if exists
  const langIndex = isMobile ? 1 : 0;
  let currentLanguage = DEFAULT_LANGUAGE;
  let hasLanguageInPath = false;
  
  if (pathParts[langIndex] && SUPPORTED_LANGUAGES.includes(pathParts[langIndex])) {
    currentLanguage = pathParts[langIndex];
    hasLanguageInPath = true;
  } else {
    // Detect user's preferred language
    currentLanguage = detectUserLanguage(req);
    
    // Only redirect if not on home page
    if (req.path !== '/' && req.path !== '/m/') {
      // Add language to path
      const basePath = isMobile ? '/m/' : '/';
      const newPath = basePath + currentLanguage + req.path.replace(/^\/m?/, '');
      return res.redirect(302, newPath);
    }
  }
  
  // Store language in request
  req.language = currentLanguage;
  req.languages = SUPPORTED_LANGUAGES;
  req.hasLanguageInPath = hasLanguageInPath;
  
  // Pass helper to render context
  res.locals.language = currentLanguage;
  res.locals.languages = SUPPORTED_LANGUAGES;
  
  next();
};

/**
 * Detect user's preferred language
 */
function detectUserLanguage(req) {
  // 1. Check localStorage (via cookie if sent from client)
  const preferredLangCookie = getCookie(req, 'preferred-language');
  if (preferredLangCookie && SUPPORTED_LANGUAGES.includes(preferredLangCookie)) {
    return preferredLangCookie;
  }
  
  // 2. Check Accept-Language header
  const acceptLanguage = req.get('accept-language');
  if (acceptLanguage) {
    const langs = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim().toLowerCase().split('-')[0])
      .filter(lang => SUPPORTED_LANGUAGES.includes(lang));
    
    if (langs.length > 0) {
      return langs[0];
    }
  }
  
  // 3. Default to English
  return DEFAULT_LANGUAGE;
}

/**
 * Get cookie value from request
 */
function getCookie(req, name) {
  const cookies = req.get('cookie');
  if (!cookies) return null;
  
  const cookieArray = cookies.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
    const cookie = cookieArray[i].trim();
    if (cookie.startsWith(name + '=')) {
      return cookie.substring(name.length + 1);
    }
  }
  
  return null;
}

/**
 * Helper function to get language-aware URL
 */
function getLanguageUrl(path, language = DEFAULT_LANGUAGE, isMobile = false) {
  if (!SUPPORTED_LANGUAGES.includes(language)) {
    language = DEFAULT_LANGUAGE;
  }
  
  const basePath = isMobile ? '/m/' : '/';
  return basePath + language + path;
}

/**
 * Helper function to set language preference
 */
function setLanguagePreference(res, language) {
  if (SUPPORTED_LANGUAGES.includes(language)) {
    res.cookie('preferred-language', language, {
      maxAge: 365 * 24 * 60 * 60 * 1000, // 1 year
      httpOnly: false,
      secure: false,
      sameSite: 'lax'
    });
  }
}

module.exports.getLanguageUrl = getLanguageUrl;
module.exports.setLanguagePreference = setLanguagePreference;
module.exports.SUPPORTED_LANGUAGES = SUPPORTED_LANGUAGES;
module.exports.DEFAULT_LANGUAGE = DEFAULT_LANGUAGE;
