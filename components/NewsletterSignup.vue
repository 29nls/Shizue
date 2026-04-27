<template>
  <section class="newsletter-section" :data-aos="animate ? 'fade-up' : undefined">
    <div class="newsletter-container">
      <div class="newsletter-content">
        <h2 class="newsletter-title">
          <span class="icon">✉️</span>
          Stay Updated
        </h2>
        <p class="newsletter-description">
          Get the latest posts delivered right to your inbox
        </p>
      </div>

      <form @submit.prevent="handleSubscribe" class="newsletter-form">
        <div class="form-group">
          <input
            v-model="email"
            type="email"
            placeholder="Enter your email"
            required
            :disabled="loading"
            class="email-input"
          />
          <button
            type="submit"
            class="subscribe-btn"
            :disabled="loading || !email"
          >
            {{ loading ? 'Subscribing...' : 'Subscribe' }}
          </button>
        </div>

        <div v-if="error" class="message error">
          {{ error }}
        </div>

        <div v-if="success" class="message success">
          {{ success }}
        </div>

        <p class="newsletter-note">
          No spam, just great content. Unsubscribe anytime.
        </p>
      </form>
    </div>

    <!-- Background decoration -->
    <div class="newsletter-decoration"></div>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'

defineProps<{
  animate?: boolean
}>()

const email = ref('')
const loading = ref(false)
const error = ref('')
const success = ref('')

const handleSubscribe = async () => {
  if (!email.value) return

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await $fetch('/api/newsletter/subscribe', {
      method: 'POST',
      body: {
        email: email.value
      }
    })

    if (response.success) {
      success.value = response.message
      email.value = ''

      // Clear message after 5 seconds
      setTimeout(() => {
        success.value = ''
      }, 5000)
    } else {
      error.value = response.error || 'Failed to subscribe'
    }
  } catch (err: any) {
    error.value = err.data?.error || 'An error occurred. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.newsletter-section {
  position: relative;
  margin: 4rem 0;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.1) 0%, rgba(118, 75, 162, 0.05) 100%);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 16px;
  overflow: hidden;
}

.newsletter-container {
  position: relative;
  z-index: 1;
  max-width: 600px;
  margin: 0 auto;
}

.newsletter-content {
  text-align: center;
  margin-bottom: 2rem;
}

.newsletter-title {
  color: #ffffff;
  font-size: 1.8rem;
  margin: 0 0 1rem 0;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
}

.icon {
  font-size: 2.2rem;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

.newsletter-description {
  color: #d0cac4;
  font-size: 1rem;
  margin: 0;
  line-height: 1.6;
}

.newsletter-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.form-group {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.email-input {
  flex: 1;
  min-width: 200px;
  padding: 0.9rem 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 2px solid rgba(240, 147, 251, 0.3);
  border-radius: 8px;
  color: #e8e6e1;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.email-input::placeholder {
  color: #888;
}

.email-input:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.15);
  border-color: rgba(240, 147, 251, 0.6);
  box-shadow: 0 0 20px rgba(240, 147, 251, 0.2);
}

.email-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.subscribe-btn {
  padding: 0.9rem 1.8rem;
  background: linear-gradient(135deg, #ffc451 0%, #ffb700 100%);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
  white-space: nowrap;
}

.subscribe-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 196, 81, 0.4);
}

.subscribe-btn:active:not(:disabled) {
  transform: translateY(0);
}

.subscribe-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.message {
  padding: 0.9rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  text-align: center;
  animation: slideDown 0.3s ease;
}

@keyframes slideDown {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.message.error {
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  color: #ff6b6b;
}

.message.success {
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  color: #4ade80;
}

.newsletter-note {
  color: #a8a8a8;
  font-size: 0.85rem;
  text-align: center;
  margin: 0;
}

/* Decoration */
.newsletter-decoration {
  position: absolute;
  top: 0;
  right: 0;
  width: 300px;
  height: 300px;
  background: radial-gradient(circle, rgba(240, 147, 251, 0.1) 0%, transparent 70%);
  border-radius: 50%;
  transform: translate(100px, -100px);
  pointer-events: none;
  z-index: 0;
}

@media (max-width: 768px) {
  .newsletter-section {
    padding: 2rem 1.5rem;
    margin: 2rem 0;
  }

  .newsletter-title {
    font-size: 1.5rem;
  }

  .form-group {
    flex-direction: column;
  }

  .email-input {
    width: 100%;
    min-width: unset;
  }

  .subscribe-btn {
    width: 100%;
  }
}
</style>
