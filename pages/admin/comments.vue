<template>
  <div class="comment-moderation">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <h1>Comment Moderation</h1>
        <p class="subtitle">Review and moderate user comments</p>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid" v-if="stats">
        <div class="stat-card">
          <div class="stat-number">{{ stats.pending }}</div>
          <div class="stat-label">Pending</div>
        </div>
        <div class="stat-card approved">
          <div class="stat-number">{{ stats.approved }}</div>
          <div class="stat-label">Approved</div>
        </div>
        <div class="stat-card spam">
          <div class="stat-number">{{ stats.spam }}</div>
          <div class="stat-label">Spam</div>
        </div>
        <div class="stat-card total">
          <div class="stat-number">{{ stats.total }}</div>
          <div class="stat-label">Total</div>
        </div>
      </div>

      <!-- Filters -->
      <div class="filters-section">
        <div class="filter-group">
          <label for="status-filter">Status:</label>
          <select id="status-filter" v-model="selectedStatus" @change="fetchComments">
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="spam">Spam</option>
            <option value="all">All</option>
          </select>
        </div>

        <div class="filter-group">
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, email, or content..."
            @keyup.enter="fetchComments"
          />
          <button @click="fetchComments" class="btn-search">Search</button>
        </div>
      </div>

      <!-- Comments List -->
      <div v-if="loading" class="loading">
        ⏳ Loading comments...
      </div>

      <div v-else-if="comments.length === 0" class="empty-state">
        <p>No comments found</p>
      </div>

      <div v-else class="comments-list">
        <div v-for="comment in comments" :key="comment.id" class="comment-item">
          <!-- Comment Header -->
          <div class="comment-header">
            <div class="comment-meta">
              <div class="author-name">{{ comment.author }}</div>
              <div class="author-email">{{ comment.email }}</div>
              <div class="post-link">
                <span class="label">Post:</span>
                <NuxtLink :to="`/post/${comment.post.slug}`" target="_blank">
                  {{ comment.post.title }}
                </NuxtLink>
              </div>
              <div class="comment-date">{{ formatDate(comment.createdAt) }}</div>
            </div>

            <!-- Status Badge -->
            <div class="comment-status">
              <span v-if="comment.approved" class="badge approved">✓ Approved</span>
              <span v-else-if="comment.isSpam" class="badge spam">⚠ Spam</span>
              <span v-else class="badge pending">⏳ Pending</span>
            </div>
          </div>

          <!-- Comment Content -->
          <div class="comment-content">
            {{ comment.content }}
          </div>

          <!-- Actions -->
          <div class="comment-actions">
            <button
              v-if="!comment.approved && !comment.isSpam"
              @click="updateComment(comment.id, 'approve')"
              :disabled="actionLoading[comment.id]"
              class="btn btn-approve"
            >
              {{ actionLoading[comment.id] ? '...' : '✓ Approve' }}
            </button>

            <button
              v-if="comment.approved"
              @click="updateComment(comment.id, 'reject')"
              :disabled="actionLoading[comment.id]"
              class="btn btn-reject"
            >
              {{ actionLoading[comment.id] ? '...' : '✗ Unapprove' }}
            </button>

            <button
              v-if="!comment.isSpam"
              @click="updateComment(comment.id, 'spam')"
              :disabled="actionLoading[comment.id]"
              class="btn btn-spam"
            >
              {{ actionLoading[comment.id] ? '...' : '🚫 Mark Spam' }}
            </button>

            <button
              v-if="comment.isSpam"
              @click="updateComment(comment.id, 'reject')"
              :disabled="actionLoading[comment.id]"
              class="btn btn-restore"
            >
              {{ actionLoading[comment.id] ? '...' : '↶ Not Spam' }}
            </button>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="pagination && pagination.hasMore" class="pagination">
        <button @click="loadMore" :disabled="loading" class="btn btn-primary">
          {{ loading ? 'Loading...' : 'Load More' }}
        </button>
      </div>

      <!-- Messages -->
      <div v-if="successMessage" class="alert alert-success">
        {{ successMessage }}
      </div>
      <div v-if="errorMessage" class="alert alert-error">
        {{ errorMessage }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

definePageMeta({
  layout: 'admin',
})

interface Comment {
  id: string
  author: string
  email: string
  content: string
  approved: boolean
  isSpam: boolean
  createdAt: string
  post: {
    id: string
    title: string
    slug: string
  }
}

interface Stats {
  total: number
  pending: number
  approved: number
  spam: number
}

const selectedStatus = ref('pending')
const searchQuery = ref('')
const comments = ref<Comment[]>([])
const stats = ref<Stats | null>(null)
const loading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const actionLoading = ref<Record<string, boolean>>({})
const pagination = ref<any>(null)
const currentOffset = ref(0)
const limit = 20

onMounted(() => {
  fetchComments()
})

const fetchComments = async () => {
  try {
    loading.value = true
    errorMessage.value = ''
    successMessage.value = ''
    currentOffset.value = 0

    const adminAuth = sessionStorage.getItem('adminAuth')
    if (!adminAuth) {
      errorMessage.value = 'Authentication required'
      return
    }

    const params = new URLSearchParams({
      status: selectedStatus.value,
      search: searchQuery.value,
      limit: limit.toString(),
      offset: '0',
    })

    const response = await fetch(`/api/admin/comments?${params}`, {
      headers: {
        'Authorization': `Bearer ${adminAuth}`,
      },
    })

    if (!response.ok) {
      throw new Error('Failed to fetch comments')
    }

    const data = await response.json()
    comments.value = data.comments
    stats.value = data.stats
    pagination.value = data.pagination
  } catch (error) {
    console.error('Fetch comments error:', error)
    errorMessage.value = 'Failed to load comments'
  } finally {
    loading.value = false
  }
}

const loadMore = async () => {
  try {
    loading.value = true
    currentOffset.value += limit

    const adminAuth = sessionStorage.getItem('adminAuth')
    if (!adminAuth) return

    const params = new URLSearchParams({
      status: selectedStatus.value,
      search: searchQuery.value,
      limit: limit.toString(),
      offset: currentOffset.value.toString(),
    })

    const response = await fetch(`/api/admin/comments?${params}`, {
      headers: {
        'Authorization': `Bearer ${adminAuth}`,
      },
    })

    if (!response.ok) throw new Error('Failed to fetch comments')

    const data = await response.json()
    comments.value = [...comments.value, ...data.comments]
    pagination.value = data.pagination
  } catch (error) {
    console.error('Load more error:', error)
    errorMessage.value = 'Failed to load more comments'
  } finally {
    loading.value = false
  }
}

const updateComment = async (commentId: string, action: string) => {
  try {
    actionLoading.value[commentId] = true

    const adminAuth = sessionStorage.getItem('adminAuth')
    if (!adminAuth) return

    const response = await fetch(`/api/admin/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminAuth}`,
      },
      body: JSON.stringify({ action }),
    })

    if (!response.ok) {
      throw new Error('Failed to update comment')
    }

    const data = await response.json()

    // Update comment in list
    const index = comments.value.findIndex(c => c.id === commentId)
    if (index >= 0) {
      comments.value[index] = data.comment
    }

    successMessage.value = `Comment ${action}ed successfully`
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)

    // Refresh stats
    await fetchComments()
  } catch (error) {
    console.error('Update comment error:', error)
    errorMessage.value = 'Failed to update comment'
  } finally {
    actionLoading.value[commentId] = false
  }
}

