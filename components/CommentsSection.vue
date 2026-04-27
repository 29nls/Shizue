<template>
  <section class="comments-section" data-aos="fade-up">
    <div class="comments-header">
      <h2>Comments ({{ comments.length }})</h2>
      <p v-if="comments.length === 0" class="no-comments">Be the first to comment!</p>
    </div>

    <!-- Comment List -->
    <div v-if="comments.length > 0" class="comments-list">
      <div
        v-for="(comment, index) in comments"
        :key="comment.id"
        class="comment-item"
        :data-aos="`fade-in`"
        :data-aos-delay="`${index * 50}`"
      >
        <div class="comment-avatar">
          {{ comment.author.charAt(0).toUpperCase() }}
        </div>
        <div class="comment-content">
          <div class="comment-header">
            <h4 class="comment-author">{{ comment.author }}</h4>
            <span class="comment-date">{{ formatDate(comment.date) }}</span>
          </div>
          <p class="comment-text">{{ comment.content }}</p>
        </div>
      </div>
    </div>

    <!-- Comment Form -->
    <div class="comment-form-wrapper" data-aos="fade-up">
      <h3>Leave a Comment</h3>
      <form @submit.prevent="submitComment" class="comment-form">
        <div class="form-group">
          <label for="author">Name</label>
          <input
            id="author"
            v-model="form.author"
            type="text"
            placeholder="Your name"
            required
            maxlength="100"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="form.email"
            type="email"
            placeholder="your@email.com"
            required
          />
        </div>

        <div class="form-group">
          <label for="content">Comment</label>
          <textarea
            id="content"
            v-model="form.content"
            placeholder="Share your thoughts..."
            rows="5"
            required
            maxlength="5000"
          ></textarea>
          <div class="char-count">
            {{ form.content.length }} / 5000
          </div>
        </div>

        <div v-if="error" class="form-error">
          {{ error }}
        </div>

        <div v-if="success" class="form-success">
          {{ success }}
        </div>

        <button
          type="submit"
          class="submit-btn"
          :disabled="loading || form.content.length < 3"
        >
          {{ loading ? 'Submitting...' : 'Post Comment' }}
        </button>
      </form>
    </div>
  </section>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'

interface Comment {
  id: string
  author: string
  email: string
  content: string
  date: string
}

const props = defineProps<{
  postSlug: string
}>()

const comments = ref<Comment[]>([])
const loading = ref(false)
const error = ref('')
const success = ref('')

const form = ref({
  author: '',
  email: '',
  content: ''
})

const formatDate = (date: string) => {
  const d = new Date(date)
  const now = new Date()
  const diff = now.getTime() - d.getTime()

  // Less than a minute
  if (diff < 60000) return 'just now'

  // Less than an hour
  if (diff < 3600000) {
    const minutes = Math.floor(diff / 60000)
    return `${minutes}m ago`
  }

  // Less than a day
  if (diff < 86400000) {
    const hours = Math.floor(diff / 3600000)
    return `${hours}h ago`
  }

  // Less than a week
  if (diff < 604800000) {
    const days = Math.floor(diff / 86400000)
    return `${days}d ago`
  }

  // Full date
  return d.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const fetchComments = async () => {
  try {
    const response = await $fetch(`/api/comments/${props.postSlug}`)
    comments.value = response.comments || []
  } catch (err) {
    console.error('Error fetching comments:', err)
  }
}

const submitComment = async () => {
  if (form.value.content.length < 3) {
    error.value = 'Comment must be at least 3 characters'
    return
  }

  loading.value = true
  error.value = ''
  success.value = ''

  try {
    const response = await $fetch('/api/comments/create', {
      method: 'POST',
      body: {
        postSlug: props.postSlug,
        author: form.value.author,
        email: form.value.email,
        content: form.value.content
      }
    })

    if (response.success) {
      success.value = 'Comment submitted! It will appear after moderation.'
      form.value = { author: '', email: '', content: '' }

      // Refresh comments list
      setTimeout(() => {
        fetchComments()
      }, 1000)
    } else {
      error.value = response.error || 'Failed to submit comment'
    }
  } catch (err) {
    error.value = 'Error submitting comment. Please try again.'
    console.error('Error:', err)
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchComments()
})
</script>

<style scoped>
.comments-section {
  max-width: 800px;
  margin: 4rem auto;
  padding: 0 2rem;
}

.comments-header {
  margin-bottom: 2rem;
  border-bottom: 2px solid rgba(240, 147, 251, 0.2);
  padding-bottom: 1.5rem;
}

.comments-header h2 {
  color: #ffffff;
  font-size: 1.8rem;
  margin: 0 0 0.5rem 0;
}

.no-comments {
  color: #a8a8a8;
  font-size: 0.95rem;
  margin: 0;
}

.comments-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  margin-bottom: 3rem;
}

.comment-item {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba(102, 126, 234, 0.05);
  border: 1px solid rgba(240, 147, 251, 0.1);
  border-radius: 8px;
  transition: all 0.3s ease;
}

.comment-item:hover {
  background: rgba(102, 126, 234, 0.08);
  border-color: rgba(240, 147, 251, 0.2);
}

.comment-avatar {
  width: 45px;
  height: 45px;
  border-radius: 50%;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  font-weight: 700;
  font-size: 1.1rem;
  flex-shrink: 0;
}

.comment-content {
  flex: 1;
}

.comment-header {
  display: flex;
  gap: 1rem;
  align-items: baseline;
  margin-bottom: 0.5rem;
}

.comment-author {
  color: #ffffff;
  font-size: 1rem;
  font-weight: 600;
  margin: 0;
}

.comment-date {
  color: #a8a8a8;
  font-size: 0.85rem;
}

.comment-text {
  color: #d0cac4;
  font-size: 0.95rem;
  line-height: 1.6;
  margin: 0;
  word-wrap: break-word;
  white-space: pre-wrap;
}

/* Comment Form */

.comment-form-wrapper {
  padding: 2rem;
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.08) 0%, rgba(118, 75, 162, 0.04) 100%);
  border: 1px solid rgba(240, 147, 251, 0.15);
  border-radius: 12px;
  margin-top: 2rem;
}

.comment-form-wrapper h3 {
  color: #ffffff;
  font-size: 1.3rem;
  margin: 0 0 1.5rem 0;
}

.comment-form {
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
  font-size: 0.95rem;
}

.form-group input,
.form-group textarea {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(240, 147, 251, 0.2);
  border-radius: 6px;
  color: #e8e6e1;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.3s ease;
}

.form-group input:focus,
.form-group textarea:focus {
  outline: none;
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(240, 147, 251, 0.5);
  box-shadow: 0 0 15px rgba(240, 147, 251, 0.1);
}

.form-group textarea {
  resize: vertical;
  min-height: 120px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.char-count {
  font-size: 0.85rem;
  color: #a8a8a8;
  text-align: right;
}

.form-error {
  padding: 0.75rem 1rem;
  background: rgba(239, 68, 68, 0.1);
  border: 1px solid rgba(239, 68, 68, 0.3);
  border-radius: 6px;
  color: #ff6b6b;
  font-size: 0.9rem;
}

.form-success {
  padding: 0.75rem 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid rgba(34, 197, 94, 0.3);
  border-radius: 6px;
  color: #4ade80;
  font-size: 0.9rem;
}

.submit-btn {
  padding: 0.85rem 2rem;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.95rem;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .comment-item {
    flex-direction: column;
    gap: 1rem;
  }

  .comment-header {
    flex-direction: column;
    gap: 0.25rem;
  }

  .comment-form-wrapper {
    padding: 1.5rem;
  }
}
</style>
