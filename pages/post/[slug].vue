<template>
  <div class="single-post-page">
    <div v-if="loading" class="loading-state">
      <div class="spinner"></div>
      <p>Loading post...</p>
    </div>

    <div v-else-if="error" class="error-state">
      <h2>Oops! Post not found</h2>
      <p>{{ error }}</p>
      <NuxtLink to="/" class="btn-back">← Back to Home</NuxtLink>
    </div>

    <div v-else-if="post" class="post-container">
      <!-- Hero Image -->
      <div class="post-hero">
        <img :src="post.cover" :alt="post.title" class="post-hero-image" />
        <div class="post-hero-overlay"></div>
      </div>

      <!-- Main Content -->
      <article class="post-content">
        <!-- Header -->
        <header class="post-header">
          <div class="post-meta-top">
            <NuxtLink to="/" class="breadcrumb-link">← Back</NuxtLink>
            <span v-if="post.categories.length > 0" class="post-category">
              {{ post.categories[0] }}
            </span>
          </div>

          <h1 class="post-title">{{ post.title }}</h1>

          <div class="post-meta">
            <span class="meta-item">
              <span class="meta-icon">📅</span>
              {{ formatDate(post.date) }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">✍️</span>
              {{ post.author }}
            </span>
            <span class="meta-item">
              <span class="meta-icon">⏱️</span>
              {{ readingTime }} min read
            </span>
          </div>
        </header>

        <!-- Post Body -->
        <div class="post-body" v-html="post.content"></div>

        <!-- Footer -->
        <footer class="post-footer">
          <div v-if="post.tags.length > 0" class="post-tags">
            <h3>Tags</h3>
            <div class="tags-list">
              <NuxtLink
                v-for="tag in post.tags"
                :key="tag"
                :to="`/tag/${tag}`"
                class="tag-badge"
              >
                #{{ tag }}
              </NuxtLink>
            </div>
          </div>

          <!-- Author Box -->
          <div class="author-box">
            <div class="author-avatar">{{ post.author.charAt(0) }}</div>
            <div class="author-info">
              <h4 class="author-name">{{ post.author }}</h4>
              <p class="author-bio">Published on {{ formatDate(post.date) }}</p>
            </div>
          </div>
        </footer>
      </article>

      <!-- Navigation -->
      <nav class="post-navigation">
        <NuxtLink
          v-if="previousPost"
          :to="`/post/${previousPost.slug}`"
          class="nav-link prev"
        >
          <span class="nav-label">← Previous Post</span>
          <span class="nav-title">{{ previousPost.title }}</span>
        </NuxtLink>

        <NuxtLink
          v-if="nextPost"
          :to="`/post/${nextPost.slug}`"
          class="nav-link next"
        >
          <span class="nav-label">Next Post →</span>
          <span class="nav-title">{{ nextPost.title }}</span>
        </NuxtLink>
      </nav>

      <!-- Related Posts -->
      <section v-if="relatedPosts.length > 0" class="related-posts">
        <div class="related-posts-header">
          <h2>Related Posts</h2>
          <p>You might also like</p>
        </div>

        <div class="related-posts-grid">
          <NuxtLink
            v-for="relatedPost in relatedPosts.slice(0, 3)"
            :key="relatedPost.slug"
            :to="`/post/${relatedPost.slug}`"
            class="related-post-card"
          >
            <div class="related-post-image">
              <img :src="relatedPost.cover" :alt="relatedPost.title" />
            </div>
            <div class="related-post-content">
              <h4 class="related-post-title">{{ relatedPost.title }}</h4>
              <span class="related-post-date">{{ formatDate(relatedPost.date, 'short') }}</span>
            </div>
          </NuxtLink>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute } from 'vue-router'
import { usePostFetching } from '~/composables/usePostFetching'

interface Post {
  slug: string
  title: string
  date: string
  author: string
  categories: string[]
  tags: string[]
  excerpt: string
  content: string
  cover: string
}

const route = useRoute()
const { posts, fetchPosts } = usePostFetching()

const post = ref<Post | null>(null)
const loading = ref(true)
const error = ref<string | null>(null)

