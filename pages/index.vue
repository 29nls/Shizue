<template>
  <div class="store-home">
    <!-- Hero Section -->
    <section class="hero">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Perlengkapan Dragon Nest Terlengkap</h1>
        <p class="hero-subtitle">Ribuan item siap meningkatkan petualangan Anda</p>
        <NuxtLink to="/catalog" class="hero-cta">Jelajahi Sekarang</NuxtLink>
      </div>
    </section>

    <!-- Promo Banner -->
    <section class="promo-banner">
      <div class="promo-card">
        <span class="promo-icon">⚡</span>
        <h3>Flash Sale</h3>
        <p>Diskon hingga 50% untuk item pilihan</p>
        <NuxtLink to="/catalog?filter=sale" class="promo-link">Lihat Diskon →</NuxtLink>
      </div>
      <div class="promo-card">
        <span class="promo-icon">🆕</span>
        <h3>Item Baru</h3>
        <p>Produk terbaru minggu ini</p>
        <NuxtLink to="/catalog?sort=newest" class="promo-link">Lihat Baru →</NuxtLink>
      </div>
      <div class="promo-card">
        <span class="promo-icon">⭐</span>
        <h3>Terpercaya</h3>
        <p>2,150+ pelanggan puas</p>
        <a href="#reviews" class="promo-link">Lihat Ulasan →</a>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="section-header">
        <h2>Kategori Utama</h2>
        <p>Temukan item yang Anda cari</p>
      </div>
      <div class="categories-grid">
        <NuxtLink to="/catalog/equipment" class="category-card">
          <div class="category-icon">📦</div>
          <h3>Equipment</h3>
          <p>150+ item</p>
        </NuxtLink>
        <NuxtLink to="/catalog/consumables" class="category-card">
          <div class="category-icon">🧪</div>
          <h3>Consumables</h3>
          <p>200+ item</p>
        </NuxtLink>
        <NuxtLink to="/catalog/materials" class="category-card">
          <div class="category-icon">⚙️</div>
          <h3>Materials</h3>
          <p>180+ item</p>
        </NuxtLink>
        <NuxtLink to="/catalog/enhancement" class="category-card">
          <div class="category-icon">✨</div>
          <h3>Enhancement</h3>
          <p>120+ item</p>
        </NuxtLink>
      </div>
    </section>

    <!-- Featured Items Section -->
    <section class="featured-items-section">
      <div class="section-header">
        <h2>Item Unggulan</h2>
        <NuxtLink to="/catalog" class="view-all">Lihat Semua →</NuxtLink>
      </div>
      <div class="items-grid">
        <div v-for="i in 8" :key="i" class="item-card">
          <div class="item-image">
            <div class="placeholder-image">
              <span>Item Image {{ i }}</span>
            </div>
            <span v-if="i % 3 === 0" class="sale-badge">-30%</span>
          </div>
          <div class="item-content">
            <h3>Sword of Destiny {{ i }}</h3>
            <p class="item-category">Equipment • Weapon</p>
            <p class="item-rating">⭐ 4.5 (128 ulasan)</p>
            <div class="item-price">
              <span class="current">Rp 150.000</span>
              <span v-if="i % 3 === 0" class="original">Rp 200.000</span>
            </div>
            <button class="btn-add-cart">+ Keranjang</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Why Choose Us -->
    <section class="why-us">
      <div class="section-header">
        <h2>Mengapa Memilih MACENG MARKET?</h2>
      </div>
      <div class="features-grid">
        <div class="feature">
          <span class="feature-icon">🚚</span>
          <h4>Pengiriman Cepat</h4>
          <p>Barang sampai dalam 1-2 hari kerja</p>
        </div>
        <div class="feature">
          <span class="feature-icon">💰</span>
          <h4>Harga Terbaik</h4>
          <p>Harga kompetitif dengan kualitas terjamin</p>
        </div>
        <div class="feature">
          <span class="feature-icon">🔒</span>
          <h4>Aman & Terpercaya</h4>
          <p>Transaksi aman dengan enkripsi tingkat bank</p>
        </div>
        <div class="feature">
          <span class="feature-icon">💬</span>
          <h4>Support 24/7</h4>
          <p>Tim support siap membantu kapan saja</p>
        </div>
      </div>
    </section>

    <!-- Reviews Section -->
    <section class="reviews-section" id="reviews">
      <div class="section-header">
        <h2>Ulasan Pelanggan</h2>
      </div>
      <div class="reviews-grid">
        <div class="review-card">
          <p class="review-rating">⭐⭐⭐⭐⭐</p>
          <p class="review-text">"Barangnya original dan pengiriman cepat! Sangat puas dengan pelayanan MACENG MARKET."</p>
          <p class="review-author">- PlayerXXX</p>
        </div>
        <div class="review-card">
          <p class="review-rating">⭐⭐⭐⭐⭐</p>
          <p class="review-text">"Harga murah, kualitas bagus. Definitely recommend untuk semua Dragon Nest players!"</p>
          <p class="review-author">- GamerPro</p>
        </div>
        <div class="review-card">
          <p class="review-rating">⭐⭐⭐⭐⭐</p>
          <p class="review-text">"Customer service yang responsif dan helpful. Suka banget belanja di sini!"</p>
          <p class="review-author">- BuddyHero</p>
        </div>
      </div>
    </section>

    <!-- Newsletter Section (Reused from blog, adapted for store) -->
    <section class="newsletter-section">
      <div class="newsletter-content">
        <h2>Jangan Lewatkan Update Terbaru!</h2>
        <p>Dapatkan notifikasi untuk item baru dan flash sale</p>
        <div class="newsletter-form">
          <input type="email" placeholder="Masukkan email Anda..." />
          <button class="btn-subscribe">Subscribe</button>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const config = useRuntimeConfig()
