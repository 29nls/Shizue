<template>
  <div class="app-container">
    <!-- Genshin Loader - Client only -->
    <ClientOnly>
      <GenshinLoader />
    </ClientOnly>

    <!-- Main Layout -->
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useScrollAnimation } from '~/composables/useScrollAnimation'
import { useLanguageDetection } from '~/composables/useLanguageDetection'
import { useMobileDetection } from '~/composables/useMobileDetection'

// App initialization
useHead({
  htmlAttrs: {
    lang: 'en',
  },
  bodyAttrs: {
    class: 'genshin-body',
  },
  script: [
    {
      async: true,
      src: 'https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX', // Replace with your GA4 ID
      // @ts-ignore
      onload() {
        window.dataLayer = window.dataLayer || []
        function gtag() {
          // @ts-ignore
          window.dataLayer.push(arguments)
        }
        gtag('js', new Date())
        gtag('config', 'G-XXXXXXXXXX') // Replace with your GA4 ID
      }
    }
  ]
})

// Initialize scroll animations
const { initializeAOS, refreshAOS } = useScrollAnimation()

const route = useRoute()

// Initialize detections and animations
if (process.client) {
  useLanguageDetection()
  useMobileDetection()
  
  onMounted(() => {
    initializeAOS()
  })
  
  watch(() => route.path, () => {
    nextTick(() => {
      refreshAOS()
    })
  })
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
