<template>
  <div class="admin-posts">
    <!-- Header -->
    <header class="admin-header">
      <div class="admin-header-content">
        <h1>Manage Posts</h1>
        <NuxtLink to="/admin/posts/create" class="btn-create">
          + New Post
        </NuxtLink>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="admin-nav">
      <NuxtLink to="/admin/dashboard" class="nav-item">
        📊 Overview
      </NuxtLink>
      <NuxtLink to="/admin/posts" class="nav-item active">
        📝 Posts
      </NuxtLink>
    </nav>

    <!-- Content -->
    <main class="admin-content">
      <div v-if="loading" class="loading">Loading posts...</div>

      <div v-else-if="posts.length > 0" class="posts-table">
        <div class="table-header">
          <div class="col-title">Title</div>
          <div class="col-date">Date</div>
          <div class="col-cats">Categories</div>
          <div class="col-actions">Actions</div>
        </div>

        <div v-for="post in posts" :key="post.slug" class="table-row">
          <div class="col-title">{{ post.title }}</div>
          <div class="col-date">{{ formatDate(post.date) }}</div>
          <div class="col-cats">
            <span v-for="cat in post.categories" :key="cat" class="tag">
              {{ cat }}
            </span>
          </div>
          <div class="col-actions">
            <NuxtLink :to="`/admin/posts/${post.slug}/edit`" class="btn-action edit">
              Edit
            </NuxtLink>
            <NuxtLink :to="`/post/${post.slug}`" class="btn-action view">
              View
            </NuxtLink>
            <button @click="deletePost(post.slug)" class="btn-action delete">
              Delete
            </button>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <p>No posts yet</p>
        <NuxtLink to="/admin/posts/create" class="btn-action primary">
          Create your first post
        </NuxtLink>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const posts = ref<any[]>([])
const loading = ref(true)

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadPosts = async () => {
  const authToken = sessionStorage.getItem('adminAuth')
  if (!authToken) {
    router.push('/admin/login')
    return
  }

  try {
    const password = atob(authToken)
    const response = await $fetch('/api/admin/posts', {
      headers: {
        'Authorization': `Bearer ${password}`
      }
    })

    posts.value = response.posts || []
  } catch (error) {
    console.error('Error loading posts:', error)
    router.push('/admin/login')
  } finally {
    loading.value = false
  }
}

const deletePost = async (slug: string) => {
  if (!confirm('Delete this post?')) return

  const authToken = sessionStorage.getItem('adminAuth')
  if (!authToken) return

  try {
    const password = atob(authToken)
    await $fetch(`/api/admin/posts/${slug}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${password}`
      }
    })

    loadPosts()
  } catch (error) {
    alert('Error deleting post')
  }
}

onMounted(() => {
  loadPosts()
})
</script>

<style scoped>
.admin-posts {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3a 100%);
  color: #e8e6e1;
}

.admin-header {
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(240, 147, 251, 0.2);
  padding: 1.5rem 2rem;
  position: sticky;
  top: 0;
  z-index: 100;
}

.admin-header-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.admin-header h1 {
  color: #ffc451;
  font-size: 1.8rem;
  margin: 0;
}

.btn-create {
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #ffc451 0%, #ffb700 100%);
  color: #000;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-create:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 196, 81, 0.4);
}

.admin-nav {
  display: flex;
  gap: 2rem;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(240, 147, 251, 0.1);
  max-width: 100%;
}

.nav-item {
  color: #a8a8a8;
  text-decoration: none;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
  transition: all 0.3s ease;
}

.nav-item:hover,
.nav-item.active {
  color: #ffc451;
  border-bottom-color: #ffc451;
}

.admin-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 2rem;
}

.loading {
  text-align: center;
  padding: 3rem;
  color: #a8a8a8;
}

.posts-table {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 8px;
  overflow: hidden;
}

.table-header {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-bottom: 1px solid rgba(240, 147, 251, 0.15);
  font-weight: 600;
  color: #ffc451;
}

.table-row {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.5fr;
  gap: 1rem;
  padding: 1.5rem;
  border-bottom: 1px solid rgba(240, 147, 251, 0.08);
  align-items: center;
}

.table-row:last-child {
  border-bottom: none;
}

.table-row:hover {
  background: rgba(240, 147, 251, 0.05);
}

.col-title {
  font-weight: 500;
  color: #e8e6e1;
}

.col-date {
  color: #a8a8a8;
  font-size: 0.9rem;
}

.col-cats {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(102, 126, 234, 0.2);
  color: #667eea;
  border-radius: 4px;
  font-size: 0.8rem;
}

.col-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-action {
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.85rem;
  text-decoration: none;
  border: 1px solid rgba(240, 147, 251, 0.3);
  color: #ffc451;
  cursor: pointer;
  transition: all 0.3s ease;
  background: transparent;
}

.btn-action:hover {
  background: rgba(240, 147, 251, 0.1);
  border-color: rgba(240, 147, 251, 0.6);
}

.btn-action.view {
  color: #667eea;
  border-color: rgba(102, 126, 234, 0.3);
}

.btn-action.view:hover {
  background: rgba(102, 126, 234, 0.1);
}

.btn-action.delete {
  color: #ff6b6b;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-action.delete:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.6);
}

.btn-action.primary {
  background: linear-gradient(135deg, #ffc451 0%, #ffb700 100%);
  color: #000;
  border: none;
  padding: 0.75rem 1.5rem;
  font-weight: 600;
}

.btn-action.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 196, 81, 0.4);
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #a8a8a8;
}

.empty-state p {
  margin-bottom: 1rem;
}

@media (max-width: 1024px) {
  .table-header,
  .table-row {
    grid-template-columns: 2fr 1fr;
  }

  .col-cats,
  .col-actions {
    grid-column: 1 / -1;
  }
}
</style>
