<template>
  <div class="tag-page">
    <!-- Header -->
    <header class="tag-header">
      <div class="breadcrumb">
        <NuxtLink to="/">Home</NuxtLink>
        <span class="separator">/</span>
        <span>#{{ tag }}</span>
      </div>

      <h1 class="tag-title">#{{ tag }}</h1>
      <p class="tag-description">
        {{ posts.length }} {{ posts.length === 1 ? 'article' : 'articles' }} tagged with this
      </p>
    </header>

    <!-- Posts Grid -->
    <div v-if="posts.length > 0" class="posts-container">
      <div class="posts-grid">
        <div
          v-for="(post, index) in posts"
          :key="index"
          class="post-card scroll-fade"
        >
          <div class="post-card-image">
            <img :src="post.cover" :alt="post.title" />
          </div>
          <div class="post-card-body">
            <span v-if="post.categories.length > 0" class="post-card-category">
              {{ post.categories[0] }}
            </span>
            <h3 class="post-card-title">{{ post.title }}</h3>
            <p class="post-card-excerpt">{{ post.excerpt }}</p>
            <div class="post-card-footer">
              <span class="post-card-date">{{ formatDate(post.date, 'short') }}</span>
              <span class="post-card-arrow">→</span>
            </div>
          </div>
          <NuxtLink :to="`/post/${post.slug}`" class="card-link" />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state">
      <div class="empty-icon">#</div>
      <h2>No articles found</h2>
      <p>This tag doesn't have any articles yet.</p>
      <NuxtLink to="/" class="btn-back">← Back to Home</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
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

const tag = ref<string>('')
const loading = ref(true)

// Format date helper
const formatDate = (date: string, format: string = 'full') => {
  const d = new Date(date)
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Filter posts by tag
const tagPosts = ref<Post[]>([])

const loadTag = async () => {
  const tagName = route.params.tag as string

  if (tagName) {
    tag.value = decodeURIComponent(tagName)

    if (!posts.value || posts.value.length === 0) {
      await fetchPosts()
    }

    tagPosts.value = (posts.value || []).filter(p =>
      p.tags.includes(tag.value)
    )
  }

  loading.value = false
}

// Watch for route changes
watch(() => route.params.tag, () => {
  loading.value = true
  tagPosts.value = []
  loadTag()
})

// Initialize on mount
onMounted(() => {
  loadTag()
})

// Setup scroll animations
onMounted(() => {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible')
        observer.unobserve(entry.target)
      }
    })
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px',
  })

  const elements = document.querySelectorAll('.scroll-fade')
  elements.forEach(el => observer.observe(el))
})

// Head
useHead({
  title: () => `#${tag.value} | Blog`,
  meta: [
    {
      name: 'description',
      content: () => `Articles tagged with #${tag.value}`,
    },
  ],
})

// Expose posts for template
const posts_ = computed(() => tagPosts.value)
</script>

<style scoped>
.tag-page {
  width: 100%;
  min-height: 100vh;
}

/* ========== HEADER ========== */

.tag-header {
  background: linear-gradient(135deg, #764ba2 0%, #f093fb 100%);
  padding: 4rem 2rem;
  text-align: center;
  margin-top: -4rem;
  padding-top: 8rem;
  color: #ffffff;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.breadcrumb {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  margin-bottom: 1.5rem;
  font-size: 0.95rem;
}

.breadcrumb a {
  color: rgba(255, 255, 255, 0.9);
  text-decoration: none;
  transition: all 0.3s ease;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.breadcrumb .separator {
  opacity: 0.6;
}

.breadcrumb span {
  color: rgba(255, 255, 255, 0.7);
}

.tag-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  letter-spacing: -1px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.tag-description {
  font-size: 1.1rem;
  margin: 0;
  opacity: 0.95;
  font-weight: 500;
}

/* ========== POSTS GRID ========== */

.posts-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 3rem 2rem;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

.post-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
  height: 100%;
  position: relative;
}

.post-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(240, 147, 251, 0.1) 0%, transparent 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: 1;
}

.post-card:hover {
  transform: translateY(-15px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3), 0 0 20px rgba(240, 147, 251, 0.3);
  border-color: #f093fb;
}

.post-card:hover::before {
  opacity: 1;
}

.post-card-image {
  position: relative;
  overflow: hidden;
  height: 200px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.post-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.post-card:hover .post-card-image img {
  transform: scale(1.15) rotate(1deg);
}

.post-card-body {
  padding: 1.5rem;
  flex: 1;
  display: flex;
  flex-direction: column;
  position: relative;
  z-index: 2;
}

.post-card-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border-radius: 9999px;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  width: fit-content;
  margin-bottom: 1rem;
}

.post-card-title {
  color: #ffffff;
  font-size: 1.3rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
  line-height: 1.4;
}

.post-card-excerpt {
  color: #a8a8a8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 1rem;
  flex: 1;
}

.post-card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 1rem;
  border-top: 1px solid rgba(240, 147, 251, 0.1);
}

.post-card-date {
  color: #a8a8a8;
  font-size: 0.85rem;
}

.post-card-arrow {
  color: #f093fb;
  font-size: 1.2rem;
  transition: transform 0.3s ease;
}

.post-card:hover .post-card-arrow {
  transform: translateX(5px);
}

.card-link {
  position: absolute;
  inset: 0;
  text-decoration: none;
  z-index: 5;
}

/* ========== EMPTY STATE ========== */

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  color: #ffffff;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-state h2 {
  font-size: 2rem;
  margin-bottom: 0.75rem;
}

.empty-state p {
  color: #a8a8a8;
  font-size: 1.05rem;
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

/* ========== SCROLL ANIMATIONS ========== */

.scroll-fade {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.5s ease;
}

.scroll-fade.visible {
  opacity: 1;
  transform: translateY(0);
}

/* ========== RESPONSIVE ========== */

@media (max-width: 768px) {
  .tag-header {
    padding: 2rem 1rem;
    margin-top: -2rem;
    padding-top: 4rem;
  }

  .tag-title {
    font-size: 1.75rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
