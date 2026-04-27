export const useAnalytics = () => {
  const trackEvent = (eventName: string, eventData?: Record<string, any>) => {
    if (process.client && window.gtag) {
      window.gtag('event', eventName, eventData)
    }
  }

  const trackPageView = (path: string) => {
    trackEvent('page_view', { page_path: path })
  }

  const trackPostView = (postSlug: string, postTitle: string) => {
    trackEvent('post_view', {
      post_slug: postSlug,
      post_title: postTitle
    })
  }

  const trackSearch = (query: string, resultCount: number) => {
    trackEvent('search', {
      search_term: query,
      result_count: resultCount
    })
  }

  const trackCategoryClick = (category: string) => {
    trackEvent('category_click', {
      category: category
    })
  }

  return {
    trackEvent,
    trackPageView,
    trackPostView,
    trackSearch,
    trackCategoryClick
  }
}
