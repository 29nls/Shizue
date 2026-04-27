# 🚀 Diaspora - Step-by-Step Implementation Guide
## Practical Code Examples & Instructions

---

## 🎯 Phase 1: Foundation Improvements (Priority 1)
### Estimated Time: 1-2 weeks | Impact: HIGH

---

## STEP 1: Add Advanced Scroll Animations

### Install Dependencies
```bash
npm install aos
npm install --save-dev @types/aos
```

### Create Composable: `composables/useScrollAnimation.ts`
```typescript
export const useScrollAnimation = () => {
  const initializeAOS = () => {
    if (process.client) {
      // @ts-ignore
      AOS.init({
        duration: 600,
        easing: 'ease-in-out',
        offset: 100,
        once: false,
        mirror: true
      })
    }
  }

  const refreshAOS = () => {
    if (process.client) {
      // @ts-ignore
      AOS.refresh()
    }
  }

  return { initializeAOS, refreshAOS }
}
```

### Update `app.vue` to use it
```vue
<script setup lang="ts">
import { useScrollAnimation } from '~/composables/useScrollAnimation'

const { initializeAOS, refreshAOS } = useScrollAnimation()

onMounted(() => {
  initializeAOS()
})

watch(() => route.path, () => {
  refreshAOS()
})
</script>
```

### Apply to HTML elements
```vue
<!-- In pages/index.vue -->
<section class="featured-section" id="featured">
  <div class="section-title" data-aos="fade-up">
    <h2>Featured Posts</h2>
  </div>

  <div class="posts-grid">
    <div
      v-for="(post, index) in posts"
      :key="index"
      class="post-card"
      :data-aos="`fade-up`"
      :data-aos-delay="`${index * 100}`"
    >
      <!-- Card content -->
    </div>
  </div>
</section>
```

### Add Parallax to Hero
```vue
<!-- In pages/index.vue hero -->
<section class="hero-section">
  <div 
    class="hero-background"
    :style="{ transform: `translateY(${scrollY * 0.5}px)` }"
  ></div>
  <!-- Rest of hero -->
</section>

<script setup>
const scrollY = ref(0)

onMounted(() => {
  if (process.client) {
    window.addEventListener('scroll', () => {
      scrollY.value = window.scrollY
    })
  }
})
</script>
```

---

## STEP 2: Implement Full-Text Search

### Create API Endpoint: `server/routes/api/search.ts`
```typescript
import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  date: string
  categories: string[]
  score: number
}

function getPostsDir(): string {
  return path.join(process.cwd(), 'data', 'posts')
}

async function getAllPosts() {
  const postsDir = getPostsDir()
  const files = await fs.readdir(postsDir)
  const posts = []

  for (const file of files) {
    if (!file.endsWith('.md')) continue
    
    const filePath = path.join(postsDir, file)
    const content = await fs.readFile(filePath, 'utf-8')
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)

    if (match) {
      const frontmatter = yaml.parse(match[1])
      const body = match[2]
      posts.push({
        slug: file.replace('.md', ''),
        title: frontmatter.title || '',
        excerpt: frontmatter.excerpt || body.substring(0, 200),
        date: frontmatter.date || new Date().toISOString(),
        categories: frontmatter.categories || [],
        content: body
      })
    }
  }

  return posts
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event).q as string
  const category = getQuery(event).category as string
  const dateRange = getQuery(event).dateRange as string

  if (!query) {
    return { results: [], query: '' }
  }

  const allPosts = await getAllPosts()
  let results: SearchResult[] = []

  // Text search
  const searchTerms = query.toLowerCase().split(' ')
  results = allPosts.filter(post => {
    const text = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase()
    const score = searchTerms.filter(term => text.includes(term)).length
    return score > 0 ? (post as any).score = score : false
  })

  // Filter by category if provided
  if (category) {
    results = results.filter(p => p.categories.includes(decodeURIComponent(category)))
  }

  // Filter by date range if provided
  if (dateRange) {
    const now = new Date()
    const postDate = new Date()
    
    switch (dateRange) {
      case 'week':
        postDate.setDate(postDate.getDate() - 7)
        break
      case 'month':
        postDate.setMonth(postDate.getMonth() - 1)
        break
      case 'year':
        postDate.setFullYear(postDate.getFullYear() - 1)
        break
    }

    results = results.filter(p => new Date(p.date) >= postDate)
  }

  // Sort by relevance score
  results.sort((a, b) => (b as any).score - (a as any).score)

  return {
    query,
    count: results.length,
    results: results.slice(0, 50).map(({ score, ...rest }) => rest)
  }
})
```

