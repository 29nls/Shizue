/**
 * Migration Script: JSON → Prisma Database
 * 
 * This script migrates all existing data from JSON files to PostgreSQL
 * Usage: npm run migrate:json-to-db
 * 
 * Steps:
 * 1. Reads all posts from data/posts/*.md
 * 2. Reads comments from data/comments.json
 * 3. Reads subscribers from data/subscribers.json
 * 4. Parses YAML frontmatter from posts
 * 5. Creates Prisma records in database
 */

import { PrismaClient } from '@prisma/client'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import YAML from 'yaml'
import slugify from 'slugify'

const prisma = new PrismaClient()
const __dirname = path.dirname(fileURLToPath(import.meta.url))

interface PostFrontmatter {
  title: string
  excerpt?: string
  author?: string
  categories?: string[]
  tags?: string[]
  coverImage?: string
  published?: boolean
  publishedAt?: string
  date?: string
  slug?: string
}

interface PostFile {
  title: string
  excerpt?: string
  slug: string
  content: string
  categories: string[]
  tags: string[]
  author: string
  coverImage?: string
  published: boolean
  publishedAt?: Date
}

/**
 * Parse markdown file with YAML frontmatter
 */
function parseMarkdownFile(filePath: string): PostFile {
  const fileContent = fs.readFileSync(filePath, 'utf-8')
  
  // Extract frontmatter (between --- markers)
  const frontmatterRegex = /^---\n([\s\S]*?)\n---\n/
  const match = fileContent.match(frontmatterRegex)
  
  if (!match) {
    throw new Error(`No frontmatter found in ${filePath}`)
  }
  
  const frontmatter = YAML.parse(match[1]!) as PostFrontmatter
  const markdown = fileContent.replace(frontmatterRegex, '')
  
  // Extract slug from filename (e.g., "my-post.md" → "my-post")
  const filename = path.basename(filePath, '.md')
  
  return {
    title: frontmatter.title,
    excerpt: frontmatter.excerpt || markdown.substring(0, 150),
    slug: frontmatter.slug || filename,
    content: markdown,
    categories: frontmatter.categories || [],
    tags: frontmatter.tags || [],
    author: frontmatter.author || 'Admin',
    coverImage: frontmatter.coverImage,
    published: frontmatter.published !== false,
    publishedAt: frontmatter.publishedAt 
      ? new Date(frontmatter.publishedAt)
      : frontmatter.date
      ? new Date(frontmatter.date)
      : new Date()
  }
}

/**
 * Migrate posts from data/posts/*.md
 */
async function migratePosts() {
  console.log('📝 Migrating posts...')
  
  const postsDir = path.join(__dirname, '../../data/posts')
  
  if (!fs.existsSync(postsDir)) {
    console.warn('⚠️  No posts directory found. Skipping posts migration.')
    return
  }
  
  const files = fs.readdirSync(postsDir).filter((f: string) => f.endsWith('.md'))
  
  let created = 0
  for (const file of files) {
    try {
      const postData = parseMarkdownFile(path.join(postsDir, file))
      
      // Check if post already exists
      const existing = await prisma.post.findUnique({
        where: { slug: postData.slug }
      })
      
      if (existing) {
        console.log(`⏭️  Post "${postData.title}" already exists, skipping...`)
        continue
      }
      
      await prisma.post.create({
        data: {
          title: postData.title,
          excerpt: postData.excerpt,
          slug: postData.slug,
          content: postData.content,
          categories: postData.categories.join(','),
          tags: postData.tags.join(','),
          author: postData.author,
          coverImage: postData.coverImage,
          published: postData.published,
          publishedAt: postData.publishedAt
        }
      })
      
      console.log(`✅ Post "${postData.title}" migrated`)
      created++
    } catch (error) {
      console.error(`❌ Error migrating post ${file}:`, error)
    }
  }
  
  console.log(`\n📊 Posts: ${created} created\n`)
}

/**
 * Migrate comments from data/comments.json
 */
