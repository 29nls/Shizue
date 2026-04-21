import { promises as fs } from 'fs'
import path from 'path'
import yaml from 'yaml'

function getPostsDir(): string {
  const possiblePaths = [
    path.join(process.cwd(), 'data', 'posts'),
    path.join(process.cwd(), 'public', 'posts'),
    path.join(process.cwd(), 'posts'),
  ]
  return possiblePaths[0]
}

async function getAllTags(): Promise<string[]> {
  const postsDir = getPostsDir()
  const tags = new Set<string>()

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
        if (frontmatter.tags && Array.isArray(frontmatter.tags)) {
          frontmatter.tags.forEach((tag: string) => tags.add(tag))
        }
      }
    }

    return Array.from(tags).sort()
  } catch (error) {
    console.error('Error loading tags:', error)
    return []
  }
}

export default defineEventHandler(async (event) => {
  return await getAllTags()
})