// Format date helper
const formatDate = (date: string, format: string = 'full') => {
  const d = new Date(date)
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Calculate reading time
const readingTime = computed(() => {
  if (!post.value) return 0
  const wordCount = post.value.content.split(/\s+/).length
  return Math.ceil(wordCount / 200)
})

// Get previous post
const previousPost = computed(() => {
  if (!post.value) return null
  const currentIndex = posts.value?.findIndex(p => p.slug === post.value?.slug)
  if (currentIndex === undefined || currentIndex === -1 || currentIndex === 0) return null
  return posts.value?.[currentIndex - 1] || null
})

// Get next post
const nextPost = computed(() => {
  if (!post.value) return null
  const currentIndex = posts.value?.findIndex(p => p.slug === post.value?.slug)
  if (currentIndex === undefined || currentIndex === -1 || currentIndex === (posts.value?.length || 0) - 1) return null
  return posts.value?.[currentIndex + 1] || null
})

// Get related posts (by category or tag)
const relatedPosts = computed(() => {
  if (!post.value) return []

  return (posts.value || [])
    .filter(p => p.slug !== post.value?.slug)
    .filter(p => {
      const sameCat = p.categories.some(c => post.value?.categories.includes(c))
      const sameTag = p.tags.some(t => post.value?.tags.includes(t))
      return sameCat || sameTag
    })
    .slice(0, 6)
})

// Load post
const loadPost = async () => {
  const slug = route.params.slug as string

  if (!slug) {
    error.value = 'No post slug provided'
    loading.value = false
    return
  }

  try {
    // Ensure posts are loaded
    if (!posts.value || posts.value.length === 0) {
      await fetchPosts()
    }

    const foundPost = posts.value?.find(p => p.slug === slug)

    if (foundPost) {
      post.value = foundPost
      error.value = null
    } else {
      error.value = `Post "${slug}" not found`
    }
  } catch (err) {
    error.value = 'Error loading post'
    console.error('Error loading post:', err)
  } finally {
    loading.value = false
  }
}

// Watch for route changes
watch(() => route.params.slug, () => {
  loading.value = true
  post.value = null
  loadPost()
})

// Initialize on mount
onMounted(() => {
  loadPost()
})

// Head
useHead({
  title: () => post.value ? `${post.value.title} | Blog` : 'Post | Blog',
  meta: [
    {
      name: 'description',
      content: () => post.value?.excerpt || 'Read this article',
    },
  ],
})
</script>

<style scoped>
.single-post-page {
  width: 100%;
  min-height: 100vh;
}

/* ========== LOADING STATE ========== */

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  color: #ffffff;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(240, 147, 251, 0.2);
  border-top: 4px solid #f093fb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.loading-state p {
  color: #a8a8a8;
  font-size: 1rem;
}

/* ========== ERROR STATE ========== */

.error-state {
  text-align: center;
  padding: 3rem 2rem;
  color: #ffffff;
}

.error-state h2 {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.error-state p {
  color: #a8a8a8;
  margin-bottom: 2rem;
}

.btn-back {
  display: inline-block;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 9999px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-back:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.3);
}

/* ========== HERO SECTION ========== */

.post-hero {
  position: relative;
  width: 100%;
  height: 500px;
  margin-top: -4rem;
  padding-top: 4rem;
  overflow: hidden;
}

.post-hero-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  animation: heroImageZoom 1.2s ease-out;
}

@keyframes heroImageZoom {
  from {
    transform: scale(1.1);
  }
  to {
    transform: scale(1);
  }
}

.post-hero-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, transparent 0%, rgba(10, 14, 39, 0.8) 100%);
}

/* ========== POST CONTENT ========== */

.post-content {
  max-width: 800px;
  margin: -80px auto 0 auto;
  padding: 3rem 2rem;
  background: linear-gradient(180deg, #0a0e27 0%, #1a1a3a 100%);
  position: relative;
  z-index: 10;
  border-radius: 16px;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.5);
}

/* ========== POST HEADER ========== */

.post-meta-top {
  display: flex;
  gap: 1rem;
  align-items: center;
  margin-bottom: 1.5rem;
}

.breadcrumb-link {
  color: #a8a8a8;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.breadcrumb-link:hover {
  color: #f093fb;
}

.post-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.post-title {
  color: #ffffff;
  font-size: clamp(1.8rem, 4vw, 2.8rem);
  font-weight: 800;
  line-height: 1.2;
  margin: 1rem 0;
  letter-spacing: -1px;
}

.post-meta {
  display: flex;
  flex-wrap: wrap;
  gap: 2rem;
  padding: 1.5rem 0;
  border-top: 1px solid rgba(240, 147, 251, 0.1);
  border-bottom: 1px solid rgba(240, 147, 251, 0.1);
}

.meta-item {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #a8a8a8;
  font-size: 0.95rem;
}

.meta-icon {
  font-size: 1.1rem;
}

/* ========== POST BODY ========== */

.post-body {
  color: #c0c0c0;
  font-size: 1.05rem;
  line-height: 1.8;
  margin: 2rem 0;
}

.post-body :deep(p) {
  margin: 1.5rem 0;
}

.post-body :deep(h2) {
  color: #ffffff;
  font-size: 2rem;
  font-weight: 700;
  margin: 2rem 0 1rem 0;
  letter-spacing: -0.5px;
}

.post-body :deep(h3) {
  color: #ffffff;
  font-size: 1.5rem;
  font-weight: 700;
  margin: 1.5rem 0 0.75rem 0;
}

.post-body :deep(ul) {
  margin: 1.5rem 0;
  padding-left: 2rem;
}

