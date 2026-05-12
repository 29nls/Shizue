export interface Item {
  id: string
  name: string
  description: string
  price: number
  originalPrice?: number
  image: string
  slug: string
  category: string
  rating: number
  reviewCount: number
}

export const generateProductSchema = (item: Item, siteUrl: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: item.name,
    description: item.description,
    image: item.image,
    ...(item.rating > 0 && {
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: item.rating,
        reviewCount: item.reviewCount
      }
    }),
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/item/${item.slug}`,
      priceCurrency: 'IDR',
      price: item.price.toString(),
      availability: 'https://schema.org/InStock'
    },
    brand: {
      '@type': 'Brand',
      name: 'MACENG MARKET'
    }
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
