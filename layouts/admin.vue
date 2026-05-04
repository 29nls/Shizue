<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <div class="sidebar-header">
        <h2>Admin</h2>
      </div>
      <nav class="sidebar-nav">
        <NuxtLink to="/admin/dashboard" :class="{ active: isActive('/admin/dashboard') }">
          <span>📊 Dashboard</span>
        </NuxtLink>
        <NuxtLink to="/admin/posts" :class="{ active: isActive('/admin/posts') }">
          <span>📝 Posts</span>
        </NuxtLink>
        <NuxtLink to="/admin/comments" :class="{ active: isActive('/admin/comments') }">
          <span>💬 Comments</span>
        </NuxtLink>
        <NuxtLink to="/admin/settings" :class="{ active: isActive('/admin/settings') }">
          <span>⚙️ Settings</span>
        </NuxtLink>
      </nav>
      <div class="sidebar-footer">
        <button @click="handleLogout" class="logout-btn">
          🚪 Logout
        </button>
      </div>
    </aside>

    <main class="admin-content">
      <div class="admin-topbar">
        <NuxtLink to="/" class="back-to-home">← Back to Blog</NuxtLink>
      </div>
      <div class="content-wrapper">
        <slot />
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const isActive = (path: string) => {
  return route.path.startsWith(path)
}

const handleLogout = () => {
  sessionStorage.removeItem('adminAuth')
  router.push('/admin/login')
}
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background-color: #f5f5f5;
}

.admin-sidebar {
  width: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header h2 {
  margin: 0 0 30px 0;
  font-size: 24px;
  text-align: center;
}

.sidebar-nav {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.sidebar-nav a {
  display: block;
  padding: 12px 16px;
  color: white;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.3s ease;
  cursor: pointer;
}

.sidebar-nav a:hover {
  background-color: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.sidebar-nav a.active {
  background-color: rgba(255, 255, 255, 0.3);
  font-weight: bold;
}

.sidebar-footer {
  margin-top: auto;
}

.logout-btn {
  width: 100%;
  padding: 12px;
  background-color: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 8px;
  cursor: pointer;
  font-size: 16px;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background-color: rgba(255, 255, 255, 0.3);
  border-color: rgba(255, 255, 255, 0.5);
}

.admin-content {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.admin-topbar {
  padding: 20px;
  background-color: white;
  border-bottom: 1px solid #eee;
}

.back-to-home {
  color: #667eea;
  text-decoration: none;
  font-weight: 500;
  transition: color 0.3s ease;
}

.back-to-home:hover {
  color: #764ba2;
}

.content-wrapper {
  padding: 30px;
  flex: 1;
  overflow-y: auto;
}

@media (max-width: 768px) {
  .admin-layout {
    flex-direction: column;
  }

  .admin-sidebar {
    width: 100%;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }

  .sidebar-nav {
    flex-direction: row;
  }

  .sidebar-footer {
    margin-top: 0;
  }
}
</style>
