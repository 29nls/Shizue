<template>
  <div class="item-detail-page">
    <!-- Breadcrumb -->
    <nav class="breadcrumb-nav">
      <ul>
        <li><NuxtLink to="/">Beranda</NuxtLink></li>
        <li><NuxtLink to="/catalog">Katalog</NuxtLink></li>
        <li v-if="item?.category"><NuxtLink :to="`/category/${item.category.slug}`">{{ item.category.name }}</NuxtLink></li>
        <li v-if="item?.name" class="active">{{ item.name }}</li>
      </ul>
    </nav>

    <!-- Item Detail Container -->
    <div v-if="item" class="item-detail-container">
      <div class="item-detail-grid">
        <!-- Left: Image Gallery -->
        <div class="image-section">
          <div class="main-image">
            <img :src="item.mainImage" :alt="item.name" loading="lazy" />
            <span v-if="item.isOnSale" class="sale-badge">-{{ Math.round(item.discount || 0) }}%</span>
            <span v-if="item.isFeatured" class="featured-badge">Unggulan</span>
          </div>
          <div v-if="galleryImages.length" class="thumbnail-gallery">
            <img
              v-for="(img, idx) in galleryImages.slice(0, 5)"
              :key="idx"
              :src="img"
              :alt="`${item.name} ${idx + 1}`"
              @click="selectedImage = img"
              :class="{ active: selectedImage === img }"
              loading="lazy"
            />
          </div>
        </div>

        <!-- Right: Item Info & Actions -->
        <div class="info-section">
          <!-- Header -->
          <div class="item-header">
            <h1>{{ item.name }}</h1>
            <div class="meta-info">
              <span class="rarity" :class="item.rarity">{{ rarityLabel(item.rarity) }}</span>
              <span class="rating">
                <span class="stars">★ {{ item.rating.toFixed(1) }}</span>
                <span class="count">({{ item.reviewCount }} ulasan)</span>
              </span>
            </div>
          </div>

          <!-- Pricing -->
          <div class="pricing-section">
            <div class="price-container">
              <span class="current-price">Rp {{ formatPrice(item.price) }}</span>
              <span v-if="item.originalPrice" class="original-price">Rp {{ formatPrice(item.originalPrice) }}</span>
              <span v-if="item.discount" class="discount-info">Hemat Rp {{ formatPrice((item.originalPrice || item.price) - item.price) }}</span>
            </div>
          </div>

          <!-- Availability -->
          <div class="availability">
            <span :class="['stock-status', item.stock > 0 ? 'in-stock' : 'out-of-stock']">
              {{ item.stock > 0 ? `Stok: ${item.stock}` : 'Habis Terjual' }}
            </span>
          </div>

          <!-- Specifications -->
          <div v-if="specs.length" class="specs-section">
            <h3>Spesifikasi</h3>
            <table class="specs-table">
              <tbody>
                <tr v-for="spec in specs" :key="spec.label">
                  <td class="label">{{ spec.label }}</td>
                  <td class="value">{{ spec.value }}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Requirements -->
          <div v-if="item.levelRequirement || item.classRequirement" class="requirements">
            <h4>Persyaratan Penggunaan</h4>
            <ul>
              <li v-if="item.levelRequirement">Level Minimum: {{ item.levelRequirement }}</li>
              <li v-if="item.classRequirement">Kelas: {{ item.classRequirement }}</li>
            </ul>
          </div>

          <!-- Actions -->
          <div class="action-buttons">
            <button class="btn btn-primary" :disabled="item.stock === 0">
              🛒 Masukkan ke Keranjang
            </button>
            <button class="btn btn-secondary" @click="toggleWishlist">
              {{ isWishlisted ? '❤️' : '🤍' }} Wishlist
            </button>
          </div>

          <!-- Description -->
          <div class="description-section">
            <h3>Deskripsi</h3>
            <p>{{ item.description }}</p>
          </div>
        </div>
      </div>

      <!-- Reviews Section -->
      <div class="reviews-section">
        <h2>Ulasan Pelanggan</h2>
        
        <!-- Review Summary -->
        <div class="review-summary">
          <div class="rating-average">
            <div class="big-number">{{ item.rating.toFixed(1) }}</div>
            <div class="stars">★★★★★</div>
            <div class="count">Berdasarkan {{ item.reviewCount }} ulasan</div>
          </div>

          <!-- Add Review Button -->
          <button class="btn btn-outline">💬 Tulis Ulasan Anda</button>
        </div>

        <!-- Reviews List -->
        <div class="reviews-list">
          <div v-for="review in item.reviews" :key="review.id" class="review-card">
            <div class="review-header">
              <div class="author-info">
                <strong>{{ review.author }}</strong>
                <span class="rating-stars">★ {{ review.rating }}</span>
              </div>
              <span class="review-date">{{ formatDate(review.createdAt) }}</span>
            </div>
            <div v-if="review.title" class="review-title">{{ review.title }}</div>
            <p class="review-content">{{ review.content }}</p>
            <div v-if="review.imageUrl" class="review-image">
              <img :src="review.imageUrl" :alt="review.title || review.author" loading="lazy" />
            </div>
            <div class="review-actions">
              <button @click="helpful(review.id)">👍 Bermanfaat ({{ review.helpfulCount }})</button>
              <button @click="unhelpful(review.id)">👎 Tidak bermanfaat ({{ review.unhelpfulCount }})</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Related Items -->
      <div v-if="relatedItems.length" class="related-items-section">
        <h2>Produk Terkait</h2>
        <div class="items-grid">
          <div v-for="relatedItem in relatedItems.slice(0, 4)" :key="relatedItem.id" class="item-card">
            <NuxtLink :to="`/item/${relatedItem.slug}`">
              <div class="item-image">
                <img :src="relatedItem.mainImage" :alt="relatedItem.name" loading="lazy" />
                <span v-if="relatedItem.isOnSale" class="sale-badge">-{{ Math.round(relatedItem.discount || 0) }}%</span>
              </div>
              <div class="item-info">
                <h3>{{ truncate(relatedItem.name, 40) }}</h3>
                <div class="price">Rp {{ formatPrice(relatedItem.price) }}</div>
                <div class="rating">★ {{ relatedItem.rating.toFixed(1) }} ({{ relatedItem.reviewCount }})</div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Loading State -->
    <div v-else-if="loading" class="loading-state">
      <MACENGLoader />
    </div>

    <!-- Error State -->
    <div v-else class="error-state">
      <h2>Item tidak ditemukan</h2>
      <p>Maaf, item yang Anda cari tidak tersedia.</p>
      <NuxtLink to="/catalog" class="btn btn-primary">Kembali ke Katalog</NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface ItemDetail {
  id: string
  name: string
  slug: string
  description: string
  shortDescription?: string
  price: number
  originalPrice?: number
  discount?: number
  stock: number
  rarity: string
  levelRequirement?: number
  classRequirement?: string
  mainImage: string
  galleryImages?: string
  specs?: string
  rating: number
  reviewCount: number
  isActive: boolean
  isDraft: boolean
  isFeatured: boolean
  isOnSale: boolean
  category: {
    id: string
    name: string
    slug: string
  }
  reviews: Array<{
    id: string
    author: string
    rating: number
    title?: string
    content: string
    imageUrl?: string
    createdAt: string
    helpfulCount: number
    unhelpfulCount: number
  }>
}