const formatDate = (dateString: string) => {
  const date = new Date(dateString)
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<style scoped>
.comment-moderation {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.container {
  max-width: 1000px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 30px;
}

.page-header h1 {
  color: white;
  font-size: 2.5rem;
  margin: 0 0 10px 0;
}

.subtitle {
  color: rgba(255, 255, 255, 0.9);
  font-size: 1.1rem;
  margin: 0;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 16px;
  margin-bottom: 30px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.stat-number {
  font-size: 2.5rem;
  font-weight: bold;
  color: #667eea;
  margin-bottom: 8px;
}

.stat-label {
  color: #666;
  font-weight: 600;
  font-size: 0.9rem;
}

.stat-card.approved .stat-number {
  color: #28a745;
}

.stat-card.spam .stat-number {
  color: #dc3545;
}

.stat-card.total .stat-number {
  color: #6c757d;
}

/* Filters */
.filters-section {
  background: white;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 20px;
  display: flex;
  gap: 16px;
  align-items: flex-end;
  flex-wrap: wrap;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.filter-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  flex: 1;
  min-width: 150px;
}

.filter-group label {
  font-weight: 600;
  color: #333;
  font-size: 0.9rem;
}

.filter-group select,
.filter-group input {
  padding: 10px 12px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s;
}

.filter-group select:focus,
.filter-group input:focus {
  outline: none;
  border-color: #667eea;
}

.btn-search {
  padding: 10px 20px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-search:hover {
  background: #764ba2;
}

/* Comments List */
.loading {
  text-align: center;
  color: white;
  padding: 40px 20px;
  font-size: 1.1rem;
}

.empty-state {
  background: white;
  padding: 40px;
  border-radius: 12px;
  text-align: center;
  color: #666;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.comment-item {
  background: white;
  border-radius: 12px;
  padding: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  transition: all 0.3s;
}

.comment-item:hover {
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

/* Comment Header */
.comment-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 2px solid #f0f0f0;
}

.comment-meta {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.author-name {
  font-weight: 700;
  color: #1a1a1a;
  font-size: 1.1rem;
}

.author-email {
  color: #666;
  font-size: 0.9rem;
}

.post-link {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
}

.post-link .label {
  color: #999;
  font-weight: 600;
}

.post-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
}

.post-link a:hover {
  text-decoration: underline;
}

.comment-date {
  color: #999;
  font-size: 0.85rem;
}

/* Status Badge */
.comment-status {
  display: flex;
  gap: 8px;
}

.badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap;
}

.badge.pending {
  background: #fff3cd;
  color: #856404;
}

.badge.approved {
  background: #d4edda;
  color: #155724;
}

.badge.spam {
  background: #f8d7da;
  color: #721c24;
}

/* Comment Content */
.comment-content {
  color: #333;
  line-height: 1.6;
  margin-bottom: 16px;
  padding: 12px;
  background: #f9f9f9;
  border-radius: 8px;
  border-left: 4px solid #667eea;
}

/* Actions */
.comment-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s;
}

.btn-approve {
  background: #28a745;
  color: white;
}

.btn-approve:hover:not(:disabled) {
  background: #218838;
}

.btn-reject {
  background: #dc3545;
  color: white;
}

.btn-reject:hover:not(:disabled) {
  background: #c82333;
}

.btn-spam {
  background: #ffc107;
  color: #333;
}

.btn-spam:hover:not(:disabled) {
  background: #e0a800;
}

.btn-restore {
  background: #17a2b8;
  color: white;
}

.btn-restore:hover:not(:disabled) {
  background: #138496;
}

.btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Pagination */
.pagination {
  text-align: center;
  padding: 20px;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Alerts */
.alert {
  padding: 16px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 20px;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

@media (max-width: 768px) {
  .comment-header {
    flex-direction: column;
    gap: 12px;
  }

  .filters-section {
    flex-direction: column;
  }

  .filter-group {
    width: 100%;
  }

  .btn-search {
    width: 100%;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .comment-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
