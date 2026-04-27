import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'

export default defineEventHandler(async (event) => {
  try {
    const postsDir = path.join(process.cwd(), 'data', 'posts')
    const files = await fs.readdir(postsDir)
    const posts = []

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
          author: frontmatter.author || 'Anonymous'
        })
      }
    }

    // Sort by date descending
    posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      count: posts.length,
      posts
    }
  } catch (error) {
    console.error('Error fetching posts:', error)
    return { posts: [] }
  }
})
