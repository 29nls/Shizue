<template>
  <div class="admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>🛍️ Manajemen Item</h1>
        <p>Kelola semua item Dragon Nest di store</p>
      </div>
      <NuxtLink to="/admin/items/create" class="btn btn-primary">
        ➕ Tambah Item Baru
      </NuxtLink>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari item..."
        class="search-input"
        @input="applyFilters"
      />
      <select v-model="filterCategory" class="select-input" @change="applyFilters">
        <option value="">Semua Kategori</option>
        <option v-for="cat in categories" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <select v-model="filterStatus" class="select-input" @change="applyFilters">
        <option value="">Semua Status</option>
        <option value="active">Aktif</option>
        <option value="draft">Draft</option>
        <option value="inactive">Tidak Aktif</option>
      </select>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-spinner">
      Loading items...
    </div>

    <!-- Items Table -->
    <div v-else class="items-table-wrapper">
      <table class="items-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Kategori</th>
            <th>Harga</th>
            <th>Stok</th>
            <th>Rarity</th>
            <th>Status</th>
            <th>Aksi</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in items" :key="item.id" class="item-row">
            <td class="item-name-cell">
              <div class="item-info">
                <img :src="item.mainImage" :alt="item.name" class="item-thumb" />
                <div>
                  <p class="item-name">{{ item.name }}</p>
                  <p class="item-slug">{{ item.slug }}</p>
                </div>
              </div>
            </td>
            <td>{{ item.category?.name || '-' }}</td>
            <td class="price-cell">
              Rp {{ formatPrice(item.price) }}
              <span v-if="item.discount" class="discount-badge">-{{ item.discount }}%</span>
            </td>
            <td>
              <span :class="['stock-badge', { 'stock-low': item.stock < 5 }]">
                {{ item.stock }} unit
              </span>
            </td>
            <td>
              <span :class="['rarity-badge', `rarity-${item.rarity}`]">
                {{ item.rarity }}
              </span>
            </td>
            <td>
              <span :class="['status-badge', { 'status-active': item.isActive }]">
                {{ item.isActive ? '✓ Aktif' : '✗ Tidak Aktif' }}
              </span>
            </td>
            <td class="actions-cell">
              <NuxtLink :to="`/admin/items/${item.id}/edit`" class="btn-icon btn-edit" title="Edit">
                ✎
              </NuxtLink>
              <button class="btn-icon btn-delete" @click="deleteItem(item.id)" title="Hapus">
                🗑️
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && items.length > 0" class="pagination">
      <button :disabled="currentPage === 1" @click="previousPage" class="btn btn-sm">
        ← Sebelumnya
      </button>
      <span class="page-info">Halaman {{ currentPage }} dari {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="nextPage" class="btn btn-sm">
        Selanjutnya →
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && items.length === 0" class="empty-state">
      <p>Belum ada item. Mulai dengan <NuxtLink to="/admin/items/create">membuat item baru</NuxtLink>.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Item {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  categoryId: string
  category?: { id: string; name: string }
  price: number
  originalPrice?: number
  discount: number
  stock: number
  rarity: string
  mainImage: string
  isActive: boolean
  isDraft: boolean
  rating: number
  reviewCount: number
  views: number
  purchases: number
}

interface Category {
  id: string
  name: string
}

const items = ref<Item[]>([])
const categories = ref<Category[]>([])
const loading = ref(true)
const currentPage = ref(1)
const itemsPerPage = ref(10)
const totalItems = ref(0)

const searchQuery = ref('')
const filterCategory = ref('')
const filterStatus = ref('')

const totalPages = computed(() => Math.ceil(totalItems.value / itemsPerPage.value))

onMounted(async () => {
  await fetchCategories()
  await fetchItems()
})

async function fetchCategories() {
  try {
    const { data } = await $fetch('/api/categories')
    categories.value = data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
}

async function fetchItems() {
  loading.value = true
  try {
    const skip = (currentPage.value - 1) * itemsPerPage.value
    const query = {
      skip,
      take: itemsPerPage.value,
      search: searchQuery.value,
      categoryId: filterCategory.value,
      status: filterStatus.value,
    }

    const response = await $fetch('/api/admin/items', {
      query,
    })

    items.value = response.data
    totalItems.value = response.total
  } catch (error) {
    console.error('Error fetching items:', error)
  } finally {
    loading.value = false
  }
}

async function deleteItem(itemId: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus item ini?')) {
    return
  }

  try {
    await $fetch(`/api/admin/items/${itemId}`, {
      method: 'DELETE',
    })
    alert('Item berhasil dihapus')
    await fetchItems()
  } catch (error) {
    alert('Error menghapus item: ' + error)
  }
}

function applyFilters() {
  currentPage.value = 1
  fetchItems()
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchItems()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchItems()
  }
}