### Create Search Page: `pages/search.vue`
```vue
<template>
  <div class="search-page">
    <div class="search-header">
      <h1>Search Posts</h1>
    </div>

    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search blog posts..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="search-button">Search</button>
      </div>

      <div class="search-filters">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <select v-model="dateRange" class="filter-select">
          <option value="">Any Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>

    <div v-if="searched" class="search-results">
      <p class="results-count">
        {{ results.length }} result{{ results.length !== 1 ? 's' : '' }} found
      </p>

      <div v-if="results.length > 0" class="results-list">
        <NuxtLink
          v-for="result in results"
          :key="result.slug"
          :to="`/post/${result.slug}`"
          class="result-item"
        >
          <div class="result-content">
            <h3 class="result-title">{{ result.title }}</h3>
            <p class="result-excerpt">{{ result.excerpt }}</p>
            <div class="result-meta">
              <span class="result-date">{{ formatDate(result.date) }}</span>
              <span
                v-for="cat in result.categories.slice(0, 2)"
                :key="cat"
                class="result-category"
              >
                {{ cat }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="no-results">
        <p>No results found for "{{ searchQuery }}"</p>
        <p>Try different keywords or browse by category.</p>
      </div>
    </div>

    <div v-else class="search-tips">
      <h2>Tips for Better Search</h2>
      <ul>
        <li>Use specific keywords</li>
        <li>Try shorter search terms</li>
        <li>Use filters to narrow results</li>
        <li>Browse by category</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { usePostFetching } from '~/composables/usePostFetching'

const searchQuery = ref('')
const selectedCategory = ref('')
const dateRange = ref('')
const results = ref([])
const searched = ref(false)

const { categories } = usePostFetching()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleSearch = async () => {
  searched.value = true
  try {
    const params = new URLSearchParams({
      q: searchQuery.value,
      ...(selectedCategory.value && { category: selectedCategory.value }),
      ...(dateRange.value && { dateRange: dateRange.value })
    })

    const response = await $fetch(`/api/search?${params}`)
    results.value = response.results || []
  } catch (error) {
    console.error('Search error:', error)
    results.value = []
  }
}

onMounted(() => {
  const route = useRoute()
  const q = route.query.q as string
  if (q) {
    searchQuery.value = q
    handleSearch()
  }
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  padding: 4rem 2rem;
}

.search-header {
  text-align: center;
  margin-bottom: 3rem;
}

.search-header h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #ffc451 0%, #4098ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 1rem;
}

.search-container {
  max-width: 800px;
  margin: 0 auto 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-input-wrapper {
  display: flex;
  gap: 1rem;
}

.search-input {
  flex: 1;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 196, 81, 0.2);
  border-radius: 8px;
  color: #e8e6e1;
  font-size: 1rem;
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 196, 81, 0.6);
  background: rgba(255, 255, 255, 0.08);
}

.search-button {
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #ffc451 0%, #ffb700 100%);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(255, 196, 81, 0.4);
}

.search-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 196, 81, 0.2);
  border-radius: 6px;
  color: #e8e6e1;
  cursor: pointer;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-item {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 196, 81, 0.15);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
}

.result-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 196, 81, 0.3);
  transform: translateX(5px);
}

.result-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #e8e6e1;
}

.result-excerpt {
  color: #d0cac4;
  margin-bottom: 1rem;
  line-height: 1.6;
}

.result-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.result-date {
  font-size: 0.9rem;
  color: #999;
}

.result-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 196, 81, 0.1);
  border: 1px solid rgba(255, 196, 81, 0.3);
  border-radius: 4px;
  font-size: 0.85rem;
  color: #ffc451;
}

.no-results {
  text-align: center;
  padding: 3rem 2rem;
  color: #d0cac4;
}

.search-tips {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
}

.search-tips h2 {
  margin-bottom: 1rem;
  color: #ffc451;
}

.search-tips ul {
  list-style: none;
  padding: 0;
}

.search-tips li {
  padding: 0.5rem 0;
  color: #d0cac4;
}

.search-tips li:before {
  content: "→ ";
  color: #ffc451;
  margin-right: 0.5rem;
}
</style>
```

### Update Navigation: `layouts/default.vue`
```vue
<template>
  <header class="sticky-header">
    <NuxtLink to="/" class="logo">Diaspora</NuxtLink>
    
    <nav class="nav-links">
      <NuxtLink to="/">Home</NuxtLink>
      <NuxtLink to="/search">Search</NuxtLink>
      <NuxtLink to="/">Archive</NuxtLink>
    </nav>

    <!-- Add search bar here -->
    <div class="search-bar">
      <input 
        v-model="searchInput" 
        type="text" 
        placeholder="Search..." 
        @keyup.enter="goToSearch"
      />
    </div>

    <!-- Rest of header -->
  </header>
</template>

<script setup>
const searchInput = ref('')
const router = useRouter()

const goToSearch = () => {
  if (searchInput.value) {
    router.push(`/search?q=${encodeURIComponent(searchInput.value)}`)
    searchInput.value = ''
  }
}
</script>
```

