<template>
  <div class="admin-page">
    <!-- Page Header -->
    <div class="page-header">
      <div class="header-content">
        <h1>⭐ Manajemen Ulasan</h1>
        <p>Kelola review item dari customer</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="filters-bar">
      <select v-model="filterStatus" class="select-input" @change="fetchReviews">
        <option value="">Semua Status</option>
        <option value="pending">Menunggu Persetujuan</option>
        <option value="approved">Disetujui</option>
        <option value="spam">Spam</option>
      </select>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Cari review..."
        class="search-input"
        @input="debouncedSearch"
      />
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="loading-spinner">
      Loading reviews...
    </div>

    <!-- Reviews List -->
    <div v-else class="reviews-list">
      <div v-for="review in reviews" :key="review.id" class="review-card">
        <div class="review-header">
          <div class="review-info">
            <p class="review-author">{{ review.author }}</p>
            <p class="review-email">{{ review.authorEmail }}</p>
            <span class="review-rating">
              <span class="stars">{{ '⭐'.repeat(review.rating) }}</span>
              {{ review.rating }}/5
            </span>
          </div>
          <div class="review-status">
            <span v-if="!review.isApproved && !review.isSpam" class="badge badge-pending">
              ⏳ Pending
            </span>
            <span v-else-if="review.isApproved" class="badge badge-approved">
              ✓ Approved
            </span>
            <span v-else-if="review.isSpam" class="badge badge-spam">
              🚫 Spam
            </span>
          </div>
        </div>

        <div class="review-content">
          <h4>{{ review.title }}</h4>
          <p>{{ review.content }}</p>
        </div>

        <div v-if="review.imageUrl" class="review-image">
          <img :src="review.imageUrl" :alt="review.title" />
        </div>

        <div class="review-actions">
          <button
            v-if="!review.isApproved"
            class="btn-sm btn-approve"
            @click="approveReview(review.id)"
          >
            ✓ Approve
          </button>
          <button v-if="!review.isSpam" class="btn-sm btn-spam" @click="markAsSpam(review.id)">
            🚫 Mark Spam
          </button>
          <button class="btn-sm btn-delete" @click="deleteReview(review.id)">
            🗑️ Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="!loading && reviews.length > 0" class="pagination">
      <button :disabled="currentPage === 1" @click="previousPage" class="btn btn-sm">
        ← Sebelumnya
      </button>
      <span class="page-info">Halaman {{ currentPage }} dari {{ totalPages }}</span>
      <button :disabled="currentPage >= totalPages" @click="nextPage" class="btn btn-sm">
        Selanjutnya →
      </button>
    </div>

    <!-- Empty State -->
    <div v-if="!loading && reviews.length === 0" class="empty-state">
      <p>Tidak ada review untuk ditampilkan.</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'

interface Review {
  id: string
  itemId: string
  author: string
  authorEmail: string
  rating: number
  title: string
  content: string
  imageUrl?: string
  isApproved: boolean
  isSpam: boolean
  createdAt: string
}

const reviews = ref<Review[]>([])
const loading = ref(true)
const currentPage = ref(1)
const reviewsPerPage = ref(10)
const totalReviews = ref(0)

const filterStatus = ref('')
const searchQuery = ref('')

const totalPages = computed(() => Math.ceil(totalReviews.value / reviewsPerPage.value))

onMounted(() => {
  fetchReviews()
})

async function fetchReviews() {
  loading.value = true
  try {
    const skip = (currentPage.value - 1) * reviewsPerPage.value
    const query = {
      skip,
      take: reviewsPerPage.value,
      status: filterStatus.value,
      search: searchQuery.value,
    }

    const response = await $fetch('/api/admin/reviews', { query })

    reviews.value = response.data
    totalReviews.value = response.total
  } catch (error) {
    console.error('Error fetching reviews:', error)
    alert('Error loading reviews')
  } finally {
    loading.value = false
  }
}

async function approveReview(reviewId: string) {
  try {
    await $fetch(`/api/reviews/${reviewId}`, {
      method: 'PATCH',
      body: { isApproved: true, isSpam: false },
    })
    alert('✓ Review approved!')
    await fetchReviews()
  } catch (error) {
    alert('Error approving review')
  }
}

async function markAsSpam(reviewId: string) {
  try {
    await $fetch(`/api/reviews/${reviewId}`, {
      method: 'PATCH',
      body: { isSpam: true },
    })
    alert('🚫 Marked as spam')
    await fetchReviews()
  } catch (error) {
    alert('Error marking as spam')
  }
}

async function deleteReview(reviewId: string) {
  if (!confirm('Apakah Anda yakin ingin menghapus review ini?')) {
    return
  }

  try {
    await $fetch(`/api/reviews/${reviewId}`, {
      method: 'DELETE',
    })
    alert('Review deleted')
    await fetchReviews()
  } catch (error) {
    alert('Error deleting review')
  }
}

function debouncedSearch() {
  currentPage.value = 1
  setTimeout(() => fetchReviews(), 300)
}

function previousPage() {
  if (currentPage.value > 1) {
    currentPage.value--
    fetchReviews()
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
    fetchReviews()
  }
}
</script>

<style scoped>
.admin-page {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
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

.reviews-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.review-card {
  background: white;
  border: 1px solid #ddd;
  border-radius: 0.5rem;
  padding: 1.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.review-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.review-info {
  flex: 1;
}

.review-author {
  font-weight: 600;
  color: #333;
  margin: 0 0 0.25rem;
  font-size: 1.1rem;
}

.review-email {
  font-size: 0.85rem;
  color: #999;
  margin: 0;
}

.review-rating {
  display: inline-block;
  margin-top: 0.5rem;
  font-weight: 600;
  color: #f39c12;
}

.stars {
  margin-right: 0.25rem;
}

.badge {
  display: inline-block;
  padding: 0.375rem 0.75rem;
  border-radius: 0.375rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.badge-pending {
  background: #fff3cd;
  color: #856404;
}

.badge-approved {
  background: #d4edda;
  color: #155724;
}

.badge-spam {
  background: #f8d7da;
  color: #721c24;
}

.review-content {
  margin: 1rem 0;
}

.review-content h4 {
  margin: 0 0 0.5rem;
  color: #333;
  font-size: 1rem;
}

.review-content p {
  margin: 0;
  color: #666;
  line-height: 1.5;
}

.review-image {
  margin: 1rem 0;
}

.review-image img {
  max-width: 200px;
  max-height: 200px;
  border-radius: 0.375rem;
  border: 1px solid #ddd;
}

.review-actions {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  border-top: 1px solid #eee;
  padding-top: 1rem;
}

.btn-sm {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-approve {
  background: #28a745;
  color: white;
}

.btn-approve:hover {
  background: #218838;
}

.btn-spam {
  background: #ffc107;
  color: #333;
}

.btn-spam:hover {
  background: #e0a800;
}

.btn-delete {
  background: #dc3545;
  color: white;
}

.btn-delete:hover {
  background: #c82333;
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
  border: 1px solid #ddd;
}

.loading-spinner {
  text-align: center;
  padding: 3rem;
  color: #666;
}

@media (max-width: 768px) {
  .admin-page {
    padding: 1rem;
  }

  .review-header {
    flex-direction: column;
  }

  .filters-bar {
    flex-direction: column;
  }

  .review-actions {
    flex-wrap: wrap;
  }
}
</style>
