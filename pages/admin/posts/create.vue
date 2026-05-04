<template>
  <div class="admin-create-post">
    <div class="container">
      <!-- Header -->
      <div class="page-header">
        <NuxtLink to="/admin/posts" class="back-link">← Back to Posts</NuxtLink>
        <h1>Create New Post</h1>
        <p class="subtitle">Write and publish a new blog post</p>
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="post-form">
        <!-- Title -->
        <div class="form-group">
          <label for="title">Post Title *</label>
          <input
            id="title"
            v-model="form.title"
            type="text"
            placeholder="Enter post title..."
            maxlength="200"
            required
            class="form-input"
          />
          <small>{{ form.title.length }}/200</small>
        </div>

        <!-- Excerpt -->
        <div class="form-group">
          <label for="excerpt">Excerpt</label>
          <textarea
            id="excerpt"
            v-model="form.excerpt"
            placeholder="Brief summary of your post..."
            maxlength="300"
            rows="3"
            class="form-input"
          ></textarea>
          <small>{{ form.excerpt.length }}/300</small>
        </div>

        <!-- Cover Image -->
        <div class="form-group">
          <label>Cover Image</label>
          <ImageUploader @image-uploaded="handleCoverImageUpload" />
          <small v-if="form.coverImage" class="preview">
            <img :src="form.coverImage" alt="Cover Preview" />
          </small>
        </div>

        <!-- Content (Markdown) -->
        <div class="form-group">
          <label>Post Content *</label>
          <div class="editor-section">
            <div class="editor-toolbar-custom">
              <ImageUploader @image-uploaded="handleContentImageUpload" />
            </div>
            <textarea v-model="form.content" class="form-input" placeholder="Write your post in Markdown..." style="min-height: 300px"></textarea>
          </div>
        </div>

        <!-- Categories -->
        <div class="form-group">
          <label for="categories">Categories</label>
          <input
            id="categories"
            v-model="categoriesInput"
            type="text"
            placeholder="Enter categories separated by commas (e.g., tech, vue, nuxt)"
            class="form-input"
          />
          <div class="tags-display" v-if="form.categories.length > 0">
            <span v-for="(cat, i) in form.categories" :key="i" class="tag">
              {{ cat }}
              <button type="button" @click="removeCategory(i)" class="remove-tag">×</button>
            </span>
          </div>
        </div>

        <!-- Tags -->
        <div class="form-group">
          <label for="tags">Tags</label>
          <input
            id="tags"
            v-model="tagsInput"
            type="text"
            placeholder="Enter tags separated by commas (e.g., javascript, frontend)"
            class="form-input"
          />
          <div class="tags-display" v-if="form.tags.length > 0">
            <span v-for="(tag, i) in form.tags" :key="i" class="tag">
              {{ tag }}
              <button type="button" @click="removeTag(i)" class="remove-tag">×</button>
            </span>
          </div>
        </div>

        <!-- Author -->
        <div class="form-group">
          <label for="author">Author</label>
          <input
            id="author"
            v-model="form.author"
            type="text"
            placeholder="Author name"
            maxlength="100"
            class="form-input"
          />
        </div>

        <!-- Publishing Options -->
        <div class="form-group">
          <div class="checkbox-group">
            <input
              id="published"
              v-model="form.published"
              type="checkbox"
              class="form-checkbox"
            />
            <label for="published">Publish immediately</label>
          </div>
          <small v-if="form.published">Post will be published when you click Save</small>
          <small v-else>Post will be saved as draft</small>
        </div>

        <!-- Actions -->
        <div class="form-actions">
          <button
            type="submit"
            :disabled="isSubmitting || !form.title || !form.content"
            class="btn btn-primary"
          >
            <span v-if="isSubmitting">Creating...</span>
            <span v-else>Create Post</span>
          </button>
          <NuxtLink to="/admin/posts" class="btn btn-secondary">Cancel</NuxtLink>
        </div>

        <!-- Messages -->
        <div v-if="successMessage" class="alert alert-success">
          {{ successMessage }}
        </div>
        <div v-if="errorMessage" class="alert alert-error">
          {{ errorMessage }}
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRouter } from 'nuxt/app'

definePageMeta({
  layout: 'admin',
})

const router = useRouter()
const isSubmitting = ref(false)
const successMessage = ref('')
const errorMessage = ref('')

const form = ref({
  title: '',
  excerpt: '',
  content: '',
  categories: [] as string[],
  tags: [] as string[],
  author: 'Admin',
  coverImage: '',
  published: false,
})

const categoriesInput = ref('')
const tagsInput = ref('')

// Update categories from input
const updateCategories = () => {
  form.value.categories = categoriesInput.value
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0)
}

