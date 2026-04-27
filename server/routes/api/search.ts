import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'

interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  categories: string[]
  content: string
}

interface SearchResult {
  slug: string
  title: string
  excerpt: string
  date: string
  categories: string[]
  score: number
}

function getPostsDir(): string {
  return path.join(process.cwd(), 'data', 'posts')
}

async function getAllPosts(): Promise<Post[]> {
  try {
    const postsDir = getPostsDir()
    const files = await fs.readdir(postsDir)
    const posts: Post[] = []

    for (const file of files) {
      if (!file.endsWith('.md')) continue

      const filePath = path.join(postsDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
      const match = content.match(frontmatterRegex)

      if (match) {
        const frontmatter = yaml.parse(match[1])
        const body = match[2]
        posts.push({
          slug: file.replace('.md', ''),
          title: frontmatter.title || '',
          excerpt: frontmatter.excerpt || body.substring(0, 200),
          date: frontmatter.date || new Date().toISOString(),
          categories: frontmatter.categories || [],
          content: body
        })
      }
    }

    return posts
  } catch (error) {
    console.error('Error reading posts:', error)
    return []
  }
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event).q as string
  const category = getQuery(event).category as string
  const dateRange = getQuery(event).dateRange as string

  if (!query || query.trim() === '') {
    return { results: [], query: '', count: 0 }
  }

  const allPosts = await getAllPosts()
  let results: (Post & { score: number })[] = []

  // Text search - calculate relevance score
  const searchTerms = query.toLowerCase().split(' ').filter(t => t.length > 0)
  
  results = allPosts
    .map(post => {
      const text = `${post.title} ${post.excerpt} ${post.content}`.toLowerCase()
      let score = 0

      // Title matches worth more
      const titleMatches = searchTerms.filter(term => post.title.toLowerCase().includes(term)).length
      score += titleMatches * 3

      // Excerpt matches
      const excerptMatches = searchTerms.filter(term => post.excerpt.toLowerCase().includes(term)).length
      score += excerptMatches * 2

      // Content matches
      const contentMatches = searchTerms.filter(term => text.includes(term)).length
      score += contentMatches

      return score > 0 ? { ...post, score } : null
    })
    .filter((p): p is Post & { score: number } => p !== null)

  // Filter by category if provided
  if (category) {
    const decodedCategory = decodeURIComponent(category)
    results = results.filter(p => p.categories.includes(decodedCategory))
  }

  // Filter by date range if provided
  if (dateRange) {
    const now = new Date()
    const postDate = new Date()

    switch (dateRange) {
      case 'week':
        postDate.setDate(postDate.getDate() - 7)
        break
      case 'month':
        postDate.setMonth(postDate.getMonth() - 1)
        break
      case 'year':
        postDate.setFullYear(postDate.getFullYear() - 1)
        break
    }

    results = results.filter(p => new Date(p.date) >= postDate)
  }

  // Sort by relevance score
  results.sort((a, b) => b.score - a.score)

  return {
    query,
    count: results.length,
    results: results.slice(0, 50).map(({ score, content, ...rest }) => rest)
  }
})
