<template>
  <div class="admin-dashboard">
    <!-- Header -->
    <header class="admin-header">
      <div class="admin-header-content">
        <h1>Admin Dashboard</h1>
        <button @click="logout" class="logout-btn">Logout</button>
      </div>
    </header>

    <!-- Navigation -->
    <nav class="admin-nav">
      <NuxtLink to="/admin/dashboard" class="nav-item active">
        📊 Overview
      </NuxtLink>
      <NuxtLink to="/admin/posts" class="nav-item">
        📝 Posts
      </NuxtLink>
      <NuxtLink to="/admin/comments" class="nav-item">
        💬 Comments
      </NuxtLink>
      <NuxtLink to="/admin/settings" class="nav-item">
        ⚙️ Settings
      </NuxtLink>
    </nav>

    <!-- Content -->
    <main class="admin-content">
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon">📝</div>
          <div class="stat-info">
            <h3>{{ stats.totalPosts }}</h3>
            <p>Total Posts</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">💬</div>
          <div class="stat-info">
            <h3>{{ stats.pendingComments }}</h3>
            <p>Pending Comments</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📧</div>
          <div class="stat-info">
            <h3>{{ stats.subscribers }}</h3>
            <p>Newsletter Subscribers</p>
          </div>
        </div>

        <div class="stat-card">
          <div class="stat-icon">📈</div>
          <div class="stat-info">
            <h3>{{ stats.views }}</h3>
            <p>Total Views (GA4)</p>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <div class="quick-actions">
        <h2>Quick Actions</h2>
        <div class="action-buttons">
          <NuxtLink to="/admin/posts/create" class="action-btn primary">
            + Create New Post
          </NuxtLink>
          <NuxtLink to="/admin/posts" class="action-btn secondary">
            Manage Posts
          </NuxtLink>
        </div>
      </div>

      <!-- Recent Posts -->
      <div class="recent-posts">
        <h2>Recent Posts</h2>
        <div v-if="recentPosts.length > 0" class="posts-list">
          <div v-for="post in recentPosts.slice(0, 5)" :key="post.slug" class="post-row">
            <div class="post-info">
              <h4>{{ post.title }}</h4>
              <p>{{ formatDate(post.date) }}</p>
            </div>
            <div class="post-actions">
              <NuxtLink :to="`/admin/posts/${post.slug}/edit`" class="btn-small">
                Edit
              </NuxtLink>
              <button @click="deletePost(post.slug)" class="btn-small danger">
                Delete
              </button>
            </div>
          </div>
        </div>
        <div v-else class="empty-state">
          No posts yet. <NuxtLink to="/admin/posts/create">Create one</NuxtLink>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()

const stats = ref({
  totalPosts: 0,
  pendingComments: 0,
  subscribers: 0,
  views: 0
})

const recentPosts = ref<any[]>([])

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const loadDashboardData = async () => {
  const authToken = sessionStorage.getItem('adminAuth')
  if (!authToken) {
    router.push('/admin/login')
    return
  }

  try {
    const password = authToken // Already Bearer token
    
    // Fetch posts
    const postsResponse = await $fetch('/api/admin/posts', {
      headers: {
        'Authorization': `Bearer ${password}`
      }
    })

    recentPosts.value = postsResponse.posts || []
    stats.value.totalPosts = postsResponse.count || 0

    // Fetch comments with pending filter
    try {
      const commentsResponse = await $fetch('/api/admin/comments?status=pending&limit=1', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })
      stats.value.pendingComments = commentsResponse.stats?.pending || 0
    } catch (error) {
      console.error('Error fetching comments:', error)
    }

    // Fetch subscribers
    try {
      const subscribersResponse = await $fetch('/api/admin/subscribers', {
        headers: {
          'Authorization': `Bearer ${password}`
        }
      })
      stats.value.subscribers = subscribersResponse.count || 0
    } catch (error) {
      console.error('Error fetching subscribers:', error)
    }
  } catch (error) {
    console.error('Error loading dashboard:', error)
    router.push('/admin/login')
  }
}

const deletePost = async (slug: string) => {
  if (!confirm('Are you sure you want to delete this post?')) return

  const authToken = sessionStorage.getItem('adminAuth')
  if (!authToken) {
    router.push('/admin/login')
    return
  }

  try {
    const password = atob(authToken)
    await $fetch(`/api/admin/posts/${slug}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${password}`
      }
    })

    // Reload dashboard
    loadDashboardData()
  } catch (error) {
    alert('Error deleting post')
  }
}

const logout = () => {
  sessionStorage.removeItem('adminAuth')
  router.push('/admin/login')
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3a 100%);
  color: #e8e6e1;
}

.admin-header {
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(240, 147, 251, 0.2);
  padding: 1.5rem 2rem;
  sticky: top;
  top: 0;
  z-index: 100;
}

.admin-header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1400px;
  margin: 0 auto;
}

.admin-header h1 {
  color: #ffc451;
  font-size: 1.8rem;
  margin: 0;
}

.logout-btn {
  padding: 0.5rem 1.2rem;
  background: rgba(239, 68, 68, 0.2);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ff6b6b;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.3);
}

.admin-nav {
  display: flex;
  gap: 2rem;
  padding: 1rem 2rem;
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 1px solid rgba(240, 147, 251, 0.1);
  max-width: 1400px;
  margin: 0 auto;
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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.stat-card {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.stat-card:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(240, 147, 251, 0.3);
  transform: translateY(-4px);
}

.stat-icon {
  font-size: 2.5rem;
  display: flex;
  align-items: center;
}

.stat-info h3 {
  font-size: 1.8rem;
  margin: 0;
  color: #ffc451;
}

.stat-info p {
  color: #a8a8a8;
  margin: 0.25rem 0 0 0;
  font-size: 0.9rem;
}

.quick-actions {
  margin-bottom: 3rem;
}

.quick-actions h2 {
  color: #ffffff;
  margin-bottom: 1rem;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.action-btn.primary {
  background: linear-gradient(135deg, #ffc451 0%, #ffb700 100%);
  color: #000;
}

.action-btn.primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 196, 81, 0.4);
}

.action-btn.secondary {
  background: rgba(102, 126, 234, 0.2);
  border: 1px solid rgba(102, 126, 234, 0.4);
  color: #667eea;
}

.action-btn.secondary:hover {
  background: rgba(102, 126, 234, 0.3);
}

.recent-posts {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 8px;
  padding: 2rem;
}

.recent-posts h2 {
  color: #ffffff;
  margin-top: 0;
  margin-bottom: 1.5rem;
}

.posts-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.post-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 6px;
  border-left: 3px solid #ffc451;
}

.post-info h4 {
  color: #e8e6e1;
  margin: 0 0 0.25rem 0;
  font-size: 1rem;
}

.post-info p {
  color: #a8a8a8;
  margin: 0;
  font-size: 0.85rem;
}

.post-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-small {
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

.btn-small:hover {
  background: rgba(240, 147, 251, 0.1);
  border-color: rgba(240, 147, 251, 0.6);
}

.btn-small.danger {
  color: #ff6b6b;
  border-color: rgba(239, 68, 68, 0.3);
}

.btn-small.danger:hover {
  background: rgba(239, 68, 68, 0.1);
  border-color: rgba(239, 68, 68, 0.6);
}

.empty-state {
  color: #a8a8a8;
  padding: 2rem;
  text-align: center;
}

.empty-state a {
  color: #ffc451;
  text-decoration: none;
}

.empty-state a:hover {
  text-decoration: underline;
}
</style>
