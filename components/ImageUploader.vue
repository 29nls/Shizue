<template>
  <div class="image-uploader">
    <!-- Upload Area -->
    <div
      class="upload-area"
      :class="{ dragging, uploading }"
      @dragover.prevent="dragging = true"
      @dragleave.prevent="dragging = false"
      @drop.prevent="handleDrop"
    >
      <input
        ref="fileInput"
        type="file"
        accept="image/*"
        @change="handleFileSelect"
        style="display: none"
      />

      <button
        type="button"
        @click="$refs.fileInput?.click()"
        :disabled="uploading"
        class="upload-button"
      >
        <span v-if="uploading" class="upload-spinner">⏳</span>
        <span v-else class="upload-icon">📤</span>
        <span v-if="uploading">Uploading...</span>
        <span v-else>Click to upload or drag & drop</span>
      </button>

      <p class="upload-hint">PNG, JPG, GIF, WebP (max {{ maxSizeMB }}MB)</p>
    </div>

    <!-- Recent Uploads -->
    <div v-if="recentImages.length > 0" class="recent-uploads">
      <h3>Recent Images</h3>
      <div class="image-grid">
        <div
          v-for="img in recentImages"
          :key="img.id"
          class="image-item"
          @click="copyImageUrl(img.url)"
          :title="`Click to copy: ${img.url}`"
        >
          <img :src="img.url" :alt="img.filename" />
          <div class="image-overlay">
            <span class="copy-hint">📋 Copy URL</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Messages -->
    <div v-if="successMessage" class="alert alert-success">
      ✅ {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="alert alert-error">
      ❌ {{ errorMessage }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface UploadedImage {
  id: string
  filename: string
  url: string
  size: number
  width?: number
  height?: number
}

const props = defineProps({
  maxSize: {
    type: Number,
    default: 5242880, // 5MB
  },
})

const emit = defineEmits<{
  'image-uploaded': [image: UploadedImage]
}>()

const fileInput = ref<HTMLInputElement | null>(null)
const dragging = ref(false)
const uploading = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const recentImages = ref<UploadedImage[]>([])

const maxSizeMB = computed(() => Math.round(props.maxSize / 1024 / 1024))

const handleFileSelect = async (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = target.files
  if (files) {
    await uploadFile(files[0])
  }
}

const handleDrop = async (event: DragEvent) => {
  dragging.value = false
  const files = event.dataTransfer?.files
  if (files) {
    await uploadFile(files[0])
  }
}

const uploadFile = async (file: File) => {
  try {
    errorMessage.value = ''
    successMessage.value = ''

    // Validate file
    if (!file.type.startsWith('image/')) {
      errorMessage.value = 'Please select an image file'
      return
    }

    if (file.size > props.maxSize) {
      errorMessage.value = `File too large. Max size: ${maxSizeMB.value}MB`
      return
    }

    uploading.value = true

    // Create FormData
    const formData = new FormData()
    formData.append('file', file)

    // Get auth token
    const adminAuth = sessionStorage.getItem('adminAuth')
    if (!adminAuth) {
      errorMessage.value = 'Authentication required'
      return
    }

    // Upload file
    const response = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminAuth}`,
      },
      body: formData,
    })

    if (!response.ok) {
      const data = await response.json()
      errorMessage.value = data.statusMessage || 'Upload failed'
      return
    }

    const data = await response.json()

    if (!data.success) {
      errorMessage.value = data.message || 'Upload failed'
      return
    }

    // Add to recent images
    recentImages.value.unshift(data.image)

    successMessage.value = `Image "${file.name}" uploaded successfully!`

    // Emit event
    emit('image-uploaded', data.image)

    // Reset input
    if (fileInput.value) {
      fileInput.value.value = ''
    }

    // Clear success message
    setTimeout(() => {
      successMessage.value = ''
    }, 3000)
  } catch (error) {
    console.error('Upload error:', error)
    errorMessage.value = error instanceof Error ? error.message : 'Upload failed'
  } finally {
    uploading.value = false
  }
}

const copyImageUrl = (url: string) => {
  navigator.clipboard.writeText(url).then(() => {
    successMessage.value = 'URL copied to clipboard!'
    setTimeout(() => {
      successMessage.value = ''
    }, 2000)
  })
}
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.upload-area {
  border: 2px dashed #667eea;
  border-radius: 12px;
  padding: 40px 20px;
  text-align: center;
  background: #f8f9ff;
  transition: all 0.3s;
  cursor: pointer;
}

.upload-area:hover {
  border-color: #764ba2;
  background: #f0f0ff;
}

.upload-area.dragging {
  border-color: #764ba2;
  background: #e8e8ff;
  transform: scale(1.02);
}

.upload-area.uploading {
  opacity: 0.6;
  cursor: not-allowed;
}

.upload-button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  padding: 16px 24px;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin: 0 auto;
  transition: all 0.3s;
}

.upload-button:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(102, 126, 234, 0.3);
}

.upload-button:disabled {
  cursor: not-allowed;
  opacity: 0.7;
}

.upload-icon,
.upload-spinner {
  font-size: 1.5rem;
}

.upload-hint {
  color: #999;
  font-size: 0.9rem;
  margin-top: 12px;
}

.recent-uploads {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.recent-uploads h3 {
  color: #1a1a1a;
  margin: 0;
  font-size: 1rem;
}

.image-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(120px, 1fr));
  gap: 12px;
}

.image-item {
  position: relative;
  overflow: hidden;
  border-radius: 8px;
  cursor: pointer;
  border: 2px solid #e0e0e0;
  transition: all 0.3s;
}

.image-item:hover {
  border-color: #667eea;
  transform: scale(1.05);
}

.image-item img {
  width: 100%;
  height: 120px;
  object-fit: cover;
  display: block;
}

.image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.3s;
}

.image-item:hover .image-overlay {
  opacity: 1;
}

.copy-hint {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-align: center;
}

.alert {
  padding: 12px 16px;
  border-radius: 8px;
  font-weight: 500;
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
  .upload-area {
    padding: 24px 16px;
  }

  .image-grid {
    grid-template-columns: repeat(auto-fill, minmax(80px, 1fr));
  }

  .image-item img {
    height: 80px;
  }
}
</style>