const siteTitle = config.public.siteTitle || 'MACENG MARKET'
const siteSubtitle = config.public.siteSubtitle || 'Dragon Nest Item Store'

// TODO: Replace with actual API calls when backend is ready
const items = ref([
  { id: 1, name: 'Sword of Destiny', category: 'Equipment', price: 150000, rating: 4.5 },
  { id: 2, name: 'Shield of Protection', category: 'Equipment', price: 120000, rating: 4.3 },
])

</script>

<style scoped>
/* Hero Section */
.hero {
  position: relative;
  height: 500px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 600"><defs><pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="1"/></pattern></defs><rect width="1200" height="600" fill="url(%23grid)" /></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 2;
  text-align: center;
  max-width: 600px;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.hero-subtitle {
  font-size: 1.3rem;
  margin-bottom: 3rem;
  opacity: 0.95;
}

.hero-cta {
  display: inline-block;
  padding: 14px 40px;
  background: white;
  color: #667eea;
  text-decoration: none;
  border-radius: 50px;
  font-weight: 600;
  transition: all 0.3s ease;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.hero-cta:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.3);
}

/* Promo Banner */
.promo-banner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  padding: 3rem 2rem;
  background: #f8f9fa;
}

.promo-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.promo-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.promo-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.promo-card h3 {
  margin: 0.5rem 0;
  font-size: 1.3rem;
}

.promo-card p {
  color: #666;
  margin: 0.5rem 0 1.5rem;
}

.promo-link {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  transition: color 0.3s ease;
}

.promo-link:hover {
  color: #764ba2;
}

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.section-header h2 {
  font-size: 2.2rem;
  margin: 0;
  flex: 1;
  text-align: center;
}

.section-header p {
  color: #666;
  margin-top: 0.5rem;
  width: 100%;
  text-align: center;
  grid-column: 1 / -1;
}

.view-all {
  color: #667eea;
  text-decoration: none;
  font-weight: 600;
  white-space: nowrap;
}

/* Categories Section */
.categories-section {
  padding: 4rem 2rem;
}

.categories-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.category-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  text-align: center;
  text-decoration: none;
  color: inherit;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.category-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
  background: linear-gradient(135deg, #667eea15 0%, #764ba215 100%);
}

.category-icon {
  font-size: 2.5rem;
  margin-bottom: 1rem;
}

.category-card h3 {
  margin: 0.5rem 0;
  font-size: 1.2rem;
}

.category-card p {
  color: #666;
  margin: 0;
  font-size: 0.9rem;
}

/* Featured Items Section */
.featured-items-section {
  padding: 4rem 2rem;
  background: white;
}

.items-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
  margin-top: 2rem;
}

.item-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.item-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.15);
}

.item-image {
  position: relative;
  height: 150px;
  background: #f0f0f0;
  overflow: hidden;
}

