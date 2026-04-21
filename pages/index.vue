<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-background"></div>
      <div class="hero-content">
        <h1>{{ siteTitle }}</h1>
        <p class="subtitle">{{ siteSubtitle }}</p>
        <p class="description">{{ siteDescription }}</p>
        
        <div class="cta-buttons">
          <NuxtLink to="#featured" class="cta-btn primary">Explore Posts</NuxtLink>
          <NuxtLink to="#categories" class="cta-btn secondary">Browse Categories</NuxtLink>
        </div>
      </div>
      
      <div class="scroll-indicator">
        <svg viewBox="0 0 24 24">
          <path d="M12 2v16m0 0l-4-4m4 4l4-4"/>
        </svg>
      </div>
    </section>

    <!-- Featured Carousel -->
    <section v-if="posts.length > 0" class="featured-section" id="featured">
      <div class="section-title scroll-fade">
        <h2>Featured Posts</h2>
        <p>Latest and most popular stories</p>
      </div>

      <div class="carousel-container">
        <div class="carousel">
          <div
            v-for="(post, index) in posts.slice(0, 6)"
            :key="index"
            class="carousel-item scroll-fade"
          >
            <div class="carousel-item-image">
              <img :src="post.cover" :alt="post.title" />
            </div>
            <div class="carousel-item-content">
              <span class="carousel-item-date">{{ formatDate(post.date) }}</span>
              <h3 class="carousel-item-title">{{ post.title }}</h3>
              <p class="carousel-item-excerpt">{{ post.excerpt }}</p>
              <div class="carousel-item-meta">
                <span v-for="cat in post.categories.slice(0, 2)" :key="cat" class="carousel-item-tag">
                  {{ cat }}
                </span>
              </div>
            </div>
            <NuxtLink :to="`/post/${post.slug}`" class="card-link" />
          </div>
        </div>
      </div>

      <div v-if="posts.length > 3" class="carousel-controls">
        <button class="carousel-btn prev" @click="scrollCarousel(-350)">❮</button>
        <button class="carousel-btn next" @click="scrollCarousel(350)">❯</button>
      </div>
    </section>

    <!-- Stats Section -->
    <section class="stats-section scroll-fade">
      <div class="stats-container">
        <div class="stat-item">
          <span class="stat-number">{{ posts.length }}</span>
          <span class="stat-label">Published Posts</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">{{ categories.length }}</span>
          <span class="stat-label">Topics Covered</span>
        </div>
        <div class="stat-item">
          <span class="stat-number">∞</span>
          <span class="stat-label">Happy Readers</span>
        </div>
      </div>
    </section>

    <!-- Posts Grid -->
    <section class="posts-grid-section" id="posts">
      <div class="section-title scroll-fade">
        <h2>All Posts</h2>
        <p>Explore our complete collection</p>
      </div>

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
    </section>

    <!-- Categories Section -->
    <section v-if="categories.length > 0" class="categories-section" id="categories">
      <div class="section-title scroll-fade">
        <h2>Browse by Category</h2>
        <p>Find content that interests you</p>
      </div>

      <div class="categories-grid">
        <NuxtLink
          v-for="category in categories.slice(0, 8)"
          :key="category"
          :to="`/category/${category}`"
          class="category-card scroll-fade"
        >
          <div class="category-icon">📁</div>
          <div class="category-name">{{ category }}</div>
          <div class="category-count">
            {{ getPostCountByCategory(category) }} {{ getPostCountByCategory(category) === 1 ? 'post' : 'posts' }}
          </div>
        </NuxtLink>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { usePostFetching } from '~/composables/usePostFetching'

const config = useRuntimeConfig()
const siteTitle = config.public.siteTitle
const siteSubtitle = config.public.siteSubtitle
const siteDescription = config.public.siteDescription

const { posts, categories, fetchPosts, fetchCategories } = usePostFetching()

