import { promises as fs } from 'fs'
import path from 'path'

interface Comment {
  id: string
  postSlug: string
  author: string
  email: string
  content: string
  date: string
  approved: boolean
}

function getCommentsFile(): string {
  return path.join(process.cwd(), 'data', 'comments.json')
}

async function ensureCommentsFile() {
  const file = getCommentsFile()
  try {
    await fs.access(file)
  } catch {
    await fs.writeFile(file, JSON.stringify([]), 'utf-8')
  }
}

async function readComments(): Promise<Comment[]> {
  try {
    await ensureCommentsFile()
    const content = await fs.readFile(getCommentsFile(), 'utf-8')
    return JSON.parse(content)
  } catch (error) {
    console.error('Error reading comments:', error)
    return []
  }
}

async function writeComments(comments: Comment[]) {
  try {
    await fs.writeFile(getCommentsFile(), JSON.stringify(comments, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing comments:', error)
  }
}

export default defineEventHandler(async (event) => {
  const postSlug = getRouterParam(event, 'slug')

  if (!postSlug) {
    return { comments: [] }
  }

  try {
    const allComments = await readComments()
    const postComments = allComments
      .filter(c => c.postSlug === postSlug && c.approved)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())

    return {
      postSlug,
      count: postComments.length,
      comments: postComments
    }
  } catch (error) {
    console.error('Error fetching comments:', error)
    return { comments: [] }
  }
})
