const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

/**
 * Generate search index from all posts
 */
const generateSearchIndex = async () => {
  const postsDir = path.join(__dirname, '../data/posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  const index = [];

  files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return;

    let frontmatter = {};
    try {
      frontmatter = YAML.parse(match[1]) || {};
    } catch (error) {
      console.error(`Error parsing ${file}:`, error);
      return;
    }

    const body = match[2];
    const slug = frontmatter.slug || generateSlugFromFilename(file);

    index.push({
      slug,
      title: frontmatter.title || 'Untitled',
      tags: frontmatter.tags || [],
      categories: frontmatter.categories || [],
      date: frontmatter.date || new Date().toISOString(),
      excerpt: frontmatter.excerpt || body.substring(0, 200),
    });
  });

  // Save index
  const indexPath = path.join(__dirname, '../data/search-index.json');
  fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));

  console.log(`✅ Generated search index with ${index.length} posts`);
};

const generateSlugFromFilename = (filename) => {
  let slug = filename.replace(/\.md$/, '');
  slug = slug.replace(/^\d{4}-\d{2}-\d{2}-/, '');
  return slug;
};

generateSearchIndex().catch(err => {
  console.error('Error generating index:', err);
  process.exit(1);
});
