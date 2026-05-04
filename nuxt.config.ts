// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // Metadata
  app: {
    head: {
      title: 'Diaspora - A Genshin-Inspired Blog',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Diaspora blog with Genshin Impact design' },
        { name: 'keywords', content: 'blog, diaspora, genshin, impact' },
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/img/144.png' },
      ],
    },
  },

  // Compatible preset
  compatibilityDate: '2024-04-03',

  // Modules
  modules: [
    '@vueuse/nuxt',
  ],

  // Build configuration
  build: {
    transpile: ['slugify', 'aos'],
  },

  // Runtime config
  runtimeConfig: {
    public: {
      siteTitle: 'SHIZUE',
      siteSubtitle: 'at ur service',
      siteDescription: 'Modern blog with beautiful animations',
      siteKeywords: 'blog, diaspora, modern, animation',
      siteAuthor: 'Your Name',
      siteLanguage: 'en',
      siteRoot: '/',
    },
  },

  // CSS
  css: [
    '~/assets/css/genshin-loader.css',
    '~/assets/css/genshin-polish.css',
    '~/assets/css/diaspora.css',
    '~/assets/css/global.css',
  ],

  // Alias
  alias: {
    '@': '/<srcDir>',
    '@components': '/<srcDir>/components',
    '@composables': '/<srcDir>/composables',
    '@server': '/<srcDir>/server',
  },

  // Server
  nitro: {
    prerender: {
      crawlLinks: true,
      routes: ['/sitemap.xml', '/rss.xml'],
      ignore: ['/admin'],
    },
  },

  // Experimental features
  experimental: {
    payloadExtraction: false,
  },

  // Future features
  future: {
    compatibilityVersion: 4,
  },

  // Dev server
  devServer: {
    host: 'localhost',
    port: 3000,
  },

  // Logging
  logLevel: 'info',
})
