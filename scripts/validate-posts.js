const fs = require('fs');
const path = require('path');
const YAML = require('yaml');

/**
 * Validate all markdown files in data/posts/
 */
const validatePosts = () => {
  const postsDir = path.join(__dirname, '../data/posts');
  const files = fs.readdirSync(postsDir).filter(f => f.endsWith('.md'));

  let errors = 0;
  let warnings = 0;

  console.log(`📋 Validating ${files.length} posts...\n`);

  files.forEach(file => {
    const filePath = path.join(postsDir, file);
    const content = fs.readFileSync(filePath, 'utf8');

    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) {
      console.error(`❌ ${file}: Missing YAML frontmatter`);
      errors++;
      return;
    }

    let frontmatter = {};
    try {
      frontmatter = YAML.parse(match[1]) || {};
    } catch (error) {
      console.error(`❌ ${file}: Invalid YAML - ${error.message}`);
      errors++;
      return;
    }

    // Check required fields
    if (!frontmatter.title) {
      console.warn(`⚠️  ${file}: Missing title`);
      warnings++;
    }

    if (!frontmatter.date) {
      console.warn(`⚠️  ${file}: Missing date`);
      warnings++;
    }

    console.log(`✅ ${file}`);
  });

  console.log(`\n📊 Results: ${files.length} files, ${errors} errors, ${warnings} warnings`);
  process.exit(errors > 0 ? 1 : 0);
};

validatePosts();
