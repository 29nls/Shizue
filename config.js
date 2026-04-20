const fs = require('fs');
const path = require('path');
const YAML = require('yaml');
require('dotenv').config();

const configPath = path.join(__dirname, 'config', 'config.yml');

// Load YAML configuration
const loadYamlConfig = () => {
  try {
    const fileContents = fs.readFileSync(configPath, 'utf8');
    return YAML.parse(fileContents);
  } catch (error) {
    console.error('Error loading config.yml:', error);
    return {};
  }
};

// Merge environment variables with YAML config
const yamlConfig = loadYamlConfig();

const config = {
  // Server
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: (process.env.NODE_ENV || 'development') === 'development',
  isProd: (process.env.NODE_ENV || 'development') === 'production',

  // Site
  site: {
    title: process.env.SITE_TITLE || yamlConfig.title || 'My Blog',
    subtitle: process.env.SITE_SUBTITLE || yamlConfig.subtitle || '',
    description: process.env.SITE_DESCRIPTION || yamlConfig.description || '',
    author: process.env.SITE_AUTHOR || yamlConfig.author || '',
    url: process.env.SITE_URL || yamlConfig.url || 'http://localhost:3000',
    root: process.env.SITE_ROOT || yamlConfig.root || '/',
    language: process.env.LANGUAGE || yamlConfig.language || 'en',
    timezone: process.env.TIMEZONE || yamlConfig.timezone || 'UTC',
    keywords: yamlConfig.keywords || '',
  },

  // Menu
  menu: yamlConfig.menu || {
    '首页': '/',
    '分类': '/categories',
    '标签': '/tags',
    '归档': '/archives',
  },

  // Social Links
  links: yamlConfig.links || {},

  // Theme Assets
  theme: {
    welcomeCover: yamlConfig.welcome_cover || '/img/welcome-cover.jpg',
    covers: yamlConfig.covers || [],
    favicon: yamlConfig.favicon || '/img/favicon.png',
    scrollbar: yamlConfig.scrollbar !== false,
  },

  // Features
  features: {
    localSearch: process.env.ENABLE_LOCAL_SEARCH === 'true' || yamlConfig.local_search?.enable || false,
    hitokoto: process.env.ENABLE_HITOKOTO === 'true' || yamlConfig.hitokoto !== false,
    mathjax: process.env.ENABLE_MATHJAX === 'true' || yamlConfig.mathjax !== false,
    gitalk: process.env.ENABLE_GITALK === 'true' || yamlConfig.gitalk?.enable || false,
    autoplayAudio: process.env.ENABLE_AUTOPLAY_AUDIO === 'true' || yamlConfig.autoplay !== false,
  },

  // Audio
  audio: {
    autoplay: yamlConfig.autoplay || false,
    mp3List: yamlConfig.mp3 || [],
  },

  // Pagination
  pagination: {
    postsPerPage: parseInt(yamlConfig.pagination?.postsPerPage || process.env.POSTS_PER_PAGE || '10', 10),
  },

  // External Services
  services: {
    googleAnalytics: process.env.GOOGLE_ANALYTICS_ID || yamlConfig.google_analytics || '',
    gitalk: {
      clientID: process.env.GITALK_CLIENT_ID || yamlConfig.gitalk?.clientID || '',
      clientSecret: process.env.GITALK_CLIENT_SECRET || yamlConfig.gitalk?.clientSecret || '',
      repo: process.env.GITALK_REPO || yamlConfig.gitalk?.repo || '',
      owner: process.env.GITALK_OWNER || yamlConfig.gitalk?.owner || '',
      admin: process.env.GITALK_ADMIN?.split(',') || yamlConfig.gitalk?.admin || [],
    },
  },

  // Beian (Chinese ICP)
  beian: {
    enable: process.env.ENABLE_BEIAN === 'true' || yamlConfig.beian?.enable || false,
    enableFooter: yamlConfig.beian?.enableFooter || false,
    info: process.env.BEIAN_INFO || yamlConfig.beian?.beianInfo || '',
    link: process.env.BEIAN_LINK || yamlConfig.beian?.link || 'http://www.beian.miit.gov.cn',
  },

  // Cache
  cache: {
    enable: process.env.ENABLE_CACHE === 'true' || true,
    ttl: parseInt(process.env.CACHE_TTL || '3600', 10),
  },

  // Paths
  paths: {
    postsDir: path.join(__dirname, 'data', 'posts'),
    pagesDir: path.join(__dirname, 'data', 'pages'),
    viewsDir: path.join(__dirname, 'views'),
    publicDir: path.join(__dirname, 'public'),
  },
};

module.exports = config;