const route = useRoute()
const loading = ref(true)
const item = ref<ItemDetail | null>(null)
const selectedImage = ref('')
const isWishlisted = ref(false)
const relatedItems = ref<any[]>([])

// Fetch item detail
onMounted(async () => {
  try {
    const slug = route.params.slug as string
    const { data } = await $fetch(`/api/items/${slug}`)
    item.value = data
    selectedImage.value = data.mainImage

    // Fetch related items
    if (data.category?.id) {
      const relatedRes = await $fetch('/api/items', {
        query: {
          categoryId: data.category.id,
          limit: 8,
        },
      })
      relatedItems.value = relatedRes.data.filter((i: any) => i.id !== data.id)
    }
  } catch (error) {
    console.error('Error loading item:', error)
    item.value = null
  } finally {
    loading.value = false
  }
})

// Computed properties
const galleryImages = computed(() => {
  if (!item.value?.galleryImages) return []
  try {
    return JSON.parse(item.value.galleryImages)
  } catch {
    return []
  }
})

const specs = computed(() => {
  if (!item.value?.specs) return []
  try {
    return JSON.parse(item.value.specs)
  } catch {
    return []
  }
})

// Helper functions
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(Math.round(price))
}

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

const truncate = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}

const rarityLabel = (rarity: string) => {
  const labels: Record<string, string> = {
    common: 'Biasa',
    uncommon: 'Langka',
    rare: 'Sangat Langka',
    epic: 'Epik',
    legendary: 'Legendaris',
  }
  return labels[rarity] || rarity
}

const toggleWishlist = () => {
  isWishlisted.value = !isWishlisted.value
  // TODO: Call API to save/remove from wishlist
}

const helpful = (reviewId: string) => {
  // TODO: Call API to mark as helpful
}

