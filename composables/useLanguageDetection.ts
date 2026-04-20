export const useLanguageDetection = () => {
  const router = useRouter()
  const route = useRoute()

  const SUPPORTED_LANGUAGES = ['en', 'ja', 'ko', 'zh', 'fr', 'de', 'es', 'pt', 'ru', 'id']
  const DEFAULT_LANGUAGE = 'en'

  // Get current language from route or cookie
  const getCurrentLanguage = (): string => {
    // Check route first
    const pathParts = route.path.split('/').filter(p => p)
    const isMobile = route.path.startsWith('/m/')
    const langIndex = isMobile ? 1 : 0

    if (pathParts[langIndex] && SUPPORTED_LANGUAGES.includes(pathParts[langIndex])) {
      return pathParts[langIndex]
    }

    // Check localStorage
    if (process.client) {
      const stored = localStorage.getItem('preferred-language')
      if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
        return stored
      }
    }

    return DEFAULT_LANGUAGE
  }

  // Set language and redirect
  const setLanguage = async (lang: string) => {
    if (!SUPPORTED_LANGUAGES.includes(lang)) {
      lang = DEFAULT_LANGUAGE
    }

    if (process.client) {
      localStorage.setItem('preferred-language', lang)
    }

    // Build new path with language
    const isMobile = route.path.startsWith('/m/')
    const pathParts = route.path.split('/').filter(p => p)

    // Remove old language code if exists
    let newPathParts = pathParts
    if (SUPPORTED_LANGUAGES.includes(pathParts[0])) {
      newPathParts = pathParts.slice(1)
    }

    const basePath = isMobile ? '/m/' : '/'
    const newPath = basePath + lang + '/' + newPathParts.join('/')

    await router.push(newPath)
  }

  // Detect user language on first load
  const detectAndSetLanguage = async () => {
    if (process.client && route.path === '/') {
      const detected = detectBrowserLanguage()
      if (detected && detected !== DEFAULT_LANGUAGE) {
        await setLanguage(detected)
      }
    }
  }

  // Detect browser language
  const detectBrowserLanguage = (): string => {
    if (!process.client) return DEFAULT_LANGUAGE

    // Check localStorage
    const stored = localStorage.getItem('preferred-language')
    if (stored && SUPPORTED_LANGUAGES.includes(stored)) {
      return stored
    }

    // Check browser language
    const browserLang = (navigator.language || 'en').split('-')[0].toLowerCase()
    if (SUPPORTED_LANGUAGES.includes(browserLang)) {
      return browserLang
    }

    return DEFAULT_LANGUAGE
  }

  return {
    SUPPORTED_LANGUAGES,
    DEFAULT_LANGUAGE,
    getCurrentLanguage,
    setLanguage,
    detectAndSetLanguage,
    detectBrowserLanguage,
  }
}
