<template>
  <div class="search-page">
    <div class="search-header">
      <h1>Search Posts</h1>
      <p>Find articles by keyword, category, or date</p>
    </div>

    <div class="search-container">
      <div class="search-input-wrapper">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search blog posts..."
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <button @click="handleSearch" class="search-button">Search</button>
      </div>

      <div class="search-filters">
        <select v-model="selectedCategory" class="filter-select">
          <option value="">All Categories</option>
          <option v-for="cat in categories" :key="cat" :value="cat">
            {{ cat }}
          </option>
        </select>

        <select v-model="dateRange" class="filter-select">
          <option value="">Any Time</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
          <option value="year">This Year</option>
        </select>
      </div>
    </div>

    <div v-if="searched" class="search-results">
      <p class="results-count">
        {{ results.length }} result{{ results.length !== 1 ? 's' : '' }} found
        <span v-if="searchQuery">"{{ searchQuery }}"</span>
      </p>

      <div v-if="results.length > 0" class="results-list">
        <NuxtLink
          v-for="result in results"
          :key="result.slug"
          :to="`/post/${result.slug}`"
          class="result-item"
        >
          <div class="result-content">
            <h3 class="result-title">{{ result.title }}</h3>
            <p class="result-excerpt">{{ result.excerpt }}</p>
            <div class="result-meta">
              <span class="result-date">{{ formatDate(result.date) }}</span>
              <span
                v-for="cat in result.categories.slice(0, 2)"
                :key="cat"
                class="result-category"
              >
                {{ cat }}
              </span>
            </div>
          </div>
        </NuxtLink>
      </div>

      <div v-else class="no-results">
        <p>No results found for "{{ searchQuery }}"</p>
        <p>Try different keywords or browse by category.</p>
      </div>
    </div>

    <div v-else class="search-tips">
      <h2>Tips for Better Search</h2>
      <ul>
        <li>Use specific keywords</li>
        <li>Try shorter search terms</li>
        <li>Use filters to narrow results</li>
        <li>Browse by category</li>
      </ul>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { usePostFetching } from '~/composables/usePostFetching'

const route = useRoute()
const router = useRouter()
const searchQuery = ref('')
const selectedCategory = ref('')
const dateRange = ref('')
const results = ref<any[]>([])
const searched = ref(false)

const { categories } = usePostFetching()

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleSearch = async () => {
  if (!searchQuery.value.trim()) {
    searched.value = false
    return
  }

  searched.value = true
  try {
    const params = new URLSearchParams({
      q: searchQuery.value,
      ...(selectedCategory.value && { category: selectedCategory.value }),
      ...(dateRange.value && { dateRange: dateRange.value })
    })

    const response = await $fetch(`/api/search?${params}`)
    results.value = response.results || []
  } catch (error) {
    console.error('Search error:', error)
    results.value = []
  }
}

onMounted(() => {
  const q = route.query.q as string
  if (q) {
    searchQuery.value = q
    handleSearch()
  }
})
</script>

<style scoped>
.search-page {
  min-height: 100vh;
  padding: 4rem 2rem;
  background: linear-gradient(135deg, rgba(10, 14, 39, 0.5) 0%, rgba(26, 26, 58, 0.3) 100%);
}

.search-header {
  text-align: center;
  margin-bottom: 3rem;
}

.search-header h1 {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #ffc451 0%, #4098ff 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: 0.5rem;
  font-weight: 700;
}

.search-header p {
  color: #d0cac4;
  font-size: 1.1rem;
}

.search-container {
  max-width: 900px;
  margin: 0 auto 3rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.search-input-wrapper {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.search-input {
  flex: 1;
  min-width: 250px;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 196, 81, 0.2);
  border-radius: 8px;
  color: #e8e6e1;
  font-size: 1rem;
  transition: all 0.3s ease;
}

.search-input:focus {
  outline: none;
  border-color: rgba(255, 196, 81, 0.6);
  background: rgba(255, 255, 255, 0.08);
  box-shadow: 0 0 20px rgba(255, 196, 81, 0.2);
}

.search-button {
  padding: 1rem 2.5rem;
  background: linear-gradient(135deg, #ffc451 0%, #ffb700 100%);
  color: #000;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 20px rgba(255, 196, 81, 0.4);
}

.search-button:active {
  transform: translateY(0);
}

.search-filters {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.filter-select {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border: 2px solid rgba(255, 196, 81, 0.2);
  border-radius: 6px;
  color: #e8e6e1;
  cursor: pointer;
  transition: all 0.3s ease;
  min-width: 150px;
}

.filter-select:hover {
  border-color: rgba(255, 196, 81, 0.4);
  background: rgba(255, 255, 255, 0.07);
}

.filter-select:focus {
  outline: none;
  border-color: rgba(255, 196, 81, 0.6);
}

.search-results {
  max-width: 900px;
  margin: 0 auto;
}

.results-count {
  color: #d0cac4;
  font-size: 1.1rem;
  margin-bottom: 2rem;
  padding: 1rem;
  background: rgba(255, 196, 81, 0.05);
  border-left: 3px solid #ffc451;
  border-radius: 4px;
}

.results-count span {
  color: #ffc451;
  font-weight: 600;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.result-item {
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 196, 81, 0.15);
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.3s ease;
  cursor: pointer;
  display: block;
}

.result-item:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: rgba(255, 196, 81, 0.3);
  transform: translateX(8px);
  box-shadow: 0 5px 20px rgba(255, 196, 81, 0.1);
}

.result-content {
  color: inherit;
}

.result-title {
  font-size: 1.3rem;
  margin-bottom: 0.5rem;
  color: #e8e6e1;
  font-weight: 600;
}

.result-excerpt {
  color: #d0cac4;
  margin-bottom: 1rem;
  line-height: 1.6;
  font-size: 0.95rem;
}

.result-meta {
  display: flex;
  gap: 1rem;
  align-items: center;
  flex-wrap: wrap;
}

.result-date {
  font-size: 0.85rem;
  color: #999;
}

.result-category {
  display: inline-block;
  padding: 0.25rem 0.75rem;
  background: rgba(255, 196, 81, 0.1);
  border: 1px solid rgba(255, 196, 81, 0.3);
  border-radius: 4px;
  font-size: 0.8rem;
  color: #ffc451;
  font-weight: 500;
}

.no-results {
  text-align: center;
  padding: 4rem 2rem;
  background: rgba(255, 255, 255, 0.03);
  border-radius: 8px;
  color: #d0cac4;
}

.no-results p {
  margin: 0.5rem 0;
  font-size: 1rem;
}

.search-tips {
  max-width: 600px;
  margin: 3rem auto;
  padding: 2rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 196, 81, 0.15);
  border-radius: 8px;
}

.search-tips h2 {
  margin-bottom: 1.5rem;
  color: #ffc451;
  font-size: 1.3rem;
}

.search-tips ul {
  list-style: none;
  padding: 0;
}

.search-tips li {
  padding: 0.75rem 0;
  color: #d0cac4;
  font-size: 0.95rem;
}

.search-tips li:before {
  content: "→ ";
  color: #ffc451;
  margin-right: 0.75rem;
  font-weight: 600;
}

@media (max-width: 768px) {
  .search-page {
    padding: 2rem 1rem;
  }

  .search-header h1 {
    font-size: 2rem;
  }

  .search-input-wrapper {
    flex-direction: column;
  }

  .search-input,
  .search-button {
    width: 100%;
  }

  .search-filters {
    flex-direction: column;
  }

  .filter-select {
    width: 100%;
  }

  .result-item:hover {
    transform: translateX(4px);
  }
}
</style>
