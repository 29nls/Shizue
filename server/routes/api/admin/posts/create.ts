import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'

export default defineEventHandler(async (event) => {
  const method = event.req.method

  if (method !== 'POST') {
    return { error: 'Method not allowed' }
  }

  try {
    const body = await readBody(event)
    const { title, excerpt, content, categories, tags, author, cover } = body

    if (!title || !content) {
      return { error: 'Title and content required' }
    }

    // Generate slug from title
    const slug = title
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')

    // Check if post already exists
    const postsDir = path.join(process.cwd(), 'data', 'posts')
    const filePath = path.join(postsDir, `${slug}.md`)

    try {
      await fs.access(filePath)
      return { error: 'Post with this title already exists' }
    } catch {
      // File doesn't exist, continue
    }

    const frontmatter = {
      title,
      excerpt,
      categories: categories || [],
      tags: tags || [],
      author: author || 'Anonymous',
      cover: cover || '/default-post-cover.jpg',
      date: new Date().toISOString()
    }

    const fileContent = `---\n${yaml.stringify(frontmatter)}---\n${content}`

    await fs.writeFile(filePath, fileContent, 'utf-8')

    return {
      success: true,
      message: 'Post created successfully',
      slug
    }
  } catch (error) {
    console.error('Error creating post:', error)
    return { error: 'Failed to create post' }
  }
})
