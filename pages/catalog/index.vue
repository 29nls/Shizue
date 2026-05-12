<template>
  <div class="catalog-page">
    <!-- Page Header -->
    <div class="page-header">
      <h1>Katalog Item Dragon Nest</h1>
      <p>Temukan item terbaik untuk petualangan Anda</p>
    </div>

    <div class="catalog-container">
      <!-- Sidebar Filters -->
      <aside class="filters-sidebar">
        <button class="filters-toggle" @click="showFilters = !showFilters">
          {{ showFilters ? '✕ Tutup Filter' : '☰ Buka Filter' }}
        </button>

        <div v-if="showFilters" class="filters-panel">
          <!-- Search -->
          <div class="filter-group">
            <h3>Cari</h3>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Nama item..."
              class="search-input"
              @input="handleSearch"
            />
          </div>

          <!-- Categories -->
          <div class="filter-group">
            <h3>Kategori</h3>
            <div class="filter-options">
              <label v-for="cat in categories" :key="cat.id" class="filter-checkbox">
                <input
                  type="radio"
                  :value="cat.id"
                  v-model="selectedCategory"
                  @change="applyFilters"
                />
                <span>{{ cat.name }} ({{ cat.itemCount }})</span>
              </label>
              <label class="filter-checkbox">
                <input
                  type="radio"
                  value=""
                  v-model="selectedCategory"
                  @change="applyFilters"
                />
                <span>Semua Kategori</span>
              </label>
            </div>
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
      <main class="catalog-main">
        <!-- Results Info -->
        <div class="results-header">
          <div>
            <h2>{{ activeCategoryName }}</h2>
            <p>{{ totalItems }} item ditemukan</p>
          </div>

          <!-- Mobile Sort -->
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
                <div class="item-category">{{ item.category.name }}</div>
                <h3>{{ truncate(item.name, 50) }}</h3>
                <p class="item-desc">{{ truncate(item.shortDescription || item.name, 60) }}</p>

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
                    <span class="count">({{ item.reviewCount }})</span>
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
  rarity: string
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

const items = ref<Item[]>([])
const categories = ref<Category[]>([])
const loading = ref(false)

const showFilters = ref(true)
const searchQuery = ref('')
const selectedCategory = ref('')
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

// Load categories on mount
onMounted(async () => {
  try {
    const { data } = await $fetch('/api/categories')
    categories.value = data
  } catch (error) {
    console.error('Error loading categories:', error)
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

    if (selectedCategory.value) query.categoryId = selectedCategory.value
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
  // Debounce search
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
  selectedCategory.value = ''
  selectedRarities.value = []
  minPrice.value = null
  maxPrice.value = null
  sortBy.value = 'newest'
  pagination.value.page = 1
  fetchItems()
}

// Computed
const activeCategoryName = computed(() => {
  if (!selectedCategory.value) return 'Semua Kategori'
  const cat = categories.value.find(c => c.id === selectedCategory.value)
  return cat?.name || 'Kategori'
})

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
.catalog-page {
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

.catalog-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
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
      letter-spacing: 0.5px;
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

    span {
      color: #666;
    }

    &:hover span {
      color: #333;
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

      &:focus {
        outline: none;
        border-color: #667eea;
      }
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

    &:focus {
      outline: none;
      border-color: #667eea;
    }
  }

  .btn {
    width: 100%;
  }
}

.catalog-main {
  .results-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;

    h2 {
      font-size: 1.75rem;
      color: #1a1a1a;
      margin: 0;
    }

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

      .item-category {
        font-size: 0.75rem;
        text-transform: uppercase;
        color: #667eea;
        font-weight: 700;
        margin-bottom: 0.5rem;
        letter-spacing: 0.5px;
      }

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
    grid-column: 1 / -1;
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
