<template>
  <div class="category-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1>{{ category?.name || 'Kategori' }}</h1>
      <p>{{ category?.description || '' }}</p>
    </div>

    <div class="category-container">
      <!-- Category Info -->
      <div v-if="category" class="category-info">
        <img v-if="category.image" :src="category.image" :alt="category.name" class="category-image" />
        <div class="category-meta">
          <h2>{{ category.name }}</h2>
          <p>Total {{ totalItems }} item tersedia di kategori ini</p>
        </div>
      </div>

      <!-- Filters & Items Grid -->
      <div class="content-grid">
        <aside class="filters-sidebar">
          <button class="filters-toggle" @click="showFilters = !showFilters">
            {{ showFilters ? '✕ Tutup Filter' : '☰ Filter' }}
          </button>

          <div v-if="showFilters" class="filters-panel">
            <!-- Search -->
            <div class="filter-group">
              <h3>Cari</h3>
              <input
                v-model="searchQuery"
                type="text"
                placeholder="Cari item..."
                class="search-input"
                @input="handleSearch"
              />
            </div>

            <!-- Rarity Filter -->
            <div class="filter-group">
              <h3>Kelangkaan</h3>
              <div class="filter-options">
                <label v-for="r in rarities" :key="r.value" class="filter-checkbox">
                  <input
                    type="checkbox"
                    :value="r.value"
                    v-model="selectedRarities"
                    @change="applyFilters"
                  />
                  <span :class="['rarity-badge', r.value]">{{ r.label }}</span>
                </label>
              </div>
            </div>

            <!-- Price Range -->
            <div class="filter-group">
              <h3>Harga</h3>
              <div class="price-inputs">
                <input
                  v-model.number="minPrice"
                  type="number"
                  placeholder="Min"
                  class="price-input"
                  @change="applyFilters"
                />
                <span>-</span>
                <input
                  v-model.number="maxPrice"
                  type="number"
                  placeholder="Max"
                  class="price-input"
                  @change="applyFilters"
                />
              </div>
              <button class="btn btn-sm" @click="applyFilters">Terapkan</button>
            </div>

            <!-- Sort -->
            <div class="filter-group">
              <h3>Urutan</h3>
              <select v-model="sortBy" @change="applyFilters" class="sort-select">
                <option value="newest">Terbaru</option>
                <option value="price-asc">Harga: Terendah</option>
                <option value="price-desc">Harga: Tertinggi</option>
                <option value="rating">Rating Tertinggi</option>
                <option value="popular">Paling Populer</option>
              </select>
            </div>
          </div>
        </aside>

        <!-- Main Content -->
        <main class="category-main">
          <!-- Results Info -->
          <div class="results-header">
            <p>{{ totalItems }} item ditemukan</p>
            <select v-model="sortBy" @change="applyFilters" class="sort-select-mobile">
              <option value="newest">Terbaru</option>
              <option value="price-asc">Harga Terendah</option>
              <option value="price-desc">Harga Tertinggi</option>
              <option value="rating">Rating</option>
              <option value="popular">Populer</option>
            </select>
          </div>

          <!-- Items Grid -->
          <div v-if="items.length" class="items-grid">
            <div v-for="item in items" :key="item.id" class="item-card">
              <NuxtLink :to="`/item/${item.slug}`">
                <div class="item-image">
                  <img :src="item.mainImage" :alt="item.name" loading="lazy" />
                  <span v-if="item.isOnSale" class="sale-badge">-{{ Math.round(item.discount || 0) }}%</span>
                  <span v-if="item.isFeatured" class="featured-badge">⭐</span>
                </div>
                <div class="item-body">
                  <h3>{{ truncate(item.name, 50) }}</h3>
                  <p class="item-desc">{{ truncate(item.shortDescription || '', 60) }}</p>

                  <div class="item-footer">
                    <div class="pricing">
                      <span class="price">Rp {{ formatPrice(item.price) }}</span>
                      <span v-if="item.originalPrice" class="original-price">
                        Rp {{ formatPrice(item.originalPrice) }}
                      </span>
                    </div>
                    <div class="rating">
                      <span class="stars">★</span>
                      <span>{{ item.rating.toFixed(1) }}</span>
                    </div>
                  </div>

                  <div class="stock-info">
                    <span v-if="item.stock > 0" class="in-stock">Stok: {{ item.stock }}</span>
                    <span v-else class="out-of-stock">Habis</span>
                  </div>
                </div>
              </NuxtLink>
            </div>
          </div>

          <!-- No Results -->
          <div v-else class="no-results">
            <div class="empty-state">
              <h3>Tidak ada item ditemukan</h3>
              <p>Coba ubah filter atau cari dengan keyword lain</p>
              <button class="btn btn-primary" @click="resetFilters">Reset Filter</button>
            </div>
          </div>

          <!-- Pagination -->
          <div v-if="items.length && pagination.totalPages > 1" class="pagination">
            <button
              :disabled="pagination.page === 1"
              @click="previousPage"
              class="pagination-btn"
            >
              ← Sebelumnya
            </button>

            <div class="page-numbers">
              <button
                v-for="p in pageNumbers"
                :key="p"
                :class="['page-number', { active: p === pagination.page }]"
                @click="goToPage(p)"
              >
                {{ p }}
              </button>
            </div>

            <button
              :disabled="!pagination.hasNext"
              @click="nextPage"
              class="pagination-btn"
            >
              Berikutnya →
            </button>
          </div>
        </main>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Item {
  id: string
  name: string
  slug: string
  shortDescription?: string
  price: number
  originalPrice?: number
  discount?: number
  mainImage: string
  category: {
    id: string
    name: string
    slug: string
  }
  stock: number
  rating: number
  reviewCount: number
  isOnSale: boolean
  isFeatured: boolean
}

interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  itemCount: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

const route = useRoute()
const items = ref<Item[]>([])
const category = ref<Category | null>(null)
const loading = ref(false)

const showFilters = ref(true)
const searchQuery = ref('')
const selectedRarities = ref<string[]>([])
const minPrice = ref<number | null>(null)
const maxPrice = ref<number | null>(null)
const sortBy = ref('newest')
const pagination = ref<Pagination>({
  page: 1,
  limit: 12,
  total: 0,
  totalPages: 1,
  hasNext: false,
  hasPrev: false,
})

const rarities = [
  { value: 'common', label: 'Biasa' },
  { value: 'uncommon', label: 'Langka' },
  { value: 'rare', label: 'Sangat Langka' },
  { value: 'epic', label: 'Epik' },
  { value: 'legendary', label: 'Legendaris' },
]

// Load category info on mount
onMounted(async () => {
  const categorySlug = route.params.category as string

  try {
    // Fetch all categories to find the one we need
    const { data: allCategories } = await $fetch('/api/categories')
    category.value = allCategories.find((c: any) => c.slug === categorySlug) || null

    if (!category.value) {
      console.error('Category not found:', categorySlug)
      return
    }
  } catch (error) {
    console.error('Error loading category:', error)
  }

  // Load initial items
  await fetchItems()
})

// Fetch items with current filters
const fetchItems = async () => {
  loading.value = true
  try {
    const query: any = {
      page: pagination.value.page,
      limit: pagination.value.limit,
      sort: sortBy.value,
    }

    if (category.value?.id) query.categoryId = category.value.id
    if (minPrice.value) query.minPrice = minPrice.value
    if (maxPrice.value) query.maxPrice = maxPrice.value
    if (searchQuery.value) query.search = searchQuery.value
    if (selectedRarities.value.length === 1) query.rarity = selectedRarities.value[0]

    const { data, pagination: paginationData } = await $fetch('/api/items', { query })
    items.value = data
    Object.assign(pagination.value, paginationData)
  } catch (error) {
    console.error('Error fetching items:', error)
    items.value = []
  } finally {
    loading.value = false
  }
}

// Handlers
const applyFilters = async () => {
  pagination.value.page = 1
  await fetchItems()
}

const handleSearch = () => {
  pagination.value.page = 1
  setTimeout(() => {
    fetchItems()
  }, 300)
}

