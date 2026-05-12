<template>
  <div class="admin-form-page">
    <div class="form-header">
      <NuxtLink to="/admin/items" class="btn-back">← Kembali</NuxtLink>
      <h1>➕ Tambah Item Baru</h1>
    </div>

    <form @submit.prevent="submitForm" class="item-form">
      <!-- Basic Info Section -->
      <fieldset class="form-section">
        <legend>Informasi Dasar</legend>

        <div class="form-group">
          <label for="name">Nama Item *</label>
          <input
            id="name"
            v-model="form.name"
            type="text"
            required
            placeholder="Contoh: Pedang Api Legendaris"
            maxlength="100"
          />
        </div>

        <div class="form-group">
          <label for="slug">Slug *</label>
          <input
            id="slug"
            v-model="form.slug"
            type="text"
            required
            placeholder="pedang-api-legendaris"
            @blur="validateSlug"
          />
          <p class="form-hint">Digunakan untuk URL halaman item</p>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label for="categoryId">Kategori *</label>
            <select id="categoryId" v-model="form.categoryId" required>
              <option value="">Pilih Kategori</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="rarity">Rarity *</label>
            <select id="rarity" v-model="form.rarity" required>
              <option value="">Pilih Rarity</option>
              <option value="common">Common</option>
              <option value="uncommon">Uncommon</option>
              <option value="rare">Rare</option>
              <option value="epic">Epic</option>
              <option value="legendary">Legendary</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label for="shortDescription">Deskripsi Singkat *</label>
          <textarea
            id="shortDescription"
            v-model="form.shortDescription"
            placeholder="Deskripsi singkat untuk preview"
            rows="2"
            maxlength="160"
            required
          />
          <p class="form-hint">Max 160 karakter</p>
        </div>

        <div class="form-group">
          <label for="description">Deskripsi Lengkap *</label>
          <textarea
            id="description"
            v-model="form.description"
            placeholder="Deskripsi detail produk"
            rows="5"
            required
          />
        </div>
      </fieldset>

      <!-- Pricing Section -->
      <fieldset class="form-section">
        <legend>Harga & Diskon</legend>

        <div class="form-row">
          <div class="form-group">
            <label for="price">Harga Jual (Rp) *</label>
            <input
              id="price"
              v-model.number="form.price"
              type="number"
              required
              min="0"
              step="1000"
            />
          </div>

          <div class="form-group">
            <label for="originalPrice">Harga Asli (Rp)</label>
            <input
              id="originalPrice"
              v-model.number="form.originalPrice"
              type="number"
              min="0"
              step="1000"
              placeholder="Kosongkan jika tidak ada diskon"
            />
          </div>

          <div class="form-group">
            <label for="discount">Diskon (%)</label>
            <input
              id="discount"
              v-model.number="form.discount"
              type="number"
              min="0"
              max="100"
              step="1"
            />
          </div>
        </div>
      </fieldset>

      <!-- Stock & Requirements -->
      <fieldset class="form-section">
        <legend>Stok & Requirement</legend>

        <div class="form-row">
          <div class="form-group">
            <label for="stock">Jumlah Stok *</label>
            <input
              id="stock"
              v-model.number="form.stock"
              type="number"
              required
              min="0"
              step="1"
            />
          </div>

          <div class="form-group">
            <label for="levelRequirement">Level Minimum</label>
            <input
              id="levelRequirement"
              v-model.number="form.levelRequirement"
              type="number"
              min="1"
              step="1"
            />
          </div>

          <div class="form-group">
            <label for="classRequirement">Class (pisahkan dengan koma)</label>
            <input
              id="classRequirement"
              v-model="form.classRequirement"
              type="text"
              placeholder="Warrior,Mage,Archer"
            />
          </div>
        </div>
      </fieldset>

      <!-- Specifications -->
      <fieldset class="form-section">
        <legend>Spesifikasi Item</legend>
        <p class="form-hint">Format: label|value, setiap baris adalah spek berbeda</p>

        <textarea
          v-model="form.specsText"
          placeholder="Damage|45-55
Kecepatan Serangan|1.0x
Berat|15kg"
          rows="5"
        />
      </fieldset>

      <!-- Images -->
      <fieldset class="form-section">
        <legend>Gambar</legend>

        <div class="form-group">
          <label for="mainImage">URL Gambar Utama *</label>
          <input
            id="mainImage"
            v-model="form.mainImage"
            type="url"
            required
            placeholder="https://example.com/image.jpg"
          />
          <img v-if="form.mainImage" :src="form.mainImage" :alt="form.name" class="preview-image" />
        </div>

        <div class="form-group">
          <label for="galleryImages">Gallery Images (URL, pisahkan dengan newline)</label>
          <textarea
            id="galleryImages"
            v-model="form.galleryImagesText"
            placeholder="https://example.com/image1.jpg