.placeholder-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea20 0%, #764ba220 100%);
  color: #999;
  font-size: 0.9rem;
}

.sale-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff4757;
  color: white;
  padding: 4px 8px;
  border-radius: 6px;
  font-weight: 600;
  font-size: 0.8rem;
}

.item-content {
  padding: 1rem;
}

.item-content h3 {
  margin: 0 0 0.5rem;
  font-size: 1rem;
}

.item-category {
  color: #666;
  font-size: 0.85rem;
  margin: 0.25rem 0;
}

.item-rating {
  color: #f39c12;
  font-size: 0.9rem;
  margin: 0.25rem 0 0.5rem;
}

.item-price {
  display: flex;
  gap: 0.5rem;
  margin: 0.75rem 0;
  align-items: center;
}

.item-price .current {
  font-size: 1.1rem;
  font-weight: 700;
  color: #667eea;
}

.item-price .original {
  font-size: 0.9rem;
  color: #999;
  text-decoration: line-through;
}

.btn-add-cart {
  width: 100%;
  padding: 0.75rem;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: background 0.3s ease;
}

.btn-add-cart:hover {
  background: #764ba2;
}

/* Why Us Section */
.why-us {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea10 0%, #764ba210 100%);
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.feature {
  text-align: center;
}

.feature-icon {
  font-size: 2.5rem;
  display: block;
  margin-bottom: 1rem;
}

.feature h4 {
  margin: 0.5rem 0;
  font-size: 1.1rem;
}

.feature p {
  color: #666;
  margin: 0;
}

/* Reviews Section */
.reviews-section {
  padding: 4rem 2rem;
}

.reviews-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.review-card {
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.review-rating {
  margin: 0 0 1rem;
  font-size: 1.2rem;
}

.review-text {
  color: #333;
  margin: 1rem 0;
  line-height: 1.6;
}

.review-author {
  color: #666;
  margin: 0;
  font-weight: 600;
}

/* Newsletter Section */
.newsletter-section {
  padding: 4rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.newsletter-content {
  max-width: 500px;
  margin: 0 auto;
  text-align: center;
}

.newsletter-content h2 {
  margin: 0 0 1rem;
  font-size: 2rem;
}

.newsletter-content p {
  margin: 0 0 2rem;
  opacity: 0.9;
}

.newsletter-form {
  display: flex;
  gap: 0.5rem;
}

.newsletter-form input {
  flex: 1;
  padding: 12px 16px;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
}

.newsletter-form input::placeholder {
  color: #999;
}

.btn-subscribe {
  padding: 12px 24px;
  background: white;
  color: #667eea;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-subscribe:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .section-header {
    flex-direction: column;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>

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
      <div class="section-title" data-aos="fade-up">
        <h2>Featured Posts</h2>
        <p>Latest and most popular stories</p>
      </div>

      <div class="carousel-container">
        <div class="carousel">
          <div
            v-for="(post, index) in posts.slice(0, 6)"
            :key="index"
            class="carousel-item"
            :data-aos="`fade-up`"
            :data-aos-delay="`${index * 100}`"
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
    <section class="stats-section" data-aos="fade-up">
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
      <div class="section-title" data-aos="fade-up">
        <h2>All Posts</h2>
        <p>Explore our complete collection</p>
      </div>

      <div class="posts-grid">
        <div
          v-for="(post, index) in posts"
          :key="index"
          class="post-card"
          :data-aos="`fade-up`"
          :data-aos-delay="`${(index % 6) * 100}`"
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
      <div class="section-title" data-aos="fade-up">
        <h2>Browse by Category</h2>
        <p>Find content that interests you</p>
      </div>

      <div class="categories-grid">
        <NuxtLink
          v-for="category in categories.slice(0, 8)"
          :key="category"
          :to="`/category/${category}`"
          class="category-card"
          data-aos="zoom-in"
        >
          <div class="category-icon">📁</div>
          <div class="category-name">{{ category }}</div>
          <div class="category-count">
            {{ getPostCountByCategory(category) }} {{ getPostCountByCategory(category) === 1 ? 'post' : 'posts' }}
          </div>
        </NuxtLink>
      </div>
    </section>

    <!-- Newsletter Section -->
    <NewsletterSignup :animate="true" />
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
