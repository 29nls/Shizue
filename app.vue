<template>
  <div class="app-container">
    <!-- Genshin Loader -->
    <GenshinLoader />

    <!-- Main Layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
// App initialization
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: 'genshin-body',
  },
})

// Composables
import { useLanguageDetection } from '~/composables/useLanguageDetection'
import { useMobileDetection } from '~/composables/useMobileDetection'

// Initialize detections
if (process.client) {
  useLanguageDetection()
  useMobileDetection()
}
</script>

<style scoped>
.app-container {
  width: 100%;
  min-height: 100vh;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3a 100%);
  color: #e8e6e1;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow-x: hidden;
}
</style>
