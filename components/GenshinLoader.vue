<template>
  <div v-if="showLoader" id="maceng-loader" class="maceng-loader" :class="{ 'loader-hidden': hidden }">
    <div class="loader-particles">
      <div v-for="i in 6" :key="i" class="particle"></div>
    </div>
    <div class="loader-main">
      <div class="loader-glow"></div>
      <div class="loader-icon">
        <svg viewBox="0 0 100 100" fill="none" stroke="currentColor">
          <circle cx="50" cy="50" r="30" stroke="#f093fb" stroke-width="2" />
          <path d="M 50 20 Q 70 50 50 80 Q 30 50 50 20" fill="none" stroke="#667eea" stroke-width="2" />
        </svg>
        <div class="loader-icon-ring"></div>
      </div>
      <div class="loader-line loader-line-1"></div>
      <div class="loader-line loader-line-2"></div>
      <div class="loader-line loader-line-3"></div>
      <div class="loader-line loader-line-4"></div>
    </div>
    <div class="loader-text">
      <h2>{{ siteTitle }}</h2>
      <p>Memuat toko kami...</p>
    </div>
    <div class="loader-progress">
      <div class="loader-progress-bar"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { computed } from 'vue'

const config = useRuntimeConfig()
const siteTitle = computed(() => config.public.siteTitle || 'MACENG MARKET')

const showLoader = ref(true)
const hidden = ref(false)

onMounted(() => {
  // Animate progress bar
  const progressBar = document.querySelector('.loader-progress-bar') as HTMLElement
  if (progressBar) {
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 30
      if (progress > 100) progress = 100
      progressBar.style.width = progress + '%'
      if (progress === 100) clearInterval(interval)
    }, 300)
  }

  // Hide loader after delay
  setTimeout(() => {
    hidden.value = true
    setTimeout(() => {
      showLoader.value = false
    }, 800)
  }, 3000)

  // Also hide on page load
  window.addEventListener('load', () => {
    setTimeout(() => {
      hidden.value = true
      setTimeout(() => {
        showLoader.value = false
      }, 800)
    }, 300)
  })
})
</script>

<style scoped>
#maceng-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3a 100%);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  backdrop-filter: blur(10px);
}

.maceng-loader.loader-hidden {
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.8s ease-out;
}

.loader-main {
  position: relative;
  width: 200px;
  height: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.loader-particles {
  position: absolute;
  width: 100%;
  height: 100%;
  inset: 0;
}

.particle {
  position: absolute;
  width: 4px;
  height: 4px;
  background: radial-gradient(circle, #f093fb 0%, transparent 70%);
  border-radius: 50%;
  animation: float-particle 6s infinite ease-in-out;
}

.particle:nth-child(1) { left: 20%; top: 20%; animation-delay: 0s; --distance: 30px; }
.particle:nth-child(2) { right: 20%; top: 30%; animation-delay: 0.5s; --distance: 35px; }
.particle:nth-child(3) { left: 30%; bottom: 25%; animation-delay: 1s; --distance: 28px; }
.particle:nth-child(4) { right: 25%; bottom: 20%; animation-delay: 1.5s; --distance: 32px; }
.particle:nth-child(5) { left: 50%; top: 10%; animation-delay: 2s; --distance: 25px; }
.particle:nth-child(6) { right: 40%; bottom: 15%; animation-delay: 2.5s; --distance: 30px; }

@keyframes float-particle {
  0%, 100% { transform: translate(0, 0); opacity: 0.3; }
  50% { transform: translate(var(--distance), var(--distance)); opacity: 0.8; }
}

.loader-icon {
  position: relative;
  width: 100px;
  height: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2;
}

.loader-icon svg {
  width: 100%;
  height: 100%;
  filter: drop-shadow(0 0 20px #f093fb);
}

.loader-icon-ring {
  position: absolute;
  width: 120px;
  height: 120px;
  border: 2px solid transparent;
  border-top: 2px solid #667eea;
  border-right: 2px solid #f093fb;
  border-radius: 50%;
  animation: spin-ring 3s linear infinite;
}

@keyframes spin-ring {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.loader-icon-ring::before {
  content: '';
  position: absolute;
  inset: 10px;
  border: 2px solid transparent;
  border-top: 2px solid #764ba2;
  border-left: 2px solid #f093fb;
  border-radius: 50%;
  animation: spin-ring-reverse 5s linear infinite;
}

@keyframes spin-ring-reverse {
  0% { transform: rotate(360deg); }
  100% { transform: rotate(0deg); }
}

.loader-glow {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, #f093fb 0%, transparent 70%);
  border-radius: 50%;
  filter: blur(30px);
  opacity: 0.3;
  animation: pulse-glow 2s ease-in-out infinite;
}

@keyframes pulse-glow {
  0%, 100% { opacity: 0.2; transform: scale(0.8); }
  50% { opacity: 0.5; transform: scale(1.2); }
}

.loader-text {
  position: absolute;
  bottom: 20%;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
  z-index: 10;
}

.loader-text h2 {
  color: #ffffff;
  font-size: 1.5rem;
  margin: 0 0 10px 0;
  font-weight: 600;
  letter-spacing: 2px;
  animation: fadeInDown 1s ease-out 0.5s both;
}

.loader-text p {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.9rem;
  margin: 0;
  animation: fadeInUp 1s ease-out 0.7s both;
}

@keyframes fadeInDown {
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

.loader-progress {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 200px;
  height: 3px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 2px;
  overflow: hidden;
}

.loader-progress-bar {
  height: 100%;
  background: linear-gradient(90deg, #667eea 0%, #f093fb 50%, #764ba2 100%);
  border-radius: 2px;
  width: 0%;
  animation: progress-animate 3s ease-in-out forwards;
  box-shadow: 0 0 10px #f093fb;
}

@keyframes progress-animate {
  0% { width: 0%; }
  50% { width: 70%; }
  100% { width: 100%; }
}

.loader-line {
  position: absolute;
  background: linear-gradient(90deg, transparent, #f093fb, transparent);
  animation: sweep-line 2s ease-in-out infinite;
}

.loader-line-1 { width: 2px; height: 80px; left: 30%; top: 10%; animation-delay: 0s; }
.loader-line-2 { width: 2px; height: 80px; right: 30%; top: 10%; animation-delay: 0.5s; }
.loader-line-3 { width: 80px; height: 2px; left: 10%; top: 35%; animation-delay: 1s; }
.loader-line-4 { width: 80px; height: 2px; right: 10%; top: 35%; animation-delay: 1.5s; }

@keyframes sweep-line {
  0% { opacity: 0; }
  50% { opacity: 1; }
  100% { opacity: 0; }
}

@media (max-width: 768px) {
  .loader-main { width: 150px; height: 150px; }
  .loader-icon-ring { width: 90px; height: 90px; }
  .loader-icon-ring::before { inset: 8px; }
  .loader-text h2 { font-size: 1.2rem; }
  .loader-progress { width: 150px; }
}

@media (max-width: 480px) {
  .loader-main { width: 120px; height: 120px; }
  .loader-icon-ring { width: 70px; height: 70px; }
  .loader-text h2 { font-size: 1rem; }
  .loader-text p { font-size: 0.8rem; }
  .loader-progress { width: 120px; }
  .particle { display: none; }
}
</style>
