// https://nuxt.com/docs/api/configuration/nuxt-config

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',

  devtools: {
    enabled: true,
    timeline: {
      enabled: true
    }
  },

  css: ['~/assets/css/main.css'],

  modules: [
    '@nuxt/ui',
    '@nuxt/eslint',
    '@nuxtjs/sitemap',
    '@nuxt/image',
    '@nuxtjs/supabase'
  ],

  supabase: {
    redirect: true
  },

  sourcemap: {
    client: 'hidden'
  },

  site: {
    url: 'https://www.mysite.com.br',
    name: 'Finance Tracker',
    description: 'Finance Tracker - A simple app to track your finances',
    defaultLocale: 'pt-BR'
  },

  sitemap: {
    defaults: {
      lastmod: new Date().toISOString(),
      changefreq: 'monthly',
      priority: 1.0
    },
    enabled: true,
    urls: ['/']
  },

  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Finance Tracker',
      meta: [
        { name: 'title', content: 'Finance Tracker' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content: 'Finance Tracker is a simple app to track your finances'
        }
      ],
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap'
        },
        {
          rel: 'icon',
          type: 'image/x-icon',
          href: '/favicon.ico'
        },
        {
          rel: 'apple-touch-icon',
          href: '/apple-touch-icon.png'
        }
      ]
    }
  }
})
