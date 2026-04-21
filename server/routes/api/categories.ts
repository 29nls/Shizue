import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'

interface Post {
  categories: string[]
}

function getPostsDir(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'data', 'posts'),
    path.join(process.cwd(), 'public', 'posts'),
    path.join(process.cwd(), 'posts'),
  ]
  return possiblePaths[0]
}

async function getAllCategories(): Promise<string[]> {
  const postsDir = getPostsDir()
  const categories = new Set<string>()

  try {
    await fs.access(postsDir)
    const files = await fs.readdir(postsDir)
    const mdFiles = files.filter(f => f.endsWith('.md'))

    for (const file of mdFiles) {
      const filePath = path.join(postsDir, file)
      const content = await fs.readFile(filePath, 'utf-8')

      const frontmatterRegex = /^---\n([\s\S]*?)\n---/
      const match = content.match(frontmatterRegex)

      if (match) {
        const frontmatter = yaml.parse(match[1])
        if (frontmatter.categories && Array.isArray(frontmatter.categories)) {
          frontmatter.categories.forEach((cat: string) => categories.add(cat))
        }
      }
    }

    return Array.from(categories).sort()
  } catch (error) {
    console.error('Error loading categories:', error)
    return []
  }
}

export default defineEventHandler(async (event) => {
  return await getAllCategories()
})