async function migrateComments() {
  console.log('💬 Migrating comments...')
  
  const commentsFile = path.join(__dirname, '../../data/comments.json')
  
  if (!fs.existsSync(commentsFile)) {
    console.warn('⚠️  No comments file found. Skipping comments migration.')
    return
  }
  
  const commentsData = JSON.parse(fs.readFileSync(commentsFile, 'utf-8'))
  const comments = Array.isArray(commentsData) ? commentsData : []
  
  let created = 0
  for (const comment of comments) {
    try {
      // Find post by slug
      const post = await prisma.post.findUnique({
        where: { slug: comment.postSlug }
      })
      
      if (!post) {
        console.warn(`⚠️  Post "${comment.postSlug}" not found for comment, skipping...`)
        continue
      }
      
      await prisma.comment.create({
        data: {
          postId: post.id,
          author: comment.author,
          email: comment.email,
          content: comment.content,
          approved: comment.approved || false,
          createdAt: comment.date ? new Date(comment.date) : new Date()
        }
      })
      
      console.log(`✅ Comment from "${comment.author}" migrated`)
      created++
    } catch (error) {
      console.error(`❌ Error migrating comment:`, error)
    }
  }
  
  console.log(`\n📊 Comments: ${created} created\n`)
}

/**
 * Migrate subscribers from data/subscribers.json
 */
async function migrateSubscribers() {
  console.log('📧 Migrating subscribers...')
  
  const subscribersFile = path.join(__dirname, '../../data/subscribers.json')
  
  if (!fs.existsSync(subscribersFile)) {
    console.warn('⚠️  No subscribers file found. Skipping subscribers migration.')
    return
  }
  
  const subscribersData = JSON.parse(fs.readFileSync(subscribersFile, 'utf-8'))
  const subscribers = Array.isArray(subscribersData) ? subscribersData : []
  
  let created = 0
  for (const subscriber of subscribers) {
    try {
      // Check if already exists
      const existing = await prisma.subscriber.findUnique({
        where: { email: subscriber.email }
      })
      
      if (existing) {
        console.log(`⏭️  Subscriber "${subscriber.email}" already exists, skipping...`)
        continue
      }
      
      await prisma.subscriber.create({
        data: {
          email: subscriber.email,
          verified: subscriber.verified || false,
          createdAt: subscriber.date ? new Date(subscriber.date) : new Date()
        }
      })
      
      console.log(`✅ Subscriber "${subscriber.email}" migrated`)
      created++
    } catch (error) {
      console.error(`❌ Error migrating subscriber:`, error)
    }
  }
  
  console.log(`\n📊 Subscribers: ${created} created\n`)
}

/**
 * Create default settings
 */
async function createDefaultSettings() {
  console.log('⚙️  Creating default settings...')
  
  const existing = await prisma.settings.findFirst()
  
  if (existing) {
    console.log('⏭️  Settings already exist, skipping...')
    return
  }
  
  await prisma.settings.create({
    data: {
      siteTitle: 'SHIZUE',
      siteDescription: 'A beautiful Genshin-inspired blog',
      notifyAdminEmail: process.env.ADMIN_EMAIL,
      notifyOnComment: true,
      autoApproveComments: false,
      spamFilterEnabled: true
    }
  })
  
  console.log('✅ Default settings created\n')
}

/**
 * Main migration function
 */
async function main() {
  try {
    console.log('\n🚀 Starting JSON → Database Migration\n')
    console.log('=' .repeat(50) + '\n')
    
    await migratePosts()
    await migrateComments()
    await migrateSubscribers()
    await createDefaultSettings()
    
    console.log('=' .repeat(50))
    console.log('\n✅ Migration completed successfully!\n')
    console.log('📌 Next steps:')
    console.log('   1. Verify data in database: npx prisma studio')
    console.log('   2. Update API endpoints to use Prisma')
    console.log('   3. Test all features\n')
    
  } catch (error) {
    console.error('\n❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

// Run migration
main()