// Format date helper
const formatDate = (date: string, format: string = 'full') => {
  const d = new Date(date)
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Get post count by category
const getPostCountByCategory = (category: string) => {
  return (posts.value || []).filter(p => p.categories.includes(category)).length
}

// Scroll carousel
const scrollCarousel = (distance: number) => {
  const carousel = document.querySelector('.carousel') as HTMLElement
  if (carousel) {
    carousel.scrollBy({ left: distance, behavior: 'smooth' })
  }
}

// Setup scroll fade animations
const setupScrollAnimations = () => {
  const elements = document.querySelectorAll('.scroll-fade')
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

  elements.forEach(el => observer.observe(el))
}

// Initialize on mount
onMounted(async () => {
  await fetchPosts()
  await fetchCategories()
  setupScrollAnimations()
})

// Head
useHead({
  title: siteTitle,
  meta: [
    {
      name: 'description',
      content: siteDescription,
    },
  ],
})
</script>

<style scoped>
.home-page {
  width: 100%;
}

/* ========== HERO SECTION ========== */

.hero-section {
  position: relative;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3a 50%, #0f0f28 100%);
  margin-top: -4rem;
  padding-top: 4rem;
}

.hero-background {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    135deg,
    rgba(102, 126, 234, 0.1) 0%,
    rgba(118, 75, 162, 0.1) 50%,
    rgba(240, 147, 251, 0.05) 100%
  );
  z-index: 1;
}

.hero-content {
  position: relative;
  z-index: 10;
  text-align: center;
  color: #ffffff;
  animation: heroContentFadeIn 1.2s ease-out 0.5s both;
}

@keyframes heroContentFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-content h1 {
  font-size: clamp(2rem, 8vw, 4.5rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  letter-spacing: -2px;
  background: linear-gradient(135deg, #ffffff 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 0 30px rgba(240, 147, 251, 0.3);
}

.hero-content .subtitle {
  font-size: clamp(1rem, 3vw, 1.5rem);
  color: #a8a8a8;
  margin: 0.5rem 0;
  font-weight: 300;
  letter-spacing: 1px;
  animation: heroSubtitleFadeIn 1.2s ease-out 0.8s both;
}

@keyframes heroSubtitleFadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-content .description {
  color: #a8a8a8;
  font-size: 1rem;
  margin: 0;
  animation: heroSubtitleFadeIn 1.2s ease-out 0.9s both;
}

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 3rem;
  animation: heroButtonsFadeIn 1.2s ease-out 1.1s both;
}

@keyframes heroButtonsFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.cta-btn {
  position: relative;
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid transparent;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1.5px;
  text-decoration: none;
  display: inline-block;
  overflow: hidden;
  z-index: 1;
}

.cta-btn.primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.3);
}

.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 30px rgba(240, 147, 251, 0.5);
  filter: brightness(1.1);
}

.cta-btn.secondary {
  border: 2px solid #f093fb;
  color: #f093fb;
  background: rgba(240, 147, 251, 0.05);
  backdrop-filter: blur(10px);
}

.cta-btn.secondary:hover {
  background: rgba(240, 147, 251, 0.15);
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.3);
  transform: translateY(-3px);
}

.scroll-indicator {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  animation: bounce 2s ease-in-out infinite;
}

.scroll-indicator svg {
  width: 24px;
  height: 24px;
  stroke: #f093fb;
  stroke-width: 2;
  fill: none;
}

@keyframes bounce {
  0%, 100% {
    transform: translateX(-50%) translateY(0);
  }
  50% {
    transform: translateX(-50%) translateY(10px);
  }
}

/* ========== CAROUSEL SECTION ========== */

.featured-section {
  position: relative;
  padding: 3rem 0;
  background: linear-gradient(180deg, transparent 0%, rgba(102, 126, 234, 0.05) 100%);
}

.section-title {
  text-align: center;
  margin-bottom: 3rem;
  animation: fadeInDown 0.8s ease-out;
}

