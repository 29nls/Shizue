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

    <!-- Featured Items Section -->
    <section class="featured-items-section">
      <div class="section-header">
        <h2>Item Unggulan</h2>
      </div>
      <div class="items-grid">
        <div v-for="item in featuredItems" :key="item.id" class="item-card">
          <div class="item-image">
            <img v-if="item.mainImage" :src="item.mainImage" :alt="item.name" />
            <div v-else class="placeholder-image">No Image</div>
            <span v-if="item.isOnSale" class="sale-badge">SALE</span>
          </div>
          <div class="item-content">
            <h3>{{ item.name }}</h3>
            <p class="item-category">{{ item.category?.name || 'Uncategorized' }}</p>
            <p class="item-rating">★ {{ item.rating.toFixed(1) }} ({{ item.reviewCount }})</p>
            <div class="item-price">
              <span class="current">Rp {{ item.price.toLocaleString('id-ID') }}</span>
              <span v-if="item.originalPrice" class="original">Rp {{ item.originalPrice.toLocaleString('id-ID') }}</span>
            </div>
            <button class="btn-add-cart" @click="addToCart(item.id)">Tambah ke Keranjang</button>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories Section -->
    <section class="categories-section">
      <div class="section-header">
        <h2>Kategori Populer</h2>
      </div>
      <div class="categories-grid">
        <NuxtLink v-for="category in categories" :key="category.id" :to="`/category/${category.slug}`" class="category-card">
          <div class="category-icon">📦</div>
          <h3>{{ category.name }}</h3>
          <p>{{ category.itemCount || 0 }} item</p>
        </NuxtLink>
      </div>
    </section>

    <!-- Why Choose Us Section -->
    <section class="why-us">
      <div class="section-header">
        <h2>Mengapa Memilih Kami?</h2>
      </div>
      <div class="features-grid">
        <div class="feature">
          <div class="feature-icon">🚚</div>
          <h4>Pengiriman Cepat</h4>
          <p>Gratis ongkos kirim untuk pembelian di atas Rp 500.000</p>
        </div>
        <div class="feature">
          <div class="feature-icon">💰</div>
          <h4>Harga Terbaik</h4>
          <p>Harga paling kompetitif dengan kualitas terjamin</p>
        </div>
        <div class="feature">
          <div class="feature-icon">✅</div>
          <h4>Produk Original</h4>
          <p>Semua produk dijamin original 100%</p>
        </div>
      </div>
    </section>

    <!-- Reviews Section -->
    <section class="reviews-section">
      <div class="section-header">
        <h2>Testimoni Pelanggan</h2>
      </div>
      <div class="reviews-grid">
        <div v-for="review in topReviews" :key="review.id" class="review-card">
          <div class="review-rating">{{ '★'.repeat(review.rating) }}</div>
          <p class="review-text">{{ review.content }}</p>
          <p class="review-author">— {{ review.author }}</p>
        </div>
      </div>
    </section>

    <!-- Newsletter Section -->
    <NewsletterSignup :animate="true" />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

const config = useRuntimeConfig()
const siteTitle = config.public.siteTitle
const siteSubtitle = config.public.siteSubtitle
const siteDescription = config.public.siteDescription

const featuredItems = ref([])
const categories = ref([])
const topReviews = ref([])

const addToCart = (itemId: number) => {
  // Placeholder for cart functionality
  console.log('Adding item', itemId, 'to cart')
}

onMounted(async () => {
  try {
    // Fetch featured items
    const itemsRes = await $fetch('/api/items', {
      query: { take: 6 }
    })
    if (itemsRes.success) {
      featuredItems.value = itemsRes.data
    }

    // Fetch categories
    const categoriesRes = await $fetch('/api/categories')
    if (categoriesRes.success) {
      categories.value = categoriesRes.data
    }

    // Fetch top reviews
    const reviewsRes = await $fetch('/api/reviews', {
      query: { take: 3 }
    })
    if (reviewsRes.success) {
      topReviews.value = reviewsRes.data
    }
  } catch (error) {
    console.error('Error fetching data:', error)
  }
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
.store-home {
  width: 100%;
}

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

/* Section Headers */
.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-header h2 {
  font-size: 2.2rem;
  margin: 0;
}

.section-header p {
  color: #666;
  margin-top: 0.5rem;
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

.item-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
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

/* Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }

  .items-grid {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
}
</style>