function formatPrice(price: number): string {
  return new Intl.NumberFormat('id-ID').format(price)
}
</script>

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  gap: 1rem;
}

.header-content h1 {
  font-size: 2rem;
  margin: 0;
  color: #333;
}

.header-content p {
  margin: 0.5rem 0 0;
  color: #666;
  font-size: 0.9rem;
}

.filters-bar {
  display: flex;
  gap: 1rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
}

.search-input,
.select-input {
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 1rem;
  flex: 1;
  min-width: 150px;
}

.search-input:focus,
.select-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.items-table-wrapper {
  background: white;
  border-radius: 0.5rem;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.items-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.items-table thead {
  background: #f8f9fa;
  border-bottom: 2px solid #ddd;
}

.items-table th {
  padding: 1rem;
  text-align: left;
  font-weight: 600;
  color: #333;
}

.items-table td {
  padding: 1rem;
  border-bottom: 1px solid #eee;
}

.item-row:hover {
  background: #f9f9f9;
}

.item-info {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.item-thumb {
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 0.375rem;
}

.item-name {
  font-weight: 600;
  color: #333;
  margin: 0;
  max-width: 200px;
}

.item-slug {
  font-size: 0.8rem;
  color: #999;
  margin: 0.25rem 0 0;
}

.price-cell {
  font-weight: 600;
  color: #e74c3c;
}

.discount-badge {
  margin-left: 0.5rem;
  background: #e74c3c;
  color: white;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
}

.stock-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  background: #d4edda;
  color: #155724;
  font-size: 0.85rem;
}

.stock-badge.stock-low {
  background: #f8d7da;
  color: #721c24;
}

.rarity-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: capitalize;
}

.rarity-common {
  background: #d5d5d5;
  color: #333;
}

.rarity-uncommon {
  background: #90ee90;
  color: #333;
}

.rarity-rare {
  background: #87ceeb;
  color: white;
}

.rarity-epic {
  background: #da70d6;
  color: white;
}

.rarity-legendary {
  background: #ffd700;
  color: #333;
}

.status-badge {
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  background: #f8d7da;
  color: #721c24;
  font-size: 0.85rem;
}

.status-badge.status-active {
  background: #d4edda;
  color: #155724;
}

.actions-cell {
  display: flex;
  gap: 0.5rem;
}

.btn-icon {
  width: 36px;
  height: 36px;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  cursor: pointer;
  font-size: 1.2rem;
  transition: all 0.2s;
}

.btn-edit {
  background: white;
  color: #667eea;
}

.btn-edit:hover {
  background: #667eea;
  color: white;
  border-color: #667eea;
}

.btn-delete {
  background: white;
  color: #e74c3c;
}

.btn-delete:hover {
  background: #e74c3c;
  color: white;
  border-color: #e74c3c;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
  padding: 1rem;
}

.page-info {
  color: #666;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
  background: white;
  border-radius: 0.5rem;
  margin-top: 2rem;
}

.loading-spinner {
  text-align: center;
  padding: 3rem;
  color: #666;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover {
  background: #5568d3;
}

.btn-sm {
  padding: 0.5rem 1rem;
  font-size: 0.9rem;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>
