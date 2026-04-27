import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'

export default defineEventHandler(async (event) => {
  const method = event.req.method
  const slug = getRouterParam(event, 'slug')

  if (method === 'GET') {
    // GET single post for editing
    try {
      const postsDir = path.join(process.cwd(), 'data', 'posts')
      const filePath = path.join(postsDir, `${slug}.md`)

      const content = await fs.readFile(filePath, 'utf-8')
      const frontmatterRegex = /^---\n([\s\S]*?)\n---\n([\s\S]*)$/
      const match = content.match(frontmatterRegex)

      if (match) {
        const frontmatter = yaml.parse(match[1])
        return {
          slug,
          ...frontmatter,
          content: match[2]
        }
      }

      throw new Error('Invalid frontmatter')
    } catch (error) {
      return { error: 'Post not found' }
    }
  }

  if (method === 'PUT') {
    // UPDATE post
    try {
      const body = await readBody(event)
      const { title, excerpt, content, categories, tags, author, cover, date } = body

      if (!title || !content) {
        return { error: 'Title and content required' }
      }

      const frontmatter = {
        title,
        excerpt,
        categories: categories || [],
        tags: tags || [],
        author: author || 'Anonymous',
        cover: cover || '/default-post-cover.jpg',
        date: date || new Date().toISOString()
      }

      const fileContent = `---\n${yaml.stringify(frontmatter)}---\n${content}`

      const postsDir = path.join(process.cwd(), 'data', 'posts')
      const filePath = path.join(postsDir, `${slug}.md`)

      await fs.writeFile(filePath, fileContent, 'utf-8')

      return {
        success: true,
        message: 'Post updated successfully',
        slug
      }
    } catch (error) {
      console.error('Error updating post:', error)
      return { error: 'Failed to update post' }
    }
  }

  if (method === 'DELETE') {
    // DELETE post
    try {
      const postsDir = path.join(process.cwd(), 'data', 'posts')
      const filePath = path.join(postsDir, `${slug}.md`)

      await fs.unlink(filePath)

      return {
        success: true,
        message: 'Post deleted successfully'
      }
    } catch (error) {
      console.error('Error deleting post:', error)
      return { error: 'Failed to delete post' }
    }
  }

  return { error: 'Method not allowed' }
})
