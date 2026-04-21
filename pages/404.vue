<template>
  <div class="not-found-page">
    <div class="content">
      <div class="error-code">404</div>
      
      <h1 class="error-title">Page Not Found</h1>
      <p class="error-message">
        Sorry, we couldn't find the page you're looking for. It might have been moved or deleted.
      </p>

      <div class="error-illustration">
        <svg viewBox="0 0 200 200" width="200" height="200">
          <circle cx="100" cy="100" r="90" fill="none" stroke="url(#gradient)" stroke-width="2" opacity="0.3" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="url(#gradient)" stroke-width="2" opacity="0.2" />
          
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style="stop-color:#667eea;stop-opacity:1" />
              <stop offset="100%" style="stop-color:#f093fb;stop-opacity:1" />
            </linearGradient>
          </defs>

          <!-- Question mark -->
          <text x="100" y="120" font-size="80" font-weight="700" text-anchor="middle" fill="url(#gradient)">
            ?
          </text>
        </svg>
      </div>

      <div class="cta-buttons">
        <NuxtLink to="/" class="btn btn-primary">
          ← Back to Home
        </NuxtLink>
        <button class="btn btn-secondary" @click="goBack">
          ← Go Back
        </button>
      </div>

      <div class="suggestions">
        <h2>You might also like:</h2>
        <ul>
          <li><NuxtLink to="/">Home</NuxtLink></li>
          <li><NuxtLink to="/archive">All Articles</NuxtLink></li>
          <li><NuxtLink to="/#categories">Browse Categories</NuxtLink></li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()

const goBack = () => {
  router.back()
}

useHead({
  title: '404 - Page Not Found',
  meta: [
    {
      name: 'description',
      content: 'The page you are looking for could not be found.',
    },
  ],
})
</script>

<style scoped>
.not-found-page {
  width: 100%;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #0a0e27 0%, #1a1a3a 100%);
  padding: 2rem;
  margin-top: -4rem;
  padding-top: 6rem;
}

.content {
  text-align: center;
  max-width: 600px;
  animation: fadeInUp 0.8s ease-out;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.error-code {
  font-size: clamp(3rem, 15vw, 8rem);
  font-weight: 900;
  background: linear-gradient(135deg, #667eea 0%, #f093fb 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin: 0;
  letter-spacing: -2px;
  text-shadow: 0 0 30px rgba(240, 147, 251, 0.3);
}

.error-title {
  color: #ffffff;
  font-size: 2.5rem;
  font-weight: 800;
  margin: 1rem 0;
  letter-spacing: -1px;
}

.error-message {
  color: #a8a8a8;
  font-size: 1.05rem;
  line-height: 1.6;
  margin: 1.5rem 0;
}

.error-illustration {
  margin: 3rem 0;
  display: flex;
  justify-content: center;
  animation: float 3s ease-in-out infinite;
}

@keyframes float {
  0%, 100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

.error-illustration svg {
  width: 200px;
  height: 200px;
  max-width: 100%;
}

/* ========== CTA BUTTONS ========== */

.cta-buttons {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
  margin: 2.5rem 0;
}

.btn {
  padding: 1rem 2rem;
  font-size: 1rem;
  font-weight: 600;
  border: 2px solid transparent;
  border-radius: 9999px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-transform: uppercase;
  letter-spacing: 1px;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.3);
}

.btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 0 30px rgba(240, 147, 251, 0.5);
  filter: brightness(1.1);
}

.btn-secondary {
  background: rgba(240, 147, 251, 0.1);
  border: 2px solid #f093fb;
  color: #f093fb;
  backdrop-filter: blur(10px);
}

.btn-secondary:hover {
  background: rgba(240, 147, 251, 0.2);
  transform: translateY(-3px);
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.3);
}

/* ========== SUGGESTIONS ========== */

.suggestions {
  margin-top: 3rem;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(240, 147, 251, 0.1);
  border-radius: 12px;
  animation: slideUp 0.8s ease-out 0.2s both;
}

@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.suggestions h2 {
  color: #ffffff;
  font-size: 1.2rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
}

.suggestions ul {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.suggestions li {
  margin: 0;
}

.suggestions a {
  color: #f093fb;
  text-decoration: none;
  font-weight: 600;
  transition: all 0.3s ease;
  display: inline-block;
}

.suggestions a:hover {
  transform: translateX(5px);
  color: #ffffff;
}

/* ========== RESPONSIVE ========== */

@media (max-width: 768px) {
  .not-found-page {
    padding-top: 4rem;
    min-height: calc(100vh - 4rem);
  }

  .error-code {
    font-size: 3rem;
  }

  .error-title {
    font-size: 1.5rem;
  }

  .error-message {
    font-size: 1rem;
  }

  .cta-buttons {
    flex-direction: column;
    gap: 1rem;
  }

  .btn {
    width: 100%;
  }

  .suggestions ul {
    flex-direction: row;
    flex-wrap: wrap;
    justify-content: center;
    gap: 1rem;
  }

  .suggestions li {
    flex: 1;
    min-width: 150px;
  }
}
</style>