const unhelpful = (reviewId: string) => {
  // TODO: Call API to mark as unhelpful
}
</script>

<style scoped lang="scss">
.item-detail-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding: 2rem 0;

  .breadcrumb-nav {
    margin-bottom: 2rem;
    padding: 0 2rem;
    
    ul {
      list-style: none;
      display: flex;
      gap: 0.5rem;
      align-items: center;
      
      li {
        &:not(:last-child)::after {
          content: '/';
          margin: 0 0.5rem;
          color: #ccc;
        }
        
        &.active {
          color: #666;
          font-weight: 600;
        }
        
        a {
          color: #0066cc;
          text-decoration: none;
          
          &:hover {
            text-decoration: underline;
          }
        }
      }
    }
  }

  .item-detail-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
  }

  .item-detail-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    margin-bottom: 4rem;
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    @media (max-width: 768px) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  .image-section {
    .main-image {
      position: relative;
      width: 100%;
      aspect-ratio: 1;
      background: #f0f0f0;
      border-radius: 8px;
      overflow: hidden;
      margin-bottom: 1rem;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .sale-badge,
      .featured-badge {
        position: absolute;
        padding: 0.5rem 1rem;
        background: #ff4444;
        color: white;
        font-weight: 700;
        border-radius: 4px;
        font-size: 0.875rem;
      }

      .featured-badge {
        background: #4a90e2;
        left: 1rem;
        top: 1rem;
      }

      .sale-badge {
        right: 1rem;
        top: 1rem;
      }
    }

    .thumbnail-gallery {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(60px, 1fr));
      gap: 0.5rem;

      img {
        width: 100%;
        aspect-ratio: 1;
        object-fit: cover;
        border-radius: 4px;
        cursor: pointer;
        border: 2px solid transparent;
        transition: border-color 0.2s;

        &:hover,
        &.active {
          border-color: #0066cc;
        }
      }
    }
  }

  .info-section {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .item-header {
    h1 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
    }

    .meta-info {
      display: flex;
      gap: 1rem;
      align-items: center;
      font-size: 0.95rem;

      .rarity {
        padding: 0.25rem 0.75rem;
        border-radius: 20px;
        font-weight: 600;
        font-size: 0.85rem;

        &.common {
          background: #e0e0e0;
          color: #333;
        }

        &.uncommon {
          background: #d4edda;
          color: #155724;
        }

        &.rare {
          background: #bee5eb;
          color: #0c5460;
        }

        &.epic {
          background: #e2d4f5;
          color: #6610f2;
        }

        &.legendary {
          background: #fff3cd;
          color: #856404;
        }
      }

      .rating {
        display: flex;
        gap: 0.5rem;
        align-items: center;

        .stars {
          color: #ffc107;
          font-weight: 700;
        }

        .count {
          color: #666;
        }
      }
    }
  }

  .pricing-section {
    padding: 1.5rem;
    background: #f8f9fa;
    border-radius: 8px;
    border-left: 4px solid #0066cc;

    .price-container {
      display: flex;
      gap: 1rem;
      align-items: center;
      flex-wrap: wrap;

      .current-price {
        font-size: 2rem;
        font-weight: 700;
        color: #e74c3c;
      }

      .original-price {
        text-decoration: line-through;
        color: #999;
        font-size: 1rem;
      }

      .discount-info {
        background: #fff3cd;
        color: #856404;
        padding: 0.25rem 0.75rem;
        border-radius: 4px;
        font-size: 0.875rem;
        font-weight: 600;
      }
    }
  }

  .availability {
    padding: 0.75rem 1rem;
    border-radius: 6px;

    .stock-status {
      font-weight: 600;
      font-size: 1rem;

      &.in-stock {
        background: #d4edda;
        color: #155724;
        padding: 0.5rem 1rem;
        border-radius: 4px;
      }

      &.out-of-stock {
        background: #f8d7da;
        color: #721c24;
        padding: 0.5rem 1rem;
        border-radius: 4px;
      }
    }
  }

  .specs-section {
    h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: #1a1a1a;
    }

    .specs-table {
      width: 100%;
      border-collapse: collapse;

      td {
        padding: 0.75rem;
        border-bottom: 1px solid #eee;

        &.label {
          font-weight: 600;
          color: #666;
          width: 40%;
        }

        &.value {
          color: #1a1a1a;
        }
      }
    }
  }

  .requirements {
    background: #f8f9fa;
    padding: 1rem;
    border-radius: 6px;

    h4 {
      font-size: 0.95rem;
      margin-bottom: 0.75rem;
      color: #1a1a1a;
    }

    ul {
      list-style: none;
      padding: 0;

      li {
        padding: 0.5rem 0;
        color: #666;

        &::before {
          content: '✓ ';
          color: #27ae60;
          font-weight: 700;
          margin-right: 0.5rem;
        }
      }
    }
  }

  .action-buttons {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin: 1rem 0;

    .btn {
      padding: 1rem;
      border: none;
      border-radius: 6px;
      font-weight: 600;
      font-size: 1rem;
      cursor: pointer;
      transition: all 0.2s;

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .btn-primary {
      background: #0066cc;
      color: white;

      &:hover:not(:disabled) {
        background: #0052a3;
      }
    }

    .btn-secondary {
      background: #f0f0f0;
      color: #1a1a1a;
      border: 1px solid #ddd;

      &:hover {
        background: #e0e0e0;
      }
    }
  }

  .description-section {
    h3 {
      font-size: 1.1rem;
      margin-bottom: 1rem;
      color: #1a1a1a;
    }

    p {
      color: #666;
      line-height: 1.6;
      white-space: pre-wrap;
    }
  }

  .reviews-section {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    margin-bottom: 3rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      color: #1a1a1a;
    }

    .review-summary {
      display: grid;
      grid-template-columns: auto 1fr;
      gap: 2rem;
      margin-bottom: 2rem;
      padding-bottom: 2rem;
      border-bottom: 1px solid #eee;
      align-items: center;

      .rating-average {
        text-align: center;

        .big-number {
          font-size: 3rem;
          font-weight: 700;
          color: #ffc107;
        }

        .stars {
          font-size: 1.5rem;
          color: #ffc107;
          letter-spacing: 0.25rem;
        }

        .count {
          color: #666;
          font-size: 0.9rem;
          margin-top: 0.5rem;
        }
      }
    }

    .reviews-list {
      .review-card {
        padding: 1.5rem;
        border-bottom: 1px solid #eee;

        &:last-child {
          border-bottom: none;
        }

        .review-header {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.75rem;
          align-items: start;

          .author-info {
            display: flex;
            gap: 1rem;
            align-items: center;

            strong {
              color: #1a1a1a;
            }

            .rating-stars {
              color: #ffc107;
              font-weight: 600;
            }
          }

          .review-date {
            color: #999;
            font-size: 0.875rem;
          }
        }

        .review-title {
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .review-content {
          color: #666;
          margin-bottom: 1rem;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .review-image {
          max-width: 300px;
          margin-bottom: 1rem;

          img {
            width: 100%;
            border-radius: 6px;
          }
        }

        .review-actions {
          display: flex;
          gap: 1rem;

          button {
            padding: 0.5rem 1rem;
            background: none;
            border: 1px solid #ddd;
            border-radius: 4px;
            cursor: pointer;
            color: #666;
            font-size: 0.875rem;
            transition: all 0.2s;

            &:hover {
              background: #f0f0f0;
              border-color: #999;
            }
          }
        }
      }
    }
  }

  .related-items-section {
    background: white;
    padding: 2rem;
    border-radius: 8px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    h2 {
      font-size: 1.5rem;
      margin-bottom: 2rem;
      color: #1a1a1a;
    }

    .items-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 1.5rem;

      .item-card {
        border-radius: 8px;
        overflow: hidden;
        background: #f9f9f9;
        transition: transform 0.2s, box-shadow 0.2s;

        &:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
        }

        a {
          text-decoration: none;
          color: inherit;
          display: flex;
          flex-direction: column;
          height: 100%;
        }

        .item-image {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          overflow: hidden;
          background: #e0e0e0;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.3s;

            &:hover {
              transform: scale(1.05);
            }
          }

          .sale-badge {
            position: absolute;
            top: 0.5rem;
            right: 0.5rem;
            background: #ff4444;
            color: white;
            padding: 0.25rem 0.75rem;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 700;
          }
        }

        .item-info {
          padding: 1rem;
          flex: 1;
          display: flex;
          flex-direction: column;

          h3 {
            font-size: 0.95rem;
            margin-bottom: 0.5rem;
            color: #1a1a1a;
          }

          .price {
            font-weight: 700;
            color: #e74c3c;
            margin-bottom: 0.25rem;
          }

          .rating {
            font-size: 0.85rem;
            color: #666;
            margin-top: auto;

            &::before {
              content: '★ ';
              color: #ffc107;
            }
          }
        }
      }
    }
  }

  .loading-state,
  .error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    min-height: 400px;
    gap: 1rem;

    h2 {
      color: #1a1a1a;
      font-size: 1.5rem;
    }

    p {
      color: #666;
    }

    .btn {
      margin-top: 1rem;
    }
  }
}
</style>