.post-body :deep(li) {
  margin: 0.5rem 0;
}

.post-body :deep(a) {
  color: #f093fb;
  text-decoration: none;
  border-bottom: 1px solid rgba(240, 147, 251, 0.3);
  transition: all 0.3s ease;
}

.post-body :deep(a:hover) {
  border-bottom-color: #f093fb;
}

.post-body :deep(blockquote) {
  border-left: 4px solid #667eea;
  padding-left: 1.5rem;
  margin: 1.5rem 0;
  color: #a8a8a8;
  font-style: italic;
}

.post-body :deep(code) {
  background: rgba(102, 126, 234, 0.1);
  padding: 2px 6px;
  border-radius: 4px;
  color: #f093fb;
  font-family: 'Courier New', monospace;
  font-size: 0.9rem;
}

.post-body :deep(pre) {
  background: rgba(0, 0, 0, 0.3);
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin: 1.5rem 0;
  border: 1px solid rgba(240, 147, 251, 0.1);
}

.post-body :deep(pre code) {
  background: none;
  padding: 0;
  color: #c0c0c0;
}

.post-body :deep(img) {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1.5rem 0;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3);
}

/* ========== POST FOOTER ========== */

.post-footer {
  margin-top: 3rem;
  padding-top: 2rem;
  border-top: 1px solid rgba(240, 147, 251, 0.1);
}

.post-tags {
  margin-bottom: 2rem;
}

.post-tags h3 {
  color: #ffffff;
  font-size: 1.1rem;
  margin-bottom: 1rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tag-badge {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(102, 126, 234, 0.1);
  border: 1px solid #667eea;
  color: #f093fb;
  border-radius: 9999px;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.tag-badge:hover {
  background: rgba(102, 126, 234, 0.2);
  border-color: #f093fb;
  transform: translateY(-2px);
}

.author-box {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 12px;
}

.author-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
  color: #ffffff;
  font-weight: 700;
  flex-shrink: 0;
}

.author-info {
  flex: 1;
}

.author-name {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
}

.author-bio {
  color: #a8a8a8;
  font-size: 0.9rem;
  margin: 0;
}

/* ========== POST NAVIGATION ========== */

.post-navigation {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
  max-width: 800px;
  margin: 3rem auto;
  padding: 0 2rem;
}

.nav-link {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 12px;
  text-decoration: none;
  transition: all 0.3s ease;
}

.nav-link.next {
  text-align: right;
}

.nav-link:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 15px rgba(240, 147, 251, 0.2);
  border-color: #f093fb;
}

.nav-label {
  color: #a8a8a8;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.nav-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  line-height: 1.4;
}

/* ========== RELATED POSTS ========== */

.related-posts {
  max-width: 1200px;
  margin: 4rem auto;
  padding: 0 2rem;
}

.related-posts-header {
  text-align: center;
  margin-bottom: 2rem;
}

.related-posts-header h2 {
  color: #ffffff;
  font-size: 2rem;
  margin: 0;
  margin-bottom: 0.5rem;
}

.related-posts-header p {
  color: #a8a8a8;
  font-size: 1rem;
  margin: 0;
}

.related-posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.related-post-card {
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 12px;
  overflow: hidden;
  text-decoration: none;
  transition: all 0.3s ease;
}

.related-post-card:hover {
  transform: translateY(-8px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3), 0 0 20px rgba(240, 147, 251, 0.2);
  border-color: #f093fb;
}

.related-post-image {
  overflow: hidden;
  height: 180px;
}

.related-post-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.related-post-card:hover .related-post-image img {
  transform: scale(1.1);
}

.related-post-content {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.related-post-title {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0 0 0.75rem 0;
  line-height: 1.3;
}

.related-post-date {
  color: #a8a8a8;
  font-size: 0.85rem;
  margin-top: auto;
}

/* ========== RESPONSIVE ========== */

@media (max-width: 768px) {
  .post-hero {
    height: 300px;
  }

  .post-content {
    margin: -40px 1rem 0 1rem;
    padding: 2rem 1.5rem;
  }

  .post-title {
    font-size: 1.5rem;
  }

  .post-meta {
    flex-direction: column;
    gap: 1rem;
  }

  .post-navigation {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .related-posts-grid {
    grid-template-columns: 1fr;
  }

  .author-box {
    flex-direction: column;
    text-align: center;
  }

  .author-avatar {
    width: 80px;
    height: 80px;
    align-self: center;
  }
}

@media (max-width: 480px) {
  .post-hero {
    height: 200px;
    padding-top: 3rem;
    margin-top: -3rem;
  }

  .post-content {
    margin: -20px 0 0 0;
    padding: 1.5rem 1rem;
    border-radius: 0;
  }

  .post-body {
    font-size: 1rem;
  }

  .post-body :deep(h2) {
    font-size: 1.5rem;
  }

  .post-meta-top {
    flex-direction: column;
  }
}
</style>
