// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  // Metadata
  app: {
    head: {
      title: 'MACENG MARKET - Dragon Nest Item Store',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Toko item Dragon Nest terlengkap dan terpercaya' },
        { name: 'keywords', content: 'dragon nest, item, store, maceng, market' },
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
      siteTitle: 'MACENG MARKET',
      siteSubtitle: 'Dragon Nest Item Store',
      siteDescription: 'Perlengkapan Dragon Nest terlengkap dan terpercaya',
      siteKeywords: 'dragon nest, item, store, equipment, consumables',
      siteAuthor: 'Your Name',
      siteLanguage: 'en',
      siteRoot: '/',
    },
  },

  // CSS
  css: [
    '~/assets/css/maceng-loader.css',
    '~/assets/css/maceng-polish.css',
    '~/assets/css/maceng-store.css',
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
      crawlLinks: false,
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