.section-title h2 {
  color: #ffffff;
  font-size: clamp(1.5rem, 4vw, 2.5rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  letter-spacing: -1px;
}

.section-title p {
  color: #a8a8a8;
  font-size: 1rem;
  margin: 0;
  letter-spacing: 0.5px;
}

@keyframes fadeInDown {
  from {
    opacity: 0;
    transform: translateY(-30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.carousel-container {
  position: relative;
  padding: 0;
  max-width: 100%;
  overflow: hidden;
  margin: 0 -1.5rem;
  padding: 1rem 1.5rem;
}

.carousel {
  display: flex;
  gap: 1.5rem;
  overflow-x: auto;
  scroll-behavior: smooth;
  padding: 1rem;
  scroll-snap-type: x mandatory;
  -webkit-overflow-scrolling: touch;
}

.carousel::-webkit-scrollbar {
  height: 6px;
}

.carousel::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 9999px;
}

.carousel::-webkit-scrollbar-thumb {
  background: linear-gradient(180deg, #667eea 0%, #f093fb 100%);
  border-radius: 9999px;
}

.carousel::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(180deg, #f093fb 0%, #667eea 100%);
}

.carousel-item {
  flex: 0 0 350px;
  scroll-snap-align: start;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(240, 147, 251, 0.2);
  border-radius: 12px;
  overflow: hidden;
  transition: all 0.3s ease;
  cursor: pointer;
  position: relative;
  height: 100%;
}

.carousel-item:hover {
  transform: translateY(-10px);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3), 0 0 20px rgba(240, 147, 251, 0.3);
  border-color: #f093fb;
}

.carousel-item-image {
  position: relative;
  overflow: hidden;
  height: 200px;
}

.carousel-item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.carousel-item:hover .carousel-item-image img {
  transform: scale(1.1) rotate(1deg);
}

.carousel-item-content {
  padding: 1.5rem;
}

.carousel-item-title {
  color: #ffffff;
  font-size: 1.2rem;
  font-weight: 700;
  margin: 1rem 0;
  line-height: 1.4;
}

.carousel-item-excerpt {
  color: #a8a8a8;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0.5rem 0;
}

.carousel-item-date {
  display: inline-block;
  color: #a8a8a8;
  font-size: 0.85rem;
}

.carousel-item-meta {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
}

.carousel-item-tag {
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

.carousel-controls {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-top: 2rem;
}

.carousel-btn {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid #f093fb;
  background: rgba(240, 147, 251, 0.1);
  color: #f093fb;
  font-size: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.carousel-btn:hover {
  background: rgba(240, 147, 251, 0.25);
  transform: scale(1.1);
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.3);
}

/* ========== POSTS GRID ========== */

.posts-grid-section {
  padding: 3rem 0;
}

.posts-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
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

/* ========== STATS SECTION ========== */

.stats-section {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 3rem 2rem;
  border-radius: 16px;
  margin: 3rem 0;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3), 0 0 20px rgba(240, 147, 251, 0.3);
}

.stats-container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 3rem;
  max-width: 1200px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
  animation: fadeInUp 0.8s ease-out;
}

.stat-number {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  color: #ffffff;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  margin: 0 0 0.5rem 0;
  display: block;
}

.stat-label {
  font-size: 1rem;
  color: rgba(255, 255, 255, 0.9);
  font-weight: 600;
  letter-spacing: 1px;
  text-transform: uppercase;
  display: block;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ========== CATEGORIES SECTION ========== */

.categories-section {
  padding: 3rem 0;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1.5rem;
}

.category-card {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 12px;
  padding: 2rem 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  text-decoration: none;
  color: inherit;
  display: block;
}

.category-card::before {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  z-index: -1;
}

.category-card:hover {
  transform: translateY(-8px) scale(1.05);
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.3), 0 0 20px rgba(240, 147, 251, 0.3);
  border-color: #f093fb;
}

.category-card:hover::before {
  opacity: 0.15;
}

.category-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
  transition: transform 0.3s ease;
  display: block;
}

.category-card:hover .category-icon {
  transform: scale(1.2) rotate(-10deg);
}

.category-name {
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  display: block;
}

.category-count {
  color: #a8a8a8;
  font-size: 0.9rem;
  font-weight: 500;
  display: block;
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

/* ========== CARD LINKS ========== */

.card-link {
  position: absolute;
  inset: 0;
  text-decoration: none;
  z-index: 5;
}

/* ========== RESPONSIVE ========== */

@media (max-width: 768px) {
  .hero-section {
    height: auto;
    padding: 4rem 0 2rem 0;
    min-height: 70vh;
  }

  .hero-content h1 {
    font-size: 2rem;
  }

  .cta-buttons {
    flex-direction: column;
  }

  .cta-btn {
    width: 100%;
  }

  .carousel-item {
    flex: 0 0 80vw;
  }

  .posts-grid {
    grid-template-columns: 1fr;
  }

  .categories-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .hero-content h1 {
    font-size: 1.5rem;
  }

  .hero-content .subtitle {
    font-size: 0.9rem;
  }

  .carousel-item {
    flex: 0 0 90vw;
  }

  .categories-grid {
    grid-template-columns: 1fr;
  }

  .stat-number {
    font-size: 2rem;
  }

  .scroll-indicator {
    bottom: 1rem;
  }
}
</style>
