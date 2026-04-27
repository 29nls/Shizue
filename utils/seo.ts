export interface Post {
  title: string
  excerpt: string
  content: string
  date: string
  author?: string
  cover?: string
  slug: string
  categories: string[]
  tags?: string[]
}

export const generateArticleSchema = (post: Post, siteUrl: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    ...(post.cover && { image: post.cover }),
    datePublished: post.date,
    dateModified: post.date,
    ...(post.author && {
      author: {
        '@type': 'Person',
        name: post.author
      }
    }),
    publisher: {
      '@type': 'Organization',
      name: 'Diaspora',
      ...(post.cover && {
        logo: {
          '@type': 'ImageObject',
          url: post.cover
        }
      })
    },
    url: `${siteUrl}/post/${post.slug}`,
    ...(post.tags && post.tags.length > 0 && {
      keywords: post.tags.join(', ')
    }),
    articleBody: post.content
  }
}

export const generateBreadcrumbSchema = (items: Array<{ name: string; url: string }>, siteUrl: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `${siteUrl}${item.url}`
    }))
  }
}

export const generateWebsiteSchema = (config: {
  name: string
  description: string
  url: string
  logo?: string
  author?: string
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    description: config.description,
    url: config.url,
    ...(config.logo && { logo: config.logo }),
    ...(config.author && {
      author: {
        '@type': 'Person',
        name: config.author
      }
    }),
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${config.url}/search?q={search_term_string}`
      },
      'query-input': 'required name=search_term_string'
    }
  }
}

export const generateOrganizationSchema = (config: {
  name: string
  description: string
  url: string
  logo: string
  email?: string
  social?: string[]
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: config.name,
    description: config.description,
    url: config.url,
    logo: config.logo,
    ...(config.email && { email: config.email }),
    ...(config.social && config.social.length > 0 && {
      sameAs: config.social
    })
  }
}
