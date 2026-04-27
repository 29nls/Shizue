import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

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
  } catch {
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

// Simple spam filter
function isSpam(content: string): boolean {
  const spamKeywords = [
    'viagra', 'cialis', 'casino', 'poker', 'lottery',
    'bitcoin', 'crypto', 'forex', 'trading', 'buy now',
    'click here', 'href=', 'http://', 'https://'
  ]
  
  const lowerContent = content.toLowerCase()
  return spamKeywords.some(keyword => lowerContent.includes(keyword))
}

// Email validation
function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export default defineEventHandler(async (event) => {
  if (event.req.method !== 'POST') {
    return { error: 'Method not allowed' }
  }

  try {
    const body = await readBody(event)
    const { postSlug, author, email, content } = body

    // Validation
    if (!postSlug || !author || !email || !content) {
      return { error: 'Missing required fields', statusCode: 400 }
    }

    if (!isValidEmail(email)) {
      return { error: 'Invalid email address', statusCode: 400 }
    }

    if (content.length < 3 || content.length > 5000) {
      return { error: 'Comment must be between 3 and 5000 characters', statusCode: 400 }
    }

    if (author.length > 100 || content.length > 5000) {
      return { error: 'Input too long', statusCode: 400 }
    }

    if (isSpam(content)) {
      return { error: 'Comment appears to contain spam', statusCode: 400 }
    }

    // Create comment
    const newComment: Comment = {
      id: crypto.randomBytes(8).toString('hex'),
      postSlug,
      author: author.substring(0, 100),
      email,
      content: content.substring(0, 5000),
      date: new Date().toISOString(),
      approved: false // Moderate by default
    }

    // Add to file
    const allComments = await readComments()
    allComments.push(newComment)
    await writeComments(allComments)

    return {
      success: true,
      message: 'Comment submitted for moderation',
      comment: {
        id: newComment.id,
        author: newComment.author,
        content: newComment.content,
        date: newComment.date
      }
    }
  } catch (error) {
    console.error('Error posting comment:', error)
    return { error: 'Failed to post comment', statusCode: 500 }
  }
})
