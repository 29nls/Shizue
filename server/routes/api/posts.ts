import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'
import MarkdownIt from 'markdown-it'

const md = new MarkdownIt()

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

// Get posts data directory
function getPostsDir(): string {
  // Try different possible paths
  const possiblePaths = [
    path.join(process.cwd(), 'data', 'posts'),
    path.join(process.cwd(), 'public', 'posts'),
    path.join(process.cwd(), 'posts'),
  ]

  // Return first path (will exist after migration)
  return possiblePaths[0]
}

// Parse markdown file with frontmatter
function parsePost(content: string, slug: string): Post | null {
  try {
    // Split frontmatter from content
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)

    if (!match) return null

    const frontmatterText = match[1]
    const markdownContent = match[2]

    // Parse YAML frontmatter
    const frontmatter = yaml.parse(frontmatterText)

    // Convert markdown to HTML
    const htmlContent = md.render(markdownContent)

    return {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      author: frontmatter.author || 'Unknown',
      categories: frontmatter.categories || [],
      tags: frontmatter.tags || [],
      excerpt: frontmatter.excerpt || markdownContent.substring(0, 200),
      content: htmlContent,
      cover: frontmatter.cover || '/images/default-cover.jpg',
    }
  } catch (error) {
    console.error(`Error parsing post ${slug}:`, error)
    return null
  }
}

export default defineEventHandler(async (event) => {
  const postsDir = getPostsDir()

  try {
    // Check if directory exists
    await fs.access(postsDir)

    // Read all markdown files
    const files = await fs.readdir(postsDir)
    const mdFiles = files.filter(f => f.endsWith('.md'))

    const posts: Post[] = []

    for (const file of mdFiles) {
      const slug = file.replace('.md', '')
      const filePath = path.join(postsDir, file)
      const content = await fs.readFile(filePath, 'utf-8')
      const post = parsePost(content, slug)

      if (post) {
        posts.push(post)
      }
    }

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return posts
  } catch (error) {
    console.error('Error loading posts:', error)
    return []
  }
})