const previousPage = () => {
  if (pagination.value.page > 1) {
    pagination.value.page--
    fetchItems()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const nextPage = () => {
  if (pagination.value.hasNext) {
    pagination.value.page++
    fetchItems()
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }
}

const goToPage = (page: number) => {
  pagination.value.page = page
  fetchItems()
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

const resetFilters = () => {
  searchQuery.value = ''
  selectedRarities.value = []
  minPrice.value = null
  maxPrice.value = null
  sortBy.value = 'newest'
  pagination.value.page = 1
  fetchItems()
}

// Computed
const totalItems = computed(() => pagination.value.total)

const pageNumbers = computed(() => {
  const total = pagination.value.totalPages
  const current = pagination.value.page
  const pages = []

  for (let i = Math.max(1, current - 2); i <= Math.min(total, current + 2); i++) {
    pages.push(i)
  }

  return pages
})

// Helpers
const formatPrice = (price: number) => {
  return new Intl.NumberFormat('id-ID').format(Math.round(price))
}

const truncate = (text: string, length: number) => {
  return text.length > length ? text.substring(0, length) + '...' : text
}
</script>

<style scoped lang="scss">
.category-page {
  min-height: 100vh;
  background: #f8f9fa;
  padding-bottom: 3rem;
}

.page-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 3rem 2rem;
  text-align: center;
  margin-bottom: 2rem;

  h1 {
    font-size: 2.5rem;
    margin-bottom: 0.5rem;
  }

  p {
    font-size: 1.1rem;
    opacity: 0.9;
  }
}

.category-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.category-info {
  display: flex;
  gap: 2rem;
  background: white;
  padding: 2rem;
  border-radius: 8px;
  margin-bottom: 2rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  .category-image {
    width: 150px;
    height: 150px;
    object-fit: cover;
    border-radius: 8px;
  }

  .category-meta {
    display: flex;
    flex-direction: column;
    justify-content: center;

    h2 {
      font-size: 2rem;
      margin-bottom: 0.5rem;
      color: #1a1a1a;
    }

    p {
      color: #666;
      font-size: 1.1rem;
    }
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
    text-align: center;

    .category-image {
      width: 120px;
      height: 120px;
    }
  }
}

.content-grid {
  display: grid;
  grid-template-columns: 280px 1fr;
  gap: 2rem;

  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
}

.filters-sidebar {
  @media (max-width: 992px) {
    grid-column: 1 / -1;
  }

  .filters-toggle {
    display: none;
    width: 100%;
    padding: 1rem;
    background: white;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    margin-bottom: 1rem;

    @media (max-width: 992px) {
      display: block;
    }
  }

  .filters-panel {
    background: white;
    border-radius: 8px;
    padding: 1.5rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

    @media (max-width: 992px) {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1.5rem;
    }
  }

  .filter-group {
    margin-bottom: 2rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #eee;

    &:last-child {
      border-bottom: none;
      margin-bottom: 0;
      padding-bottom: 0;
    }

    h3 {
      font-size: 0.95rem;
      font-weight: 700;
      margin-bottom: 1rem;
      text-transform: uppercase;
      color: #333;
    }
  }

  .search-input {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;

    &:focus {
      outline: none;
      border-color: #667eea;
      box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
    }
  }

  .filter-options {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  .filter-checkbox {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    cursor: pointer;
    font-size: 0.9rem;

    input {
      cursor: pointer;
      width: 18px;
      height: 18px;
    }

    .rarity-badge {
      padding: 0.25rem 0.75rem;
      border-radius: 12px;
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
  }

  .price-inputs {
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-bottom: 1rem;

    .price-input {
      flex: 1;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;
      font-size: 0.9rem;
    }

    span {
      color: #666;
    }
  }

  .sort-select {
    width: 100%;
    padding: 0.75rem;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
    background: white;
    cursor: pointer;
  }

  .btn {
    width: 100%;
  }
}

.category-main {
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;

    p {
      color: #666;
      margin: 0;
      font-size: 0.95rem;
    }

    .sort-select-mobile {
      display: none;
      padding: 0.75rem;
      border: 1px solid #ddd;
      border-radius: 6px;

      @media (max-width: 992px) {
        display: block;
      }
    }
  }

  .items-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(240px, 1fr));
    gap: 1.5rem;
    margin-bottom: 3rem;

    @media (max-width: 768px) {
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 1rem;
    }
  }

  .item-card {
    background: white;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
    transition: all 0.3s;

    &:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 16px rgba(0, 0, 0, 0.15);
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
      background: #e0e0e0;
      overflow: hidden;

      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s;
      }

      &:hover img {
        transform: scale(1.05);
      }

      .sale-badge,
      .featured-badge {
        position: absolute;
        padding: 0.5rem 0.75rem;
        font-weight: 700;
        font-size: 0.75rem;
        border-radius: 4px;
      }

      .sale-badge {
        top: 0.5rem;
        right: 0.5rem;
        background: #ff4444;
        color: white;
      }

      .featured-badge {
        top: 0.5rem;
        left: 0.5rem;
        background: #ffc107;
        font-size: 1.2rem;
      }
    }

    .item-body {
      padding: 1rem;
      display: flex;
      flex-direction: column;
      flex: 1;

      h3 {
        font-size: 1rem;
        margin: 0.5rem 0;
        color: #1a1a1a;
        line-height: 1.3;
        font-weight: 600;
      }

      .item-desc {
        font-size: 0.85rem;
        color: #666;
        margin-bottom: 1rem;
        line-height: 1.3;
      }

      .item-footer {
        margin-bottom: 1rem;
        display: flex;
        justify-content: space-between;
        align-items: flex-end;

        .pricing {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;

          .price {
            font-weight: 700;
            color: #e74c3c;
            font-size: 1.1rem;
          }

          .original-price {
            text-decoration: line-through;
            color: #999;
            font-size: 0.85rem;
          }
        }

        .rating {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.85rem;
          color: #666;

          .stars {
            color: #ffc107;
            font-weight: 700;
          }
        }
      }

      .stock-info {
        margin-top: auto;
        padding-top: 1rem;
        border-top: 1px solid #eee;

        span {
          display: inline-block;
          font-size: 0.85rem;
          font-weight: 600;
          padding: 0.35rem 0.75rem;
          border-radius: 4px;

          &.in-stock {
            background: #d4edda;
            color: #155724;
          }

          &.out-of-stock {
            background: #f8d7da;
            color: #721c24;
          }
        }
      }
    }
  }

  .no-results {
    padding: 3rem 2rem;
    text-align: center;
    background: white;
    border-radius: 8px;

    .empty-state {
      h3 {
        font-size: 1.5rem;
        color: #1a1a1a;
        margin-bottom: 0.5rem;
      }

      p {
        color: #666;
        margin-bottom: 1.5rem;
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 1rem;
    margin-top: 3rem;
    flex-wrap: wrap;

    .pagination-btn,
    .page-number {
      padding: 0.75rem 1rem;
      border: 1px solid #ddd;
      background: white;
      border-radius: 6px;
      cursor: pointer;
      font-weight: 600;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        border-color: #667eea;
        color: #667eea;
      }

      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
    }

    .page-numbers {
      display: flex;
      gap: 0.5rem;

      .page-number {
        min-width: 40px;

        &.active {
          background: #667eea;
          color: white;
          border-color: #667eea;
        }
      }
    }
  }
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &.btn-primary {
    background: #667eea;
    color: white;

    &:hover {
      background: #5568d3;
    }
  }

  &.btn-sm {
    padding: 0.5rem 1rem;
    font-size: 0.9rem;
  }
}
</style>

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

