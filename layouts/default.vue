<template>
  <div class="layout">
    <!-- Header/Navigation -->
    <header class="header">
      <div class="header-content">
        <NuxtLink to="/" class="logo">
          <h1>{{ siteTitle }}</h1>
        </NuxtLink>
        <nav class="nav">
          <NuxtLink to="/">Home</NuxtLink>
          <NuxtLink to="/catalog">Katalog</NuxtLink>
          <NuxtLink to="/catalog/equipment">Equipment</NuxtLink>
          <NuxtLink to="/support/faq">FAQ</NuxtLink>
          <NuxtLink to="/account/orders">Pesanan Saya</NuxtLink>
          <a href="#" @click.prevent="toggleLanguageMenu">{{ currentLanguage.toUpperCase() }}</a>
          <div v-if="showLanguageMenu" class="language-menu">
            <button
              v-for="lang in SUPPORTED_LANGUAGES"
              :key="lang"
              @click="setLanguage(lang)"
              :class="{ active: currentLanguage === lang }"
            >
              {{ lang.toUpperCase() }}
            </button>
          </div>
        </nav>
      </div>
    </header>

    <!-- Main Content -->
    <main class="main">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="footer">
      <div class="footer-content">
        <p>&copy; {{ new Date().getFullYear() }} {{ siteTitle }}. All rights reserved.</p>
        <p>Powered by Nuxt 3 with ❤️</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useLanguageDetection } from '~/composables/useLanguageDetection'

const config = useRuntimeConfig()
const siteTitle = computed(() => config.public.siteTitle || 'MACENG MARKET')

const { SUPPORTED_LANGUAGES, getCurrentLanguage, setLanguage } = useLanguageDetection()

const currentLanguage = ref('en')
const showLanguageMenu = ref(false)

const toggleLanguageMenu = () => {
  showLanguageMenu.value = !showLanguageMenu.value
}

onMounted(() => {
  currentLanguage.value = getCurrentLanguage()
})
</script>

<style scoped>
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.header {
  background: rgba(10, 14, 39, 0.8);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(240, 147, 251, 0.1);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  text-decoration: none;
  color: #ffffff;
}

.logo h1 {
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, #ffffff 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.nav {
  display: flex;
  gap: 2rem;
  align-items: center;
}

.nav a {
  color: #e8e6e1;
  text-decoration: none;
  font-weight: 500;
  transition: all 0.3s ease;
  position: relative;
}

.nav a:hover {
  color: #f093fb;
}

.nav a::after {
  content: '';
  position: absolute;
  bottom: -5px;
  left: 0;
  width: 0;
  height: 2px;
  background: linear-gradient(90deg, #667eea, #f093fb);
  transition: width 0.3s ease;
}

.nav a:hover::after {
  width: 100%;
}

.language-menu {
  position: absolute;
  top: 100%;
  right: 0;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(240, 147, 251, 0.2);
  border-radius: 8px;
  padding: 0.5rem;
  margin-top: 0.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.language-menu button {
  background: transparent;
  border: none;
  color: #e8e6e1;
  padding: 0.5rem 1rem;
  cursor: pointer;
  border-radius: 4px;
  transition: all 0.2s ease;
  font-weight: 500;
}

.language-menu button:hover {
  background: rgba(240, 147, 251, 0.1);
  color: #f093fb;
}

.language-menu button.active {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
}

.main {
  flex: 1;
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
  padding: 2rem 1.5rem;
}

.footer {
  background: linear-gradient(180deg, transparent 0%, rgba(0, 0, 0, 0.3) 100%);
  border-top: 1px solid rgba(240, 147, 251, 0.1);
  padding: 2rem 1.5rem;
  text-align: center;
}

.footer-content p {
  margin: 0.5rem 0;
  color: #a8a8a8;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
  }

  .nav {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .main {
    padding: 1rem;
  }
}
</style>