// Update tags from input
const updateTags = () => {
  form.value.tags = tagsInput.value
    .split(',')
    .map(t => t.trim())
    .filter(t => t.length > 0)
}

const removeCategory = (index: number) => {
  form.value.categories.splice(index, 1)
  updateCategoriesInput()
}

const removeTag = (index: number) => {
  form.value.tags.splice(index, 1)
  updateTagsInput()
}

const updateCategoriesInput = () => {
  categoriesInput.value = form.value.categories.join(', ')
}

const updateTagsInput = () => {
  tagsInput.value = form.value.tags.join(', ')
}

// Watch inputs
const handleCategoriesChange = () => {
  updateCategories()
}

const handleTagsChange = () => {
  updateTags()
}

// Image upload handlers
const handleCoverImageUpload = (image: any) => {
  form.value.coverImage = image.url
}

const handleContentImageUpload = (image: any) => {
  // Insert image markdown into content
  const imageMarkdown = `\n![${image.filename}](${image.url})\n`
  form.value.content += imageMarkdown
}

// Submit form
const handleSubmit = async () => {
  try {
    isSubmitting.value = true
    errorMessage.value = ''
    successMessage.value = ''

    // Update categories and tags
    updateCategories()
    updateTags()

    // Validate
    if (!form.value.title || !form.value.content) {
      errorMessage.value = 'Title and content are required'
      return
    }

    // Get auth token
    const adminAuth = sessionStorage.getItem('adminAuth')
    if (!adminAuth) {
      errorMessage.value = 'Authentication required. Please log in again.'
      await router.push('/admin/login')
      return
    }

    // Create post
    const response = await fetch('/api/admin/posts/create', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminAuth}`,
      },
      body: JSON.stringify({
        title: form.value.title,
        excerpt: form.value.excerpt || form.value.content.substring(0, 150),
        content: form.value.content,
        categories: form.value.categories,
        tags: form.value.tags,
        author: form.value.author,
        coverImage: form.value.coverImage,
        published: form.value.published,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      errorMessage.value = data.message || 'Failed to create post'
      return
    }

    successMessage.value = 'Post created successfully!'
    setTimeout(() => {
      router.push(`/post/${data.slug}`)
    }, 1500)
  } catch (error) {
    console.error('Create post error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Failed to create post'
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.admin-create-post {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 40px 20px;
}

.container {
  max-width: 900px;
  margin: 0 auto;
  background: white;
  border-radius: 12px;
  padding: 40px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.page-header {
  margin-bottom: 30px;
}

.back-link {
  display: inline-block;
  color: #667eea;
  text-decoration: none;
  margin-bottom: 15px;
  font-weight: 500;
  transition: color 0.3s;
}

.back-link:hover {
  color: #764ba2;
}

.page-header h1 {
  font-size: 2.5rem;
  color: #1a1a1a;
  margin: 10px 0;
}

.subtitle {
  color: #666;
  font-size: 1.1rem;
}

.post-form {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #1a1a1a;
  font-size: 1rem;
}

.form-input {
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 1rem;
  font-family: inherit;
  transition: border-color 0.3s;
}

.form-input:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

textarea.form-input {
  resize: vertical;
}

.form-group small {
  color: #999;
  font-size: 0.9rem;
}

.preview {
  margin-top: 10px;
}

.preview img {
  max-width: 100%;
  max-height: 300px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
}

.tags-display {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 10px;
}

.editor-section {
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 16px;
  background: #f9f9f9;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.editor-toolbar-custom {
  padding: 12px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
}

.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0f0f0;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  color: #333;
}

.remove-tag {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.2rem;
  color: #999;
  padding: 0;
  margin: 0;
  transition: color 0.2s;
}

.remove-tag:hover {
  color: #d32f2f;
}

.checkbox-group {
  display: flex;
  align-items: center;
  gap: 10px;
}

.form-checkbox {
  width: 20px;
  height: 20px;
  cursor: pointer;
  accent-color: #667eea;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid #e0e0e0;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s;
  text-decoration: none;
  display: inline-block;
  text-align: center;
}

.btn-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-primary:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: #e0e0e0;
  color: #333;
}

.btn-secondary:hover {
  background: #d0d0d0;
}

.alert {
  padding: 16px;
  border-radius: 8px;
  font-weight: 500;
  margin-top: 20px;
}

.alert-success {
  background: #d4edda;
  color: #155724;
  border: 2px solid #c3e6cb;
}

.alert-error {
  background: #f8d7da;
  color: #721c24;
  border: 2px solid #f5c6cb;
}

@media (max-width: 768px) {
  .container {
    padding: 20px;
  }

  .page-header h1 {
    font-size: 2rem;
  }

  .form-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
