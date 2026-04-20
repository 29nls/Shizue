interface Post {
  slug: string
  title: string
  date: string
  author: string
  categories: string[]
  tags: string[]
  excerpt: string
  content: string
  cover: string
}

export const usePostFetching = () => {
  const posts = ref<Post[]>([])
  const categories = ref<string[]>([])
  const tags = ref<string[]>([])
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Fetch all posts
  const fetchPosts = async (): Promise<Post[]> => {
    try {
      loading.value = true
      error.value = null
      const response = await $fetch<Post[]>('/api/posts')
      posts.value = response
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch posts'
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch single post by slug
  const fetchPost = async (slug: string): Promise<Post | null> => {
    try {
      loading.value = true
      error.value = null
      const response = await $fetch<Post>(`/api/posts/${slug}`)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch post'
      return null
    } finally {
      loading.value = false
    }
  }

  // Fetch categories
  const fetchCategories = async (): Promise<string[]> => {
    try {
      loading.value = true
      error.value = null
      const response = await $fetch<string[]>('/api/categories')
      categories.value = response
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch categories'
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch posts by category
  const fetchPostsByCategory = async (category: string): Promise<Post[]> => {
    try {
      loading.value = true
      error.value = null
      const response = await $fetch<Post[]>(`/api/categories/${category}`)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch posts'
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch tags
  const fetchTags = async (): Promise<string[]> => {
    try {
      loading.value = true
      error.value = null
      const response = await $fetch<string[]>('/api/tags')
      tags.value = response
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch tags'
      return []
    } finally {
      loading.value = false
    }
  }

  // Fetch posts by tag
  const fetchPostsByTag = async (tag: string): Promise<Post[]> => {
    try {
      loading.value = true
      error.value = null
      const response = await $fetch<Post[]>(`/api/tags/${tag}`)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to fetch posts'
      return []
    } finally {
      loading.value = false
    }
  }

  // Search posts
  const searchPosts = async (query: string): Promise<Post[]> => {
    try {
      loading.value = true
      error.value = null
      const response = await $fetch<Post[]>(`/api/search?q=${encodeURIComponent(query)}`)
      return response
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Failed to search posts'
      return []
    } finally {
      loading.value = false
    }
  }

  return {
    posts: readonly(posts),
    categories: readonly(categories),
    tags: readonly(tags),
    loading: readonly(loading),
    error: readonly(error),
    fetchPosts,
    fetchPost,
    fetchCategories,
    fetchPostsByCategory,
    fetchTags,
    fetchPostsByTag,
    searchPosts,
  }
}