https://example.com/image2.jpg"
            rows="4"
          />
        </div>
      </fieldset>

      <!-- Status -->
      <fieldset class="form-section">
        <legend>Status</legend>

        <div class="form-group checkbox">
          <input id="isActive" v-model="form.isActive" type="checkbox" />
          <label for="isActive">Item Aktif</label>
        </div>

        <div class="form-group checkbox">
          <input id="isDraft" v-model="form.isDraft" type="checkbox" />
          <label for="isDraft">Simpan sebagai Draft</label>
        </div>

        <div class="form-group checkbox">
          <input id="isOnSale" v-model="form.isOnSale" type="checkbox" />
          <label for="isOnSale">Sedang dalam Flash Sale</label>
        </div>

        <div class="form-group checkbox">
          <input id="isFeatured" v-model="form.isFeatured" type="checkbox" />
          <label for="isFeatured">Item Unggulan</label>
        </div>
      </fieldset>

      <!-- Submit -->
      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="submitting">
          {{ submitting ? 'Menyimpan...' : '💾 Simpan Item' }}
        </button>
        <NuxtLink to="/admin/items" class="btn btn-secondary">Batal</NuxtLink>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const categories = ref([])
const submitting = ref(false)

const form = ref({
  name: '',
  slug: '',
  description: '',
  shortDescription: '',
  categoryId: '',
  price: 0,
  originalPrice: null,
  discount: 0,
  stock: 0,
  rarity: '',
  levelRequirement: 1,
  classRequirement: '',
  mainImage: '',
  galleryImagesText: '',
  specsText: '',
  isActive: true,
  isDraft: false,
  isOnSale: false,
  isFeatured: false,
})

onMounted(async () => {
  try {
    const { data } = await $fetch('/api/categories')
    categories.value = data
  } catch (error) {
    console.error('Error fetching categories:', error)
  }
})

function validateSlug() {
  form.value.slug = form.value.slug
    .toLowerCase()
    .trim()
    .replace(/[^\w-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}

async function submitForm() {
  validateSlug()

  // Parse specs from text format
  const specs = form.value.specsText
    .split('\n')
    .filter((line) => line.trim())
    .map((line) => {
      const [label, value] = line.split('|').map((s) => s.trim())
      return { label, value }
    })

  // Parse gallery images
  const galleryImages = form.value.galleryImagesText
    .split('\n')
    .filter((line) => line.trim())

  const payload = {
    ...form.value,
    originalPrice: form.value.originalPrice || undefined,
    specs: JSON.stringify(specs),
    galleryImages: JSON.stringify(galleryImages),
  }

  submitting.value = true
  try {
    await $fetch('/api/admin/items', {
      method: 'POST',
      body: payload,
    })
    alert('✅ Item berhasil ditambahkan!')
    await router.push('/admin/items')
  } catch (error) {
    alert('❌ Error: ' + (error.data?.message || error.message))
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped>
.admin-form-page {
  padding: 2rem;
  max-width: 900px;
  margin: 0 auto;
}

.form-header {
  margin-bottom: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.btn-back {
  background: white;
  color: #667eea;
  border: 1px solid #667eea;
  padding: 0.5rem 1rem;
  border-radius: 0.375rem;
  text-decoration: none;
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.btn-back:hover {
  background: #667eea;
  color: white;
}

.form-header h1 {
  margin: 0;
  font-size: 1.8rem;
  color: #333;
}

.item-form {
  background: white;
  border-radius: 0.5rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-section {
  padding: 2rem;
  border-bottom: 1px solid #eee;
}

.form-section:last-of-type {
  border-bottom: none;
}

.form-section legend {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 1.5rem;
  display: block;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-group label {
  display: block;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
  font-size: 0.95rem;
}

.form-group input[type='text'],
.form-group input[type='url'],
.form-group input[type='number'],
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 0.375rem;
  font-size: 1rem;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
}

.form-hint {
  font-size: 0.85rem;
  color: #999;
  margin-top: 0.25rem;
}

.form-row {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
}

.form-group.checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.form-group.checkbox input {
  width: auto;
  margin: 0;
}

.form-group.checkbox label {
  margin: 0;
  font-weight: 400;
}

.preview-image {
  max-width: 200px;
  max-height: 200px;
  margin-top: 1rem;
  border-radius: 0.375rem;
  border: 1px solid #ddd;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-start;
  padding: 2rem;
  background: #f8f9fa;
  border-top: 1px solid #eee;
}

.btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 0.375rem;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s;
  text-decoration: none;
  display: inline-block;
}

.btn-primary {
  background: #667eea;
  color: white;
}

.btn-primary:hover:not(:disabled) {
  background: #5568d3;
}

.btn-primary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  color: #666;
  border: 1px solid #ddd;
}

.btn-secondary:hover {
  background: #f8f9fa;
}

@media (max-width: 768px) {
  .admin-form-page {
    padding: 1rem;
  }

  .form-section {
    padding: 1.5rem 1rem;
  }

  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
