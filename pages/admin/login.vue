<template>
  <div class="admin-login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-header">
          <h1>Admin Panel</h1>
          <p>Secure Access Only</p>
        </div>

        <form @submit.prevent="handleLogin" class="login-form">
          <div class="form-group">
            <label for="password">Password</label>
            <input
              id="password"
              v-model="password"
              type="password"
              placeholder="Enter admin password"
              required
              :disabled="loading"
              autofocus
            />
          </div>

          <div v-if="error" class="form-error">
            {{ error }}
          </div>

          <button type="submit" class="login-btn" :disabled="loading">
            {{ loading ? 'Authenticating...' : 'Login' }}
          </button>
        </form>

        <div class="login-footer">
          <NuxtLink to="/" class="back-link">← Back to Home</NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'

definePageMeta({
  layout: false,
})

const router = useRouter()
const password = ref('')
const loading = ref(false)
const error = ref('')

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    // Store password in sessionStorage (not secure, for demo only)
    sessionStorage.setItem('adminAuth', btoa(password.value))
    
    // Verify by trying to fetch admin posts
    await $fetch('/api/admin/posts', {
      headers: {
        'Authorization': `Bearer ${password.value}`
      }
    })

    // Success
    router.push('/admin/dashboard')
  } catch (err: any) {
    error.value = 'Invalid password'
    password.value = ''
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.admin-login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3a 100%);
  padding: 2rem;
}

.login-container {
  width: 100%;
  max-width: 400px;
}

.login-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(240, 147, 251, 0.2);
  border-radius: 12px;
  padding: 2.5rem;
  backdrop-filter: blur(10px);
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.login-header h1 {
  color: #ffc451;
  font-size: 2rem;
  margin: 0 0 0.5rem 0;
}

.login-header p {
  color: #a8a8a8;
  font-size: 0.95rem;
  margin: 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group label {
  color: #e8e6e1;
  font-weight: 600;
}

.form-group input {
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(240, 147, 251, 0.3);
  border-radius: 6px;
  color: #e8e6e1;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-group input:focus {
  outline: none;
  border-color: rgba(240, 147, 251, 0.6);
  background: rgba(255, 255, 255, 0.12);
  box-shadow: 0 0 15px rgba(240, 147, 251, 0.1);
}

.form-error {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  color: #ff6b6b;
  font-size: 0.9rem;
}

.login-btn {
  padding: 0.85rem;
  background: linear-gradient(135deg, #ffc451 0%, #ffb700 100%);
  color: #000;
  border: none;
  border-radius: 6px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

.login-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 196, 81, 0.4);
}

.login-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.login-footer {
  text-align: center;
  margin-top: 1.5rem;
}

.back-link {
  color: #a8a8a8;
  text-decoration: none;
  font-size: 0.9rem;
  transition: all 0.3s ease;
}

.back-link:hover {
  color: #ffc451;
}
</style>
