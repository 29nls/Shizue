import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'

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

function getPostsDir(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'data', 'posts'),
    path.join(process.cwd(), 'public', 'posts'),
    path.join(process.cwd(), 'posts'),
  ]
  return possiblePaths[0]
}

function parsePost(content: string, slug: string): Post | null {
  try {
    const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)

    if (!match) return null

    const frontmatterText = match[1]
    const markdownContent = match[2]
    const frontmatter = yaml.parse(frontmatterText)

    return {
      slug,
      title: frontmatter.title || slug,
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      author: frontmatter.author || 'Unknown',
      categories: frontmatter.categories || [],
      tags: frontmatter.tags || [],
      excerpt: frontmatter.excerpt || markdownContent.substring(0, 200),
      content: markdownContent,
      cover: frontmatter.cover || '/images/default-cover.jpg',
    }
  } catch (error) {
    console.error(`Error parsing post ${slug}:`, error)
    return null
  }
}

async function getAllPosts(): Promise<Post[]> {
  const postsDir = getPostsDir()

  try {
    await fs.access(postsDir)
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

    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    return posts
  } catch (error) {
    console.error('Error loading posts:', error)
    return []
  }
}

export default defineEventHandler(async (event) => {
  const category = event.context.params?.category

  if (!category) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Category is required',
    })
  }

  try {
    const allPosts = await getAllPosts()
    const filteredPosts = allPosts.filter(post =>
      post.categories.includes(decodeURIComponent(category))
    )

    return filteredPosts
  } catch (error) {
    console.error('Error fetching category posts:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Error fetching posts',
    })
  }
})
