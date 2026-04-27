import { promises as fs } from 'fs'
import path from 'path'

interface Subscriber {
  id: string
  email: string
  date: string
  verified: boolean
}

function getSubscribersFile(): string {
  return path.join(process.cwd(), 'data', 'subscribers.json')
}

async function ensureSubscribersFile() {
  const file = getSubscribersFile()
  try {
    await fs.access(file)
  } catch {
    await fs.writeFile(file, JSON.stringify([]), 'utf-8')
  }
}

async function readSubscribers(): Promise<Subscriber[]> {
  try {
    await ensureSubscribersFile()
    const content = await fs.readFile(getSubscribersFile(), 'utf-8')
    return JSON.parse(content)
  } catch {
    return []
  }
}

async function writeSubscribers(subscribers: Subscriber[]) {
  try {
    await fs.writeFile(getSubscribersFile(), JSON.stringify(subscribers, null, 2), 'utf-8')
  } catch (error) {
    console.error('Error writing subscribers:', error)
  }
}

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
    const { email } = body

    if (!email) {
      return { error: 'Email is required', statusCode: 400 }
    }

    if (!isValidEmail(email)) {
      return { error: 'Invalid email address', statusCode: 400 }
    }

    const subscribers = await readSubscribers()

    // Check if already subscribed
    const existing = subscribers.find(
      s => s.email.toLowerCase() === email.toLowerCase()
    )

    if (existing) {
      return { error: 'Already subscribed', statusCode: 400 }
    }

    // Add new subscriber
    const newSubscriber: Subscriber = {
      id: Math.random().toString(36).substring(2, 11),
      email: email.toLowerCase(),
      date: new Date().toISOString(),
      verified: false
    }

    subscribers.push(newSubscriber)
    await writeSubscribers(subscribers)

    return {
      success: true,
      message: 'Successfully subscribed! Check your email for confirmation.',
      email: email
    }
  } catch (error) {
    console.error('Error subscribing:', error)
    return { error: 'Failed to subscribe', statusCode: 500 }
  }
})