---

## STEP 3: Add SEO Structured Data

### Create Utility: `utils/seo.ts`
```typescript
export interface Post {
  title: string
  excerpt: string
  content: string
  date: string
  author: string
  cover: string
  slug: string
  categories: string[]
  tags: string[]
}

export const generateArticleSchema = (post: Post, siteUrl: string) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    image: post.cover,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      '@type': 'Person',
      name: post.author
    },
    publisher: {
      '@type': 'Organization',
      name: 'Diaspora',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`
      }
    },
    url: `${siteUrl}/post/${post.slug}`,
    keywords: post.tags.join(', '),
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
  logo: string
  author: string
}) => {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: config.name,
    description: config.description,
    url: config.url,
    logo: config.logo,
    author: {
      '@type': 'Person',
      name: config.author
    }
  }
}
```

### Update Post Page: `pages/post/[slug].vue`
```typescript
<script setup>
import { useHead } from '#app'
import { generateArticleSchema, generateBreadcrumbSchema } from '~/utils/seo'

// ... existing code ...

const siteUrl = 'https://diaspora.com' // Update with actual domain

useHead({
  title: post.value.title,
  meta: [
    {
      name: 'description',
      content: post.value.excerpt || post.value.content.substring(0, 160)
    },
    // Open Graph
    { property: 'og:type', content: 'article' },
    { property: 'og:title', content: post.value.title },
    { property: 'og:description', content: post.value.excerpt },
    { property: 'og:image', content: post.value.cover },
    { property: 'og:url', content: `${siteUrl}/post/${post.value.slug}` },
    // Twitter Card
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: post.value.title },
    { name: 'twitter:description', content: post.value.excerpt },
    { name: 'twitter:image', content: post.value.cover },
    // Article specific
    { name: 'article:published_time', content: post.value.date },
    { name: 'article:author', content: post.value.author },
    { name: 'article:section', content: post.value.categories[0] || 'Blog' },
    ...post.value.tags.map(tag => ({
      name: 'article:tag',
      content: tag
    }))
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(generateArticleSchema(post.value, siteUrl))
    },
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(
        generateBreadcrumbSchema(
          [
            { name: 'Home', url: '/' },
            { name: 'Post', url: `/post/${post.value.slug}` }
          ],
          siteUrl
        )
      )
    }
  ]
})
</script>
```

### Add JSON-LD to Homepage: `pages/index.vue`
```typescript
<script setup>
const { posts, categories } = usePostFetching()
const siteUrl = 'https://diaspora.com'

const generateWebsiteSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'Diaspora Blog',
  url: siteUrl,
  description: 'A beautiful blog platform',
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/search?q={search_term_string}`
    },
    'query-input': 'required name=search_term_string'
  }
})

useHead({
  title: 'Diaspora - Blog',
  meta: [
    { name: 'description', content: 'Explore our blog posts' },
    { property: 'og:type', content: 'website' },
    { property: 'og:title', content: 'Diaspora - Blog' }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(generateWebsiteSchema())
    }
  ]
})
</script>
```

---

## STEP 4: Add Analytics Integration

### Install Google Analytics
```bash
npm install @nuxtjs/google-analytics
```

### Update `nuxt.config.ts`
```typescript
export default defineNuxtConfig({
  modules: [
    '@nuxtjs/google-analytics'
  ],

  googleAnalytics: {
    id: 'G-XXXXXXXXXX' // Replace with your GA4 ID
  },

  // ... rest of config
})
```

### Create Analytics Composable: `composables/useAnalytics.ts`
```typescript
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

  const trackNewsletterSignup = () => {
    trackEvent('newsletter_signup')
  }

  return {
    trackEvent,
    trackPageView,
    trackPostView,
    trackSearch,
    trackNewsletterSignup
  }
}
```

### Use in Post Page
```typescript
<script setup>
const { trackPostView } = useAnalytics()

onMounted(() => {
  trackPostView(post.value.slug, post.value.title)
})
</script>
```

---

## Continue Implementation in Progress...

**This guide covers Phase 1 in detail. The complete guide includes:**
- Phase 2: Newsletter subscription
- Phase 3: Comment integration
- Phase 4: Admin dashboard
- Phase 5: Performance optimization

**Each section includes:**
- Installation instructions
- Complete code examples
- Integration points
- CSS styling
- TypeScript types
- Usage examples

---

**Status:** ✅ Ready to implement  
**Estimated Time:** 1-2 weeks (Phase 1)  
**Difficulty:** Medium