const category = ref<string>('')
const loading = ref(true)

// Format date helper
const formatDate = (date: string, format: string = 'full') => {
  const d = new Date(date)
  if (format === 'short') {
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
  return d.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
}

// Filter posts by category
const categoryPosts = ref<Post[]>([])

const loadCategory = async () => {
  const categoryName = route.params.category as string

  if (categoryName) {
    category.value = decodeURIComponent(categoryName)

    if (!posts.value || posts.value.length === 0) {
      await fetchPosts()
    }

    categoryPosts.value = (posts.value || []).filter(p =>
      p.categories.includes(category.value)
    )
  }

  loading.value = false
}

// Watch for route changes
watch(() => route.params.category, () => {
  loading.value = true
  categoryPosts.value = []
  loadCategory()
})

// Initialize on mount
onMounted(() => {
  loadCategory()
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
  title: () => `${category.value} | Blog`,
  meta: [
    {
      name: 'description',
      content: () => `Articles about ${category.value}`,
    },
  ],
})

// Computed for posts
const posts_ = computed(() => categoryPosts.value)
</script>

<style scoped>
.category-page {
  width: 100%;
  min-height: 100vh;
}

/* ========== HEADER ========== */

.category-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
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

.category-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  font-weight: 800;
  margin: 0 0 1rem 0;
  letter-spacing: -1px;
  text-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.category-description {
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
  .category-header {
    padding: 2rem 1rem;
    margin-top: -2rem;
    padding-top: 4rem;
  }

  .category-title {
    font-size: 1.75rem;
  }

  .posts-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}
</style>
