import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'

interface Post {
  slug: string
  title: string
  excerpt: string
  date: string
  categories: string[]
  tags: string[]
  cover: string
}

interface RelatedPost extends Post {
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
        posts.push({
          slug: file.replace('.md', ''),
          title: frontmatter.title || '',
          excerpt: frontmatter.excerpt || '',
          date: frontmatter.date || new Date().toISOString(),
          categories: frontmatter.categories || [],
          tags: frontmatter.tags || [],
          cover: frontmatter.cover || '/default-post-cover.jpg'
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
  const currentSlug = getQuery(event).slug as string
  const limit = parseInt(getQuery(event).limit as string) || 3

  if (!currentSlug) {
    return { relatedPosts: [] }
  }

  try {
    const allPosts = await getAllPosts()
    const currentPost = allPosts.find(p => p.slug === currentSlug)

    if (!currentPost) {
      return { relatedPosts: [] }
    }

    // Score algorithm
    const scored: RelatedPost[] = allPosts
      .filter(p => p.slug !== currentSlug)
      .map(post => {
        let score = 0

        // Same category: +10 points per match
        const categoryMatches = post.categories.filter(cat =>
          currentPost.categories.includes(cat)
        ).length
        score += categoryMatches * 10

        // Same tag: +5 points per match
        const tagMatches = post.tags.filter(tag =>
          currentPost.tags.includes(tag)
        ).length
        score += tagMatches * 5

        // Recency bonus: newer posts get slight boost
        const postDate = new Date(post.date).getTime()
        const currentDate = new Date(currentPost.date).getTime()
        const daysDiff = (currentDate - postDate) / (1000 * 60 * 60 * 24)

        if (daysDiff < 30) {
          score += 3 // Recent posts within 30 days
        } else if (daysDiff < 90) {
          score += 1 // Moderately recent
        }

        return {
          ...post,
          score
        }
      })
      .filter(p => p.score > 0) // Only include posts with at least one match
      .sort((a, b) => b.score - a.score)
      .slice(0, limit)

    return {
      currentSlug,
      relatedPosts: scored.map(({ score, ...rest }) => rest)
    }
  } catch (error) {
    console.error('Error getting related posts:', error)
    return { relatedPosts: [] }
  }
})
